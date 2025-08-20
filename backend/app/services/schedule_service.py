# app/services/schedule_service.py
from app.core.database import schedules_collection, classes_collection, instructors_collection, serialize_mongo_id
from app.models.schedule import Schedule, ScheduleCreate
from typing import List, Optional
from bson import ObjectId
from datetime import datetime

async def get_schedule_by_id(schedule_id: str) -> Optional[dict]:
    """Obtener horario por ID"""
    try:
        schedule = schedules_collection.find_one({"_id": ObjectId(schedule_id)})
        if schedule:
            return serialize_mongo_id(schedule)
        return None
    except Exception:
        return None

async def create_schedule(schedule_ ScheduleCreate) -> dict:
    """Crear nuevo horario"""
    # Verificar que la clase exista
    class_obj = classes_collection.find_one({"_id": ObjectId(schedule_data.class_id)})
    if not class_obj:
        raise ValueError("Clase no encontrada")
    
    # Verificar que el instructor exista (si se proporciona)
    if schedule_data.instructor_id:
        instructor = instructors_collection.find_one({"_id": ObjectId(schedule_data.instructor_id)})
        if not instructor:
            raise ValueError("Instructor no encontrado")
    
    # Verificar que no haya conflictos de horario
    conflict = schedules_collection.find_one({
        "class_id": schedule_data.class_id,
        "start_ts": {"$lt": schedule_data.end_ts},
        "end_ts": {"$gt": schedule_data.start_ts}
    })
    
    if conflict:
        raise ValueError("Conflicto de horario: ya existe una clase en este horario")
    
    # Crear documento de horario
    schedule_doc = {
        "class_id": schedule_data.class_id,
        "instructor_id": schedule_data.instructor_id,
        "start_ts": schedule_data.start_ts,
        "end_ts": schedule_data.end_ts,
        "room": schedule_data.room,
        "created_at": datetime.now()
    }
    
    # Insertar en base de datos
    result = schedules_collection.insert_one(schedule_doc)
    schedule_doc["_id"] = result.inserted_id
    return serialize_mongo_id(schedule_doc)

async def get_schedules_by_class(class_id: str) -> List[dict]:
    """Obtener horarios por clase"""
    schedules = []
    for schedule in schedules_collection.find({"class_id": class_id}).sort("start_ts", 1):
        schedules.append(serialize_mongo_id(schedule))
    return schedules

async def get_upcoming_schedules(limit: int = 10) -> List[dict]:
    """Obtener horarios próximos"""
    now = datetime.now()
    schedules = []
    for schedule in schedules_collection.find({"start_ts": {"$gte": now}}).sort("start_ts", 1).limit(limit):
        schedules.append(serialize_mongo_id(schedule))
    return schedules

async def get_schedules_with_details() -> List[dict]:
    """Obtener horarios con información de clase e instructor"""
    pipeline = [
        {
            "$lookup": {
                "from": "classes",
                "localField": "class_id",
                "foreignField": "_id",
                "as": "class"
            }
        },
        {
            "$unwind": "$class"
        },
        {
            "$lookup": {
                "from": "instructors",
                "localField": "instructor_id",
                "foreignField": "_id",
                "as": "instructor"
            }
        },
        {
            "$unwind": {
                "path": "$instructor",
                "preserveNullAndEmptyArrays": True
            }
        }
    ]
    
    schedules = []
    for schedule in schedules_collection.aggregate(pipeline):
        schedules.append(serialize_mongo_id(schedule))
    return schedules

async def update_schedule(schedule_id: str, update_ dict) -> Optional[dict]:
    """Actualizar horario"""
    try:
        result = schedules_collection.update_one(
            {"_id": ObjectId(schedule_id)},
            {"$set": update_data}
        )
        if result.modified_count > 0:
            return await get_schedule_by_id(schedule_id)
        return None
    except Exception:
        return None

async def delete_schedule(schedule_id: str) -> bool:
    """Eliminar horario"""
    try:
        result = schedules_collection.delete_one({"_id": ObjectId(schedule_id)})
        return result.deleted_count > 0
    except Exception:
        return False
