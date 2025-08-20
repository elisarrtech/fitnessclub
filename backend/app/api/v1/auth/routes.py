from flask import Blueprint, request, jsonify
from app.api.v1.auth.controllers import register_user, login_user

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        print("=== REGISTER REQUEST ===")
        data = request.get_json()
        print(f"Data received: {data}")
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        result = register_user(data)
        print(f"Registration successful: {result}")
        return jsonify(result), 201
    except ValueError as e:
        print(f"ValueError in register: {e}")
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        print(f"Unexpected error in register: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        print("=== LOGIN REQUEST ===")
        data = request.get_json()
        print(f"Data received: {data}")
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        result = login_user(data)
        print(f"Login successful: {result}")
        return jsonify(result)
    except ValueError as e:
        print(f"ValueError in login: {e}")
        return jsonify({"error": str(e)}), 401
    except Exception as e:
        print(f"Unexpected error in login: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Internal server error", "details": str(e)}), 500
