# app/core/database.py
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import ssl

load_dotenv()

try:
    # Configuración mejorada para MongoDB Atlas
    MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/fitnessclub")
    
    # Configurar cliente con opciones específicas para evitar problemas de SSL
    client = MongoClient(
        MONGODB_URI,
        tls=True,
        tlsAllowInvalidCertificates=True,  # Solo para entornos de prueba
        serverSelectionTimeoutMS=5000,
        connectTimeoutMS=5000,
        socketTimeoutMS=5000,
        retryWrites=True,
        retryReads=True
    )
    
    db = client[os.getenv("DATABASE_NAME", "elisarrtech")]
    
    # Colecciones
    users_collection = db.users
    classes_collection = db.classes
    instructors_collection = db.instructors
    bookings_collection = db.bookings
    schedules_collection = db.schedules

    def init_db():
        try:
            # Verificar conexión con timeout más corto
            client.admin.command('ping', readPreference='primaryPreferred')
            print("✅ Conexión a MongoDB exitosa")
        except Exception as e:
            print(f"⚠️ Error conectando a MongoDB: {e}")
            # Continuar aunque falle la conexión (para que la app siga funcionando)

    def serialize_mongo_id(obj):
        if obj and "_id" in obj:
            obj["id"] = str(obj["_id"])
            del obj["_id"]
        return obj

    # Inicializar base de datos
    init_db()
    
except Exception as e:
    print(f"❌ Error grave en la configuración de MongoDB: {e}")
    users_collection = None
    classes_collection = None
    instructors_collection = None
    bookings_collection = None
    schedules_collection = None
