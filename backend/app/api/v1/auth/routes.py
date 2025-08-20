from flask import Blueprint, request, jsonify
from app.api.v1.auth.controllers import register_user, login_user

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        result = register_user(data)
        return jsonify(result), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        result = login_user(data)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 401
