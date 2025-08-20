# app/core/database.py
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

# Configuración más simple para evitar problemas de SSL
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb+srv://elisarrtech:S5B%25%23-kGjj%21%25KJn@cluster0.yjot3u0.mongodb.net/fitnessclubdb?retryWrites=true&w=majority&appName=Cluster0")

try:
    # Configuración mínima para evitar problemas en Railway
    client = MongoClient(
        MONGODB_URI,
        tls=True,
        tlsAllowInvalidCertificates=True,  # Permitir certificados inválidos
        serverSelectionTimeoutMS=3000,     # Timeout más corto
        connectTimeoutMS=3000,
        socketTimeoutMS=3000,
        maxPoolSize=1,                     # Pool size mínimo
        retryWrites=False,                 # Desactivar retry writes
        directConnection=False
    )
    
    # Obtener nombre de base de datos
    db_name = os.getenv("DATABASE_NAME", "fitnessclubdb")
    db = client[db_name]
    
    # Colecciones
    users_collection = db.users
    classes_collection = db.classes
    instructors_collection = db.instructors
    bookings_collection = db.bookings
    schedules_collection = db.schedules

    def init_db():
        try:
            print("✅ Cliente MongoDB configurado")
            print(f"✅ Base de datos: {db_name}")
        except Exception as e:
            print(f"⚠️ Advertencia MongoDB: {e}")

    def serialize_mongo_id(obj):
        if obj and "_id" in obj:
            obj["id"] = str(obj["_id"])
            del obj["_id"]
        return obj

    # Inicializar base de datos
    init_db()
    
except Exception as e:
    print(f"❌ Error en MongoDB: {e}")
    users_collection = None
    classes_collection = None
    instructors_collection = None
    bookings_collection = None
    schedules_collection = None
