# app/services/user_service.py
from app.core.database import users_collection, serialize_mongo_id
from app.models.user import User, UserCreate
from typing import List, Optional
from bson import ObjectId
import bcrypt
from datetime import datetime

async def get_user_by_email(email: str) -> Optional[dict]:
    """Obtener usuario por email"""
    user = users_collection.find_one({"email": email})
    if user:
        return serialize_mongo_id(user)
    return None

async def get_user_by_id(user_id: str) -> Optional[dict]:
    """Obtener usuario por ID"""
    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if user:
            return serialize_mongo_id(user)
        return None
    except Exception:
        return None

async def create_user(user_data: UserCreate) -> dict:
    """Crear nuevo usuario"""
    # Verificar que el email no exista
    if await get_user_by_email(user_data.email):
        raise ValueError("El email ya está registrado")
    
    # Hashear contraseña
    hashed_password = bcrypt.hashpw(user_data.password.encode('utf-8'), bcrypt.gensalt())
    
    # Crear documento de usuario
    user_doc = {
        "email": user_data.email,
        "name": user_data.name,
        "phone": user_data.phone,
        "role": user_data.role.value,
        "password_hash": hashed_password.decode('utf-8'),
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }
    
    # Insertar en base de datos
    result = users_collection.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id
    return serialize_mongo_id(user_doc)

async def get_all_users() -> List[dict]:
    """Obtener todos los usuarios"""
    users = []
    for user in users_collection.find():
        users.append(serialize_mongo_id(user))
    return users

async def update_user(user_id: str, update_data: dict) -> Optional[dict]:
    """Actualizar usuario"""
    try:
        update_data["updated_at"] = datetime.now()
        result = users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )
        if result.modified_count > 0:
            return await get_user_by_id(user_id)
        return None
    except Exception:
        return None

async def delete_user(user_id: str) -> bool:
    """Eliminar usuario"""
    try:
        result = users_collection.delete_one({"_id": ObjectId(user_id)})
        return result.deleted_count > 0
    except Exception:
        return False
