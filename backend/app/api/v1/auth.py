# backend/app/api/v1/auth.py
from flask import Blueprint, request, jsonify
from app.core.auth import create_access_token, verify_password, hash_password
from app.core.database import users_collection
from datetime import timedelta
from bson import ObjectId
import re

auth_bp = Blueprint('auth', __name__, url_prefix='/api/v1/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        user_data = request.get_json()
        
        # Validar datos requeridos
        if not user_data.get('email') or not user_data.get('password'):
            return jsonify({"error": "Email y contraseña son requeridos"}), 400
        
        # Validar formato de email
        if not re.match(r"[^@]+@[^@]+\.[^@]+", user_data['email']):
            return jsonify({"error": "Formato de email inválido"}), 400
        
        # Verificar que el email no esté registrado
        existing_user = users_collection.find_one({"email": user_data['email']})
        if existing_user:
            return jsonify({"error": "El email ya está registrado"}), 400
        
        # Hashear contraseña
        hashed_password = hash_password(user_data['password'])
        
        # Crear documento de usuario
        user_doc = {
            "email": user_data['email'],
            "name": user_data.get('name', ''),
            "phone": user_data.get('phone', ''),
            "role": user_data.get('role', 'USER'),
            "password_hash": hashed_password,
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
        
        # Insertar en base de datos
        result = users_collection.insert_one(user_doc)
        user_doc['_id'] = str(result.inserted_id)
        
        # Crear token de acceso
        access_token_expires = timedelta(minutes=30)
        access_token = create_access_token(
            data={"sub": user_doc["email"], "user_id": user_doc["_id"]},
            expires_delta=access_token_expires
        )
        
        # Preparar respuesta (sin la contraseña)
        user_response = user_doc.copy()
        user_response.pop('password_hash', None)
        
        return jsonify({
            "access_token": access_token,
            "token_type": "bearer",
            "user": user_response
        }), 201
        
    except Exception as e:
        return jsonify({"error": "Error en el registro"}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        credentials = request.get_json()
        
        # Validar datos requeridos
        if not credentials.get('email') or not credentials.get('password'):
            return jsonify({"error": "Email y contraseña son requeridos"}), 400
        
        # Buscar usuario por email
        user = users_collection.find_one({"email": credentials['email']})
        if not user:
            return jsonify({"error": "Credenciales inválidas"}), 401
        
        # Verificar contraseña
        if not verify_password(credentials['password'], user.get('password_hash', '')):
            return jsonify({"error": "Credenciales inválidas"}), 401
        
        # Crear token de acceso
        access_token_expires = timedelta(minutes=30)
        access_token = create_access_token(
            data={"sub": user["email"], "user_id": str(user["_id"])},
            expires_delta=access_token_expires
        )
        
        # Preparar respuesta (sin la contraseña)
        user_response = user.copy()
        user_response['_id'] = str(user_response['_id'])
        user_response.pop('password_hash', None)
        
        return jsonify({
            "access_token": access_token,
            "token_type": "bearer",
            "user": user_response
        })
        
    except Exception as e:
        return jsonify({"error": "Error en el inicio de sesión"}), 500

# Registrar el blueprint en main.py
def register_routes(app):
    app.register_blueprint(auth_bp)
