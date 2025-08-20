# app/services/instructor_service.py
from app.core.database import instructors_collection, users_collection, serialize_mongo_id
from app.models.instructor import Instructor, InstructorCreate
from typing import List, Optional
from bson import ObjectId
from datetime import datetime

async def get_instructor_by_id(instructor_id: str) -> Optional[dict]:
    """Obtener instructor por ID"""
    try:
        instructor = instructors_collection.find_one({"_id": ObjectId(instructor_id)})
        if instructor:
            return serialize_mongo_id(instructor)
        return None
    except Exception:
        return None

async def get_instructor_by_email(email: str) -> Optional[dict]:
    """Obtener instructor por email"""
    instructor = instructors_collection.find_one({"email": email})
    if instructor:
        return serialize_mongo_id(instructor)
    return None

async def create_instructor(instructor_data: InstructorCreate) -> dict:
    """Crear nuevo instructor"""
    # Verificar que el usuario exista
    user = users_collection.find_one({"_id": ObjectId(instructor_data.user_id)})
    if not user:
        raise ValueError("Usuario no encontrado")
    
    # Verificar que el email no esté duplicado (si se proporciona)
    if instructor_data.email:
        existing = await get_instructor_by_email(instructor_data.email)
        if existing:
            raise ValueError("Email de instructor ya registrado")
    
    # Crear documento de instructor
    instructor_doc = {
        "name": instructor_data.name,
        "email": instructor_data.email,
        "bio": instructor_data.bio,
        "rating": instructor_data.rating,
        "user_id": instructor_data.user_id,
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }
    
    # Insertar en base de datos
    result = instructors_collection.insert_one(instructor_doc)
    instructor_doc["_id"] = result.inserted_id
    return serialize_mongo_id(instructor_doc)

async def get_all_instructors() -> List[dict]:
    """Obtener todos los instructores"""
    instructors = []
    for instructor in instructors_collection.find():
        instructors.append(serialize_mongo_id(instructor))
    return instructors

async def update_instructor(instructor_id: str, update_data: dict) -> Optional[dict]:
    """Actualizar instructor"""
    try:
        update_data["updated_at"] = datetime.now()
        result = instructors_collection.update_one(
            {"_id": ObjectId(instructor_id)},
            {"$set": update_data}
        )
        if result.modified_count > 0:
            return await get_instructor_by_id(instructor_id)
        return None
    except Exception:
        return None

async def delete_instructor(instructor_id: str) -> bool:
    """Eliminar instructor"""
    try:
        result = instructors_collection.delete_one({"_id": ObjectId(instructor_id)})
        return result.deleted_count > 0
    except Exception:
        return False
