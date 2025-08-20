# app/api/v1/classes.py
from flask import Blueprint, request, jsonify
from app.core.auth_middleware import auth_required
from app.services import class_service, schedule_service

classes_bp = Blueprint('classes', __name__, url_prefix='/api/v1/classes')

@classes_bp.route('/', methods=['POST'])
@auth_required
async def create_class():
    try:
        # Solo administradores pueden crear clases
        if request.current_user.get('role') != 'ADMIN':
            return jsonify({"error": "Acceso denegado"}), 403
        
        class_data = request.get_json()
        class_obj = await class_service.create_class(class_data)
        return jsonify(class_obj), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Error creando clase"}), 500

@classes_bp.route('/', methods=['GET'])
async def get_classes():
    try:
        classes = await class_service.get_all_classes()
        return jsonify(classes)
    except Exception as e:
        return jsonify({"error": "Error obteniendo clases"}), 500

@classes_bp.route('/with-schedules', methods=['GET'])
async def get_classes_with_schedules():
    try:
        classes = await class_service.get_classes_with_instructor()
        # Agregar próximos horarios para cada clase
        for class_obj in classes:
            schedules = await schedule_service.get_schedules_by_class(class_obj['id'])
            # Tomar solo los 3 próximos horarios
            class_obj['schedules'] = schedules[:3]
        return jsonify(classes)
    except Exception as e:
        return jsonify({"error": "Error obteniendo clases con horarios"}), 500

# Endpoints para horarios
@classes_bp.route('/schedules', methods=['POST'])
@auth_required
async def create_schedule():
    try:
        # Solo administradores o instructores pueden crear horarios
        if request.current_user.get('role') not in ['ADMIN', 'INSTRUCTOR']:
            return jsonify({"error": "Acceso denegado"}), 403
        
        schedule_data = request.get_json()
        schedule = await schedule_service.create_schedule(schedule_data)
        return jsonify(schedule), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Error creando horario"}), 500

@classes_bp.route('/schedules/upcoming', methods=['GET'])
async def get_upcoming_schedules():
    try:
        limit = int(request.args.get('limit', 10))
        schedules = await schedule_service.get_upcoming_schedules(limit)
        return jsonify(schedules)
    except Exception as e:
        return jsonify({"error": "Error obteniendo horarios próximos"}), 500

@classes_bp.route('/schedules/with-details', methods=['GET'])
@auth_required
async def get_schedules_with_details():
    try:
        # Solo administradores pueden ver todos los detalles
        if request.current_user.get('role') != 'ADMIN':
            return jsonify({"error": "Acceso denegado"}), 403
        
        schedules = await schedule_service.get_schedules_with_details()
        return jsonify(schedules)
    except Exception as e:
        return jsonify({"error": "Error obteniendo horarios con detalles"}), 500
