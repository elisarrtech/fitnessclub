
# app/services/booking_service.py
from app.core.database import bookings_collection, schedules_collection, users_collection, classes_collection, serialize_mongo_id
from app.models.booking import Booking, BookingCreate, BookingStatus
from typing import List, Optional
from bson import ObjectId
from datetime import datetime

async def get_booking_by_id(booking_id: str) -> Optional[dict]:
    """Obtener reserva por ID"""
    try:
        booking = bookings_collection.find_one({"_id": ObjectId(booking_id)})
        if booking:
            return serialize_mongo_id(booking)
        return None
    except Exception:
        return None

async def create_booking(booking_ BookingCreate) -> dict:
    """Crear nueva reserva"""
    # Verificar que el horario exista
    schedule = schedules_collection.find_one({"_id": ObjectId(booking_data.schedule_id)})
    if not schedule:
        raise ValueError("Horario no encontrado")
    
    # Verificar que el usuario exista
    user = users_collection.find_one({"_id": ObjectId(booking_data.user_id)})
    if not user:
        raise ValueError("Usuario no encontrado")
    
    # Verificar que la clase asociada exista
    class_obj = classes_collection.find_one({"_id": ObjectId(schedule["class_id"])})
    if not class_obj:
        raise ValueError("Clase no encontrada")
    
    # Verificar si ya existe una reserva para este usuario y horario
    existing_booking = bookings_collection.find_one({
        "schedule_id": booking_data.schedule_id,
        "user_id": booking_data.user_id
    })
    
    if existing_booking:
        # Si existe y está cancelada, reactivar
        if existing_booking["status"] == BookingStatus.CANCELLED.value:
            result = bookings_collection.update_one(
                {"_id": existing_booking["_id"]},
                {"$set": {"status": BookingStatus.RESERVED.value, "updated_at": datetime.now()}}
            )
            if result.modified_count > 0:
                updated_booking = bookings_collection.find_one({"_id": existing_booking["_id"]})
                return serialize_mongo_id(updated_booking)
        else:
            raise ValueError("Ya tienes una reserva para este horario")
    
    # Contar reservas activas para este horario
    active_bookings_count = bookings_collection.count_documents({
        "schedule_id": booking_data.schedule_id,
        "status": BookingStatus.RESERVED.value
    })
    
    # Verificar capacidad
    if active_bookings_count >= class_obj["capacity"]:
        raise ValueError("Clase llena (lista de espera no implementada en MVP)")
    
    # Crear documento de reserva
    booking_doc = {
        "schedule_id": booking_data.schedule_id,
        "user_id": booking_data.user_id,
        "status": booking_data.status.value,
        "seat_no": booking_data.seat_no,
        "created_at": datetime.now()
    }
    
    # Insertar en base de datos
    result = bookings_collection.insert_one(booking_doc)
    booking_doc["_id"] = result.inserted_id
    return serialize_mongo_id(booking_doc)

async def get_bookings_by_user(user_id: str) -> List[dict]:
    """Obtener reservas por usuario"""
    bookings = []
    for booking in bookings_collection.find({"user_id": user_id}).sort("created_at", -1):
        bookings.append(serialize_mongo_id(booking))
    return bookings

async def get_bookings_by_schedule(schedule_id: str) -> List[dict]:
    """Obtener reservas por horario"""
    bookings = []
    for booking in bookings_collection.find({"schedule_id": schedule_id}).sort("created_at", 1):
        bookings.append(serialize_mongo_id(booking))
    return bookings

async def cancel_booking(booking_id: str, user_id: str) -> Optional[dict]:
    """Cancelar reserva"""
    try:
        # Verificar que la reserva exista y pertenezca al usuario
        booking = bookings_collection.find_one({
            "_id": ObjectId(booking_id),
            "user_id": user_id
        })
        
        if not booking:
            return None
        
        # Si ya está cancelada, devolver la reserva
        if booking["status"] == BookingStatus.CANCELLED.value:
            return serialize_mongo_id(booking)
        
        # Actualizar estado a cancelada
        result = bookings_collection.update_one(
            {"_id": ObjectId(booking_id)},
            {"$set": {"status": BookingStatus.CANCELLED.value, "updated_at": datetime.now()}}
        )
        
        if result.modified_count > 0:
            updated_booking = bookings_collection.find_one({"_id": ObjectId(booking_id)})
            return serialize_mongo_id(updated_booking)
        return None
    except Exception:
        return None

async def get_bookings_with_details() -> List[dict]:
    """Obtener reservas con información de horario, clase y usuario"""
    pipeline = [
        {
            "$lookup": {
                "from": "schedules",
                "localField": "schedule_id",
                "foreignField": "_id",
                "as": "schedule"
            }
        },
        {
            "$unwind": "$schedule"
        },
        {
            "$lookup": {
                "from": "classes",
                "localField": "schedule.class_id",
                "foreignField": "_id",
                "as": "class"
            }
        },
        {
            "$unwind": "$class"
        },
        {
            "$lookup": {
                "from": "users",
                "localField": "user_id",
                "foreignField": "_id",
                "as": "user"
            }
        },
        {
            "$unwind": "$user"
        }
    ]
    
    bookings = []
    for booking in bookings_collection.aggregate(pipeline):
        bookings.append(serialize_mongo_id(booking))
    return bookings
