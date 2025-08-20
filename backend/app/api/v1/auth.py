# app/api/v1/auth.py
from flask import Blueprint, request, jsonify
from app.services import user_service
from app.core.security import verify_password, create_access_token
from app.schemas.auth import LoginRequest
from datetime import timedelta

auth_bp = Blueprint('auth', __name__, url_prefix='/api/v1/auth')

@auth_bp.route('/login', methods=['POST'])
async def login():
    try:
        # Validar datos de entrada
        login_data = LoginRequest(**request.get_json())
        
        # Buscar usuario por email
        user = await user_service.get_user_by_email(login_data.email)
        if not user:
            return jsonify({"error": "Credenciales inválidas"}), 401
        
        # Verificar contraseña
        if not verify_password(login_data.password, user.get('password_hash', '')):
            return jsonify({"error": "Credenciales inválidas"}), 401
        
        # Crear token de acceso
        access_token_expires = timedelta(minutes=30)
        access_token = create_access_token(
            data={"sub": user["email"], "user_id": user["id"]},
            expires_delta=access_token_expires
        )
        
        # Preparar respuesta (sin la contraseña)
        user_response = user.copy()
        user_response.pop('password_hash', None)
        
        return jsonify({
            "access_token": access_token,
            "token_type": "bearer",
            "user": user_response
        })
        
    except Exception as e:
        return jsonify({"error": "Error en el inicio de sesión"}), 500

@auth_bp.route('/register', methods=['POST'])
async def register():
    try:
        # Validar datos de entrada
        user_data = request.get_json()
        
        # Crear usuario
        user = await user_service.create_user(user_data)
        
        # Crear token de acceso
        access_token_expires = timedelta(minutes=30)
        access_token = create_access_token(
            data={"sub": user["email"], "user_id": user["id"]},
            expires_delta=access_token_expires
        )
        
        # Preparar respuesta (sin la contraseña)
        user_response = user.copy()
        user_response.pop('password_hash', None)
        
        return jsonify({
            "access_token": access_token,
            "token_type": "bearer",
            "user": user_response
        }), 201
        
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Error en el registro"}), 500
