from datetime import datetime, timedelta
from app.core.database import users_collection
from app.core.security import hash_password, verify_password, create_access_token
from app.models.user import UserCreate
from bson import ObjectId

def register_user(data):
    # Validar datos
    user_data = UserCreate(**data)
    
    # Verificar si usuario ya existe
    existing_user = users_collection.find_one({"email": user_data.email})
    if existing_user:
        raise ValueError("User already exists")
    
    # Hashear contraseña
    hashed_password = hash_password(user_data.password)
    
    # Preparar datos para MongoDB
    user_doc = {
        "email": user_data.email,
        "name": user_data.name,
        "phone": user_data.phone,
        "role": user_data.role,
        "password": hashed_password,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Insertar en base de datos
    result = users_collection.insert_one(user_doc)
    user_id = str(result.inserted_id)
    
    # Crear token
    access_token = create_access_token(
        data={"sub": user_id, "role": user_data.role},
        expires_delta=timedelta(days=1)
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "email": user_data.email,
            "name": user_data.name,
            "role": user_data.role
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
    
    # Verificar contraseña
    if not verify_password(password, user['password']):
        raise ValueError("Invalid credentials")
    
    user_id = str(user['_id'])
    
    # Crear token
    access_token = create_access_token(
        data={"sub": user_id, "role": user['role']},
        expires_delta=timedelta(days=1)
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "email": user['email'],
            "name": user.get('name'),
            "role": user['role']
        }
    }

def get_current_user(token_payload):
    user_id = token_payload.get("sub")
    
    if not user_id:
        raise ValueError("Invalid token")
    
    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
    except Exception:
        raise ValueError("User not found")
    
    if not user:
        raise ValueError("User not found")
    
    return {
        "id": str(user['_id']),
        "email": user['email'],
        "name": user.get('name'),
        "role": user['role']
    }
