from flask import Blueprint, request, jsonify
from app.api.v1.auth.controllers import register_user, login_user

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        if not data:  # Esta línea estaba mal
            return jsonify({"error": "No data provided"}), 400
        
        result = register_user(data)
        return jsonify(result), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data:  # Esta línea estaba mal
            return jsonify({"error": "No data provided"}), 400
            
        result = login_user(data)
        return jsonify(result)
    except ValueError as e:
        return jsonify({"error": str(e)}), 401
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500
