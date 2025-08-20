# backend/app/api/v1/classes/with-schedules.py
from flask import Blueprint, jsonify
from app.services.class_service import get_classes_with_instructor
from app.services.schedule_service import get_schedules_by_class

classes_bp = Blueprint('classes', __name__)

@classes_bp.route('/with-schedules', methods=['GET'])
async def get_classes_with_schedules():
    try:
        # Obtener todas las clases
        classes = await get_classes_with_instructor()
        
        # Agregar próximos horarios para cada clase
        for class_obj in classes:
            schedules = await get_schedules_by_class(class_obj['id'])
            class_obj['schedules'] = schedules[:3]
        
        return jsonify(classes)
    except Exception as e:
        return jsonify({"error": "Error obteniendo clases con horarios"}), 500

# Registrar el blueprint
def register_routes(app):
    app.register_blueprint(classes_bp, url_prefix='/api/v1/classes')
