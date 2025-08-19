
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

# Conexión a MongoDB
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/fitnessclub")
client = MongoClient(MONGODB_URI)
db = client[os.getenv("DATABASE_NAME", "fitnessclubdb")]

# Colecciones
users_collection = db.users
classes_collection = db.classes
instructors_collection = db.instructors
bookings_collection = db.bookings
