# app/api/v1/classes.py
from flask import Blueprint, jsonify

# Definir el blueprint
classes_bp = Blueprint('classes', __name__, url_prefix='/api/v1/classes')

@classes_bp.route('/', methods=['GET'])
def get_classes():
    return jsonify({"message": "Classes endpoint working", "status": "success"})

@classes_bp.route('/with-schedules', methods=['GET'])
def get_classes_with_schedules():
    return jsonify({
        "message": "Classes with schedules endpoint working", 
        "status": "success",
        "data": []
    })

# Esta función es opcional, solo para diagnóstico
def register_routes(app):
    app.register_blueprint(classes_bp)
