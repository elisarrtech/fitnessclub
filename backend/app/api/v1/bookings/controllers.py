# app/api/v1/bookings/controllers.py
from datetime import datetime
from app.core.database import bookings_collection, schedules_collection, users_collection
import traceback

def create_booking(data):
    try:
        print("=== CREATE BOOKING ===")
        print(f"Booking data: {data}")
        
        user_id = data.get('user_id')
        schedule_id = data.get('schedule_id')
        class_id = data.get('class_id')
        
        if not user_id or not schedule_id:
            raise ValueError("User ID and Schedule ID are required")
        
        # Verificar que el usuario exista
        user = users_collection.find_one({"_id": user_id})
        if not user:
            raise ValueError("User not found")
        
        # Verificar que el horario exista
        schedule = schedules_collection.find_one({"_id": schedule_id})
        if not schedule:
            raise ValueError("Schedule not found")
        
        # Verificar si ya existe una reserva para este usuario y horario
        existing_booking = bookings_collection.find_one({
            "user_id": user_id,
            "schedule_id": schedule_id
        })
        
        if existing_booking:
            raise ValueError("Booking already exists for this user and schedule")
        
        # Crear la reserva
        booking_doc = {
            "user_id": user_id,
            "schedule_id": schedule_id,
            "class_id": class_id,
            "created_at": datetime.utcnow(),
            "status": "confirmed"
        }
        
        result = bookings_collection.insert_one(booking_doc)
        booking_id = str(result.inserted_id)
        
        print(f"Booking created with ID: {booking_id}")
        
        return {
            "id": booking_id,
            "user_id": user_id,
            "schedule_id": schedule_id,
            "class_id": class_id,
            "created_at": booking_doc["created_at"],
            "status": "confirmed"
        }
        
    except Exception as e:
        print(f"Error in create_booking: {e}")
        traceback.print_exc()
        raise

def get_bookings_by_user(user_id):
    try:
        print(f"=== GET BOOKINGS BY USER {user_id} ===")
        
        bookings = list(bookings_collection.find({"user_id": user_id}))
        
        # Convertir ObjectId a string
        for booking in bookings:
            if "_id" in booking:
                booking["id"] = str(booking["_id"])
                del booking["_id"]
            if "user_id" in booking:
                booking["user_id"] = str(booking["user_id"])
            if "schedule_id" in booking:
                booking["schedule_id"] = str(booking["schedule_id"])
            if "class_id" in booking:
                booking["class_id"] = str(booking["class_id"])
        
        return bookings
        
    except Exception as e:
        print(f"Error in get_bookings_by_user: {e}")
        traceback.print_exc()
        raise

def cancel_booking(booking_id, user_id):
    try:
        print(f"=== CANCEL BOOKING {booking_id} ===")
        
        # Verificar que la reserva exista y pertenezca al usuario
        booking = bookings_collection.find_one({
            "_id": booking_id,
            "user_id": user_id
        })
        
        if not booking:
            raise ValueError("Booking not found or not owned by user")
        
        # Actualizar el estado de la reserva
        result = bookings_collection.update_one(
            {"_id": booking_id},
            {"$set": {"status": "cancelled", "cancelled_at": datetime.utcnow()}}
        )
        
        if result.modified_count > 0:
            booking["status"] = "cancelled"
            if "_id" in booking:
                booking["id"] = str(booking["_id"])
                del booking["_id"]
            return booking
        else:
            raise ValueError("Failed to cancel booking")
            
    except Exception as e:
        print(f"Error in cancel_booking: {e}")
        traceback.print_exc()
        raise

def get_bookings_with_details():
    try:
        print("=== GET BOOKINGS WITH DETAILS ===")
        
        # Esta función puede implementarse según tus necesidades específicas
        # Por ahora, devuelve todas las reservas
        bookings = list(bookings_collection.find())
        
        # Convertir ObjectId a string
        for booking in bookings:
            if "_id" in booking:
                booking["id"] = str(booking["_id"])
                del booking["_id"]
            if "user_id" in booking:
                booking["user_id"] = str(booking["user_id"])
            if "schedule_id" in booking:
                booking["schedule_id"] = str(booking["schedule_id"])
            if "class_id" in booking:
                booking["class_id"] = str(booking["class_id"])
        
        return bookings
        
    except Exception as e:
        print(f"Error in get_bookings_with_details: {e}")
        traceback.print_exc()
        raise
