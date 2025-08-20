# app/services/class_service.py
from app.core.database import classes_collection, instructors_collection, serialize_mongo_id
from app.models.class import Class, ClassCreate
from typing import List, Optional
from bson import ObjectId
from datetime import datetime

async def get_class_by_id(class_id: str) -> Optional[dict]:
    """Obtener clase por ID"""
    try:
        class_obj = classes_collection.find_one({"_id": ObjectId(class_id)})
        if class_obj:
            return serialize_mongo_id(class_obj)
        return None
    except Exception:
        return None

async def create_class(class_data: ClassCreate) -> dict:
    """Crear nueva clase"""
    # Verificar que el instructor exista
    instructor = instructors_collection.find_one({"_id": ObjectId(class_data.instructor_id)})
    if not instructor:
        raise ValueError("Instructor no encontrado")
    
    # Crear documento de clase
    class_doc = {
        "title": class_data.title,
        "modality": class_data.modality,
        "level": class_data.level,
        "duration_min": class_data.duration_min,
        "base_price": class_data.base_price,
        "capacity": class_data.capacity,
        "instructor_id": class_data.instructor_id,
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }
    
    # Insertar en base de datos
    result = classes_collection.insert_one(class_doc)
    class_doc["_id"] = result.inserted_id
    return serialize_mongo_id(class_doc)

async def get_all_classes() -> List[dict]:
    """Obtener todas las clases"""
    classes = []
    for class_obj in classes_collection.find():
        classes.append(serialize_mongo_id(class_obj))
    return classes

async def get_classes_with_instructor() -> List[dict]:
    """Obtener clases con información del instructor"""
    pipeline = [
        {
            "$lookup": {
                "from": "instructors",
                "localField": "instructor_id",
                "foreignField": "_id",
                "as": "instructor"
            }
        },
        {
            "$unwind": "$instructor"
        }
    ]
    
    classes = []
    for class_obj in classes_collection.aggregate(pipeline):
        classes.append(serialize_mongo_id(class_obj))
    return classes

async def update_class(class_id: str, update_data: dict) -> Optional[dict]:
    """Actualizar clase"""
    try:
        update_data["updated_at"] = datetime.now()
        result = classes_collection.update_one(
            {"_id": ObjectId(class_id)},
            {"$set": update_data}
        )
        if result.modified_count > 0:
            return await get_class_by_id(class_id)
        return None
    except Exception:
        return None

async def delete_class(class_id: str) -> bool:
    """Eliminar clase"""
    try:
        result = classes_collection.delete_one({"_id": ObjectId(class_id)})
        return result.deleted_count > 0
    except Exception:
        return False
