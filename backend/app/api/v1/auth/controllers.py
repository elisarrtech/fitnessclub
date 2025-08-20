from datetime import timedelta
from app.core.database import users_collection
from app.core.security import hash_password, verify_password, create_access_token
from app.models.user import UserCreate, Role

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
    user_dict = user_data.model_dump()
    user_dict['password'] = hashed_password
    user_dict['created_at'] = user_dict['updated_at'] = None  # Se seteará en DB
    
    # Insertar en base de datos
    result = users_collection.insert_one({
        "email": user_dict['email'],
        "name": user_dict.get('name'),
        "phone": user_dict.get('phone'),
        "role": user_dict['role'],
        "password": user_dict['password'],
        "created_at": "$$NOW",
        "updated_at": "$$NOW"
    })
    
    # Crear token
    access_token = create_access_token(
        data={"sub": str(result.inserted_id), "role": user_dict['role']},
        expires_delta=timedelta(days=1)
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(result.inserted_id),
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
    
    # Verificar contraseña
    if not verify_password(password, user['password']):
        raise ValueError("Invalid credentials")
    
    # Crear token
    access_token = create_access_token(
        data={"sub": str(user['_id']), "role": user['role']},
        expires_delta=timedelta(days=1)
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user['_id']),
            "email": user['email'],
            "name": user.get('name'),
            "role": user['role']
        }
    }

def get_current_user(token_payload):
    user_id = token_payload.get("sub")
    user = users_collection.find_one({"_id": user_id})
    
    if not user:
        raise ValueError("User not found")
    
    return {
        "id": str(user['_id']),
        "email": user['email'],
        "name": user.get('name'),
        "role": user['role']
    }
