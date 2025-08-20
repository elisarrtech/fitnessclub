# app/core/database.py
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import certifi

load_dotenv()

# Conexión a MongoDB con mejor manejo de SSL
try:
    MONGODB_URI = os.getenv("MONGODB_URI", "mongodb+srv://elisarrtech:R_zeHWhW9iAhYyM@cluster0.yjot3u0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    
    # Usar certifi para manejar certificados SSL
    client = MongoClient(
        MONGODB_URI,
        tls=True,
        tlsCAFile=certifi.where(),  # Usar certificados confiables
        serverSelectionTimeoutMS=5000,
        connectTimeoutMS=5000,
        retryWrites=True
    )
    
    db = client[os.getenv("DATABASE_NAME", "elisarrtech")]
    
    # Colecciones
    users_collection = db.users
    classes_collection = db.classes
    instructors_collection = db.instructors
    bookings_collection = db.bookings
    schedules_collection = db.schedules

    def init_db():
        """Inicializar base de datos con índices"""
        try:
            # Verificar conexión
            client.admin.command('ping')
            print("✅ Conexión a MongoDB exitosa")
            
            # Índices recomendados
            users_collection.create_index("email", unique=True)
            classes_collection.create_index("title")
            instructors_collection.create_index("email", sparse=True)
            bookings_collection.create_index([("schedule_id", 1), ("user_id", 1)], unique=True)
            schedules_collection.create_index("class_id")
            schedules_collection.create_index("start_ts")
            schedules_collection.create_index("instructor_id")
            print("✅ Índices de base de datos creados exitosamente")
        except Exception as e:
            print(f"⚠️ Error inicializando base de datos: {e}")

    def serialize_mongo_id(obj):
        """Convertir ObjectId de MongoDB a string para JSON"""
        if obj and "_id" in obj:
            obj["id"] = str(obj["_id"])
            del obj["_id"]
        return obj

    # Inicializar base de datos
    init_db()
    
except Exception as e:
    print(f"❌ Error conectando a MongoDB: {e}")
    db = None
    users_collection = None
    classes_collection = None
    instructors_collection = None
    bookings_collection = None
    schedules_collection = None
