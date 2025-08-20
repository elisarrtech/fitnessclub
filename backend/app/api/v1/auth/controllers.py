import jwt
import bcrypt
from datetime import datetime, timedelta
import os
from app.core.database import users_collection, serialize_mongo_id
from app.models.user import UserCreate, Role

def register_user(data):
    # Validar datos de entrada
    try:
        user_data = UserCreate(**data)
    except Exception as e:
        raise ValueError(f"Invalid data: {str(e)}")
    
    # Verificar si el usuario ya existe
    existing_user = users_collection.find_one({"email": user_data.email})
    if existing_user:
        raise ValueError("User already exists")
    
    # Hashear password
    hashed_password = bcrypt.hashpw(
        user_data.password.encode('utf-8'), 
        bcrypt.gensalt()
    ).decode('utf-8')
    
    # Preparar datos para guardar
    user_dict = user_data.model_dump()
    user_dict['password'] = hashed_password
    user_dict['created_at'] = datetime.utcnow()
    user_dict['updated_at'] = datetime.utcnow()
    
    # Guardar en DB
    result = users_collection.insert_one(user_dict)
    user_dict['id'] = str(result.inserted_id)
    
    # Generar token
    token = generate_token(str(result.inserted_id), user_data.role.value)
    
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
    
    if not email or not password:
        raise ValueError("Email and password are required")
    
    # Buscar usuario
    user = users_collection.find_one({"email": email})
    if not user:
        raise ValueError("Invalid credentials")
    
    # Verificar password
    if not bcrypt.checkpw(
        password.encode('utf-8'), 
        user['password'].encode('utf-8')
    ):
        raise ValueError("Invalid credentials")
    
    # Generar token
    token = generate_token(str(user['_id']), user['role'])
    
    # Serializar usuario para respuesta
    serialized_user = serialize_mongo_id(user.copy())
    
    return {
        "token": token,
        "user": {
            "id": serialized_user['id'],
            "email": serialized_user['email'],
            "name": serialized_user.get('name'),
            "role": serialized_user['role']
        }
    }

def generate_token(user_id, role):
    payload = {
        'user_id': user_id,
        'role': role,
        'exp': datetime.utcnow() + timedelta(days=1)
    }
    return jwt.encode(
        payload, 
        os.environ.get('SECRET_KEY', 'dev-secret-key'), 
        algorithm='HS256'
    )
