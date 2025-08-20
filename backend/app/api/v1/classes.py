# app/api/v1/classes.py
from flask import Blueprint, jsonify
from app.services import class_service, schedule_service

classes_bp = Blueprint('classes', __name__, url_prefix='/api/v1/classes')

@classes_bp.route('/with-schedules', methods=['GET'])
def get_classes_with_schedules():
    try:
        # Esta función debe existir en class_service
        classes = class_service.get_classes_with_instructor()
        # Agregar próximos horarios para cada clase
        for class_obj in classes:
            schedules = schedule_service.get_schedules_by_class(class_obj['id'])
            class_obj['schedules'] = schedules[:3]
        return jsonify(classes)
    except Exception as e:
        print(f"Error en get_classes_with_schedules: {e}")
        return jsonify({"error": "Error obteniendo clases con horarios"}), 500
