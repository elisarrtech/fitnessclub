# app/core/database.py
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

try:
    # Usar la URL completa de MongoDB Atlas
    MONGODB_URI = os.getenv("MONGODB_URI", "mongodb+srv://elisarrtech:R_zeHWhW9iAhYyM@cluster0.yjot3u0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    
    # Configuración optimizada para MongoDB Atlas
    client = MongoClient(
        MONGODB_URI,
        tls=True,
        tlsAllowInvalidCertificates=False,  # Usar certificados válidos
        serverSelectionTimeoutMS=10000,     # Timeout más largo
        connectTimeoutMS=10000,
        socketTimeoutMS=10000,
        retryWrites=True,
        retryReads=True,
        maxPoolSize=50,
        minPoolSize=5
    )
    
    # Extraer el nombre de la base de datos de la URI o usar el default
    db_name = os.getenv("DATABASE_NAME")
    if not db_name:
        # Intentar obtener el nombre de la base de datos de la URI
        from urllib.parse import urlparse
        parsed_uri = urlparse(MONGODB_URI)
        path_parts = parsed_uri.path.strip('/').split('?')
        db_name = path_parts[0] if path_parts and path_parts[0] else "elisarrtech"
    
    db = client[db_name]
    
    # Colecciones
    users_collection = db.users
    classes_collection = db.classes
    instructors_collection = db.instructors
    bookings_collection = db.bookings
    schedules_collection = db.schedules

    def init_db():
        try:
            # Verificar conexión
            client.admin.command('ping')
            print("✅ Conexión a MongoDB Atlas exitosa")
            print(f"✅ Base de datos: {db_name}")
        except Exception as e:
            print(f"⚠️ Error conectando a MongoDB Atlas: {e}")
            print("⚠️ La aplicación continuará funcionando pero sin acceso a la base de datos")

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
