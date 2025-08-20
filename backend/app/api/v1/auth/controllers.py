from datetime import datetime, timedelta
from app.core.database import users_collection
from app.core.security import hash_password, verify_password, create_access_token
from app.models.user import UserCreate
import traceback

def register_user(data):
    # Verificar que la conexión a MongoDB esté disponible
    if users_collection is None:
        raise Exception("Database connection failed - Service temporarily unavailable")
    
    try:
        print("=== REGISTER USER ===")
        print(f"Input data: {data}")
        
        # Validar datos
        user_data = UserCreate(**data)
        print(f"Validated data: {user_data}")
        
        # Verificar si usuario ya existe
        print("Checking if user exists...")
        existing_user = users_collection.find_one({"email": user_data.email})
        print(f"Existing user: {existing_user}")
        
        if existing_user:
            raise ValueError("User already exists")
        
        # Hashear contraseña
        print("Hashing password...")
        hashed_password = hash_password(user_data.password)
        print("Password hashed successfully")
        
        # Preparar datos para MongoDB
        user_doc = {
            "email": user_data.email,
            "name": user_data.name,
            "phone": user_data.phone,
            "role": str(user_data.role),  # Convertir a string
            "password": hashed_password,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        print(f"Document to insert: {user_doc}")
        
        # Insertar en base de datos
        result = users_collection.insert_one(user_doc)
        user_id = str(result.inserted_id)
        print(f"User created with ID: {user_id}")
        
        # Crear token
        access_token = create_access_token(
            data={"sub": user_id, "role": str(user_data.role)},
            expires_delta=timedelta(days=1)
        )
        print("Token created successfully")
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user_id,
                "email": user_data.email,
                "name": user_data.name,
                "role": str(user_data.role)
            }
        }
        
    except Exception as e:
        print(f"Error in register_user: {e}")
        traceback.print_exc()
        raise

def login_user(data):
    # Verificar que la conexión a MongoDB esté disponible
    if users_collection is None:
        raise Exception("Database connection failed")
    
    try:
        print("=== LOGIN USER ===")
        print(f"Input data: {data}")
        
        email = data.get("email")
        password = data.get("password")
        
        if not email or not password:
            raise ValueError("Email and password are required")
        
        # Buscar usuario
        print("Searching for user...")
        user = users_collection.find_one({"email": email})
        print(f"User found: {user}")
        
        if not user:
            raise ValueError("Invalid credentials")
        
        # Verificar contraseña
        print("Verifying password...")
        if not verify_password(password, user['password']):
            raise ValueError("Invalid credentials")
        
        user_id = str(user['_id'])
        print(f"Login successful for user ID: {user_id}")
        
        # Crear token
        access_token = create_access_token(
            data={"sub": user_id, "role": user['role']},
            expires_delta=timedelta(days=1)
        )
        print("Token created successfully")
        
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
        
    except Exception as e:
        print(f"Error in login_user: {e}")
        traceback.print_exc()
        raise
