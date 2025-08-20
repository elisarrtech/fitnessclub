# app/core/database.py
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

# Conexión a MongoDB
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb+srv://elisarrtech:R_zeHWhW9iAhYyM@cluster0.yjot3u0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
client = MongoClient(MONGODB_URI)
db = client[os.getenv("DATABASE_NAME", "elisarrtech")]

# Colecciones
users_collection = db.users
classes_collection = db.classes
instructors_collection = db.instructors
bookings_collection = db.bookings
schedules_collection = db.schedules

# Índices recomendados
users_collection.create_index("email", unique=True)
classes_collection.create_index("title")
instructors_collection.create_index("email", sparse=True)
bookings_collection.create_index([("schedule_id", 1), ("user_id", 1)], unique=True)
schedules_collection.create_index("class_id")
schedules_collection.create_index("start_ts")
