import jwt
import bcrypt
from datetime import datetime, timedelta
from app.models.user import UserCreate, User
from app.database import db
import os

def register_user(data):
    # Verificar si el usuario ya existe
    existing_user = db.users.find_one({"email": data.get("email")})
    if existing_user:
        raise Exception("User already exists")
    
    # Crear nuevo usuario
    user_data = UserCreate(**data)
    
    # Hashear password
    hashed_password = bcrypt.hashpw(user_data.password.encode('utf-8'), bcrypt.gensalt())
    
    # Guardar en DB
    user_dict = user_data.model_dump()
    user_dict['password'] = hashed_password.decode('utf-8')
    user_dict['created_at'] = datetime.now()
    user_dict['updated_at'] = datetime.now()
    
    result = db.users.insert_one(user_dict)
    user_dict['id'] = str(result.inserted_id)
    
    # Generar token
    token = generate_token(str(result.inserted_id), user_data.role)
    
    return {
        "token": token,
        "user": {
            "id": user_dict['id'],
            "email": user_dict['email'],
            "name": user_dict.get('name'),
            "role": user_dict['role']
        }
    }

def login_user(data):
    email = data.get("email")
    password = data.get("password")
    
    # Buscar usuario
    user = db.users.find_one({"email": email})
    if not user:
        raise Exception("Invalid credentials")
    
    # Verificar password
    if not bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        raise Exception("Invalid credentials")
    
    # Generar token
    token = generate_token(str(user['_id']), user['role'])
    
    return {
        "token": token,
        "user": {
            "id": str(user['_id']),
            "email": user['email'],
            "name": user.get('name'),
            "role": user['role']
        }
    }

def generate_token(user_id, role):
    payload = {
        'user_id': user_id,
        'role': role,
        'exp': datetime.utcnow() + timedelta(days=1)
    }
    return jwt.encode(payload, os.environ.get('SECRET_KEY', 'dev-secret-key'), algorithm='HS256')
