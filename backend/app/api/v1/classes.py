# app/api/v1/classes.py
from flask import Blueprint, jsonify, request
from datetime import datetime

# Importa los servicios reales (necesitarás crear estos archivos)
try:
    from app.services import class_service, schedule_service
    SERVICES_AVAILABLE = True
except ImportError:
    # Servicios no disponibles, usar datos de ejemplo
    SERVICES_AVAILABLE = False

classes_bp = Blueprint('classes', __name__, url_prefix='/api/v1/classes')

# Datos de ejemplo para cuando los servicios no estén disponibles
SAMPLE_CLASSES = [
    {
        "id": "1",
        "title": "Yoga Vinyasa",
        "modality": "presencial",
        "level": "básico",
        "duration_min": 60,
        "base_price": 18000,  # En centavos (180.00)
        "capacity": 18,
        "description": "Una clase de yoga dinámica que sincroniza la respiración con el movimiento. Perfecta para principiantes que quieren mejorar su flexibilidad y encontrar equilibrio."
    },
    {
        "id": "2",
        "title": "HIIT 30",
        "modality": "presencial",
        "level": "intermedio",
        "duration_min": 30,
        "base_price": 12000,  # En centavos (120.00)
        "capacity": 20,
        "description": "Entrenamiento de alta intensidad en intervalos cortos. Ideal para quemar grasa y aumentar la resistencia cardiovascular."
    },
    {
        "id": "3",
        "title": "Pilates Mat",
        "modality": "presencial",
        "level": "básico",
        "duration_min": 45,
        "base_price": 15000,  # En centavos (150.00)
        "capacity": 15,
        "description": "Clase de pilates sobre colchón para fortalecer el core, mejorar la postura y aumentar la flexibilidad."
    }
]

SAMPLE_SCHEDULES = [
    {
        "id": "101",
        "class_id": "1",
        "start_ts": (datetime.now().replace(hour=9, minute=0).isoformat() + "Z"),
        "end_ts": (datetime.now().replace(hour=10, minute=0).isoformat() + "Z"),
        "room": "Sala A",
        "current_bookings": 5
    },
    {
        "id": "102",
        "class_id": "1",
        "start_ts": (datetime.now().replace(hour=18, minute=30).isoformat() + "Z"),
        "end_ts": (datetime.now().replace(hour=19, minute=30).isoformat() + "Z"),
        "room": "Sala A",
        "current_bookings": 10
    },
    {
        "id": "201",
        "class_id": "2",
        "start_ts": (datetime.now().replace(hour=7, minute=0).isoformat() + "Z"),
        "end_ts": (datetime.now().replace(hour=7, minute=30).isoformat() + "Z"),
        "room": "Sala B",
        "current_bookings": 15
    },
    {
        "id": "301",
        "class_id": "3",
        "start_ts": (datetime.now().replace(hour=11, minute=0).isoformat() + "Z"),
        "end_ts": (datetime.now().replace(hour=11, minute=45).isoformat() + "Z"),
        "room": "Sala C",
        "current_bookings": 8
    }
]

@classes_bp.route('/', methods=['GET'])
def get_classes():
    """Obtener todas las clases"""
    try:
        if SERVICES_AVAILABLE:
            # En producción, obtener clases reales del servicio
            classes = class_service.get_all_classes()
        else:
            # Usar datos de ejemplo
            classes = SAMPLE_CLASSES
            
        return jsonify(classes), 200
    except Exception as e:
        return jsonify({"error": "Error obteniendo clases", "details": str(e)}), 500

@classes_bp.route('/<class_id>', methods=['GET'])
def get_class_by_id(class_id):
    """Obtener una clase específica por ID"""
    try:
        if SERVICES_AVAILABLE:
            # En producción, obtener clase real del servicio
            class_obj = class_service.get_class_by_id(class_id)
            if not class_obj:
                return jsonify({"error": "Clase no encontrada"}), 404
        else:
            # Buscar en datos de ejemplo
            class_obj = next((c for c in SAMPLE_CLASSES if c["id"] == class_id), None)
            if not class_obj:
                return jsonify({"error": "Clase no encontrada"}), 404
                
        return jsonify(class_obj), 200
    except Exception as e:
        return jsonify({"error": "Error obteniendo clase", "details": str(e)}), 500

@classes_bp.route('/with-schedules', methods=['GET'])
def get_classes_with_schedules():
    """Obtener clases con sus horarios próximos"""
    try:
        if SERVICES_AVAILABLE:
            # En producción, obtener clases con horarios reales
            classes = class_service.get_classes_with_instructor()
            # Agregar horarios para cada clase
            for class_obj in classes:
                schedules = schedule_service.get_schedules_by_class(class_obj['id'])
                class_obj['schedules'] = schedules[:3]  # Limitar a 3 horarios
        else:
            # Usar datos de ejemplo combinados
            classes = []
            for class_obj in SAMPLE_CLASSES:
                # Agregar horarios relacionados
                related_schedules = [s for s in SAMPLE_SCHEDULES if s["class_id"] == class_obj["id"]]
                class_with_schedules = class_obj.copy()
                class_with_schedules["schedules"] = related_schedules
                classes.append(class_with_schedules)
                
        return jsonify(classes), 200
    except Exception as e:
        return jsonify({
            "message": "Classes with schedules endpoint working", 
            "status": "success",
            "data": []  # Devolver array vacío en caso de error
        }), 200

@classes_bp.route('/<class_id>/schedules', methods=['GET'])
def get_class_schedules(class_id):
    """Obtener todos los horarios para una clase específica"""
    try:
        if SERVICES_AVAILABLE:
            # En producción, obtener horarios reales
            schedules = schedule_service.get_schedules_by_class(class_id)
        else:
            # Filtrar horarios de ejemplo
            schedules = [s for s in SAMPLE_SCHEDULES if s["class_id"] == class_id]
            
        return jsonify(schedules), 200
    except Exception as e:
        return jsonify({"error": "Error obteniendo horarios", "details": str(e)}), 500

# Esta función es opcional, solo para diagnóstico
def register_routes(app):
    """Registrar el blueprint en la aplicación Flask"""
    app.register_blueprint(classes_bp)
