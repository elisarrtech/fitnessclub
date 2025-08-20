# app/core/auth_middleware.py
from functools import wraps
from flask import request, jsonify
from app.core.security import verify_token

def auth_required(f):
    """Decorador para proteger rutas que requieren autenticación"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None
        
        # Obtener token del header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({'error': 'Token inválido'}), 401
        
        if not token:
            return jsonify({'error': 'Token requerido'}), 401
        
        # Verificar token
        payload = verify_token(token)
        if not payload:
            return jsonify({'error': 'Token inválido'}), 401
        
        # Agregar información del usuario al request context
        request.current_user = payload
        return f(*args, **kwargs)
    
    return decorated_function
