
# app/api/v1/users.py
from flask import Blueprint, request, jsonify
from app.core.auth_middleware import auth_required
from app.services import user_service

users_bp = Blueprint('users', __name__, url_prefix='/api/v1/users')

@users_bp.route('/', methods=['GET'])
@auth_required
async def get_users():
    try:
        users = await user_service.get_all_users()
        return jsonify(users)
    except Exception as e:
        return jsonify({"error": "Error obteniendo usuarios"}), 500

@users_bp.route('/me', methods=['GET'])
@auth_required
async def get_current_user():
    try:
        # Obtener el ID del usuario del token
        user_id = request.current_user.get('user_id')
        if not user_id:
            return jsonify({"error": "Usuario no encontrado"}), 404
        
        user = await user_service.get_user_by_id(user_id)
        if user:
            # Remover información sensible
            user.pop('password_hash', None)
            return jsonify(user)
        return jsonify({"error": "Usuario no encontrado"}), 404
    except Exception as e:
        return jsonify({"error": "Error obteniendo usuario"}), 500
