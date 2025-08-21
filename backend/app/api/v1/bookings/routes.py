# app/api/v1/bookings/routes.py
from flask import Blueprint, request, jsonify
from app.core.auth_middleware import auth_required
from app.api.v1.bookings.controllers import create_booking, get_bookings_by_user, cancel_booking, get_bookings_with_details

# Definición del blueprint - esta es la línea crucial que faltaba
bookings_bp = Blueprint('bookings', __name__, url_prefix='/bookings')

@bookings_bp.route('/', methods=['POST'])
@auth_required
def create_booking_route():
    try:
        # Obtener el ID del usuario del token
        user_id = request.current_user.get('sub')  # Cambiado de 'user_id' a 'sub'
        if not user_id:
            return jsonify({"error": "Usuario no autenticado"}), 401
        
        booking_data = request.get_json()
        if not booking_data:
            return jsonify({"error": "No se proporcionaron datos"}), 400
            
        # Asegurar que la reserva sea del usuario autenticado
        booking_data['user_id'] = user_id
        
        booking = create_booking(booking_data)
        return jsonify(booking), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Error creando reserva"}), 500

@bookings_bp.route('/my-bookings', methods=['GET'])
@auth_required
def get_my_bookings_route():
    try:
        user_id = request.current_user.get('sub')  # Cambiado de 'user_id' a 'sub'
        bookings = get_bookings_by_user(user_id)
        return jsonify(bookings)
    except Exception as e:
        return jsonify({"error": "Error obteniendo mis reservas"}), 500

@bookings_bp.route('/<booking_id>/cancel', methods=['POST'])
@auth_required
def cancel_booking_route(booking_id):
    try:
        user_id = request.current_user.get('sub')  # Cambiado de 'user_id' a 'sub'
        booking = cancel_booking(booking_id, user_id)
        if booking:
            return jsonify(booking)
        return jsonify({"error": "Reserva no encontrada"}), 404
    except Exception as e:
        return jsonify({"error": "Error cancelando reserva"}), 500

@bookings_bp.route('/with-details', methods=['GET'])
@auth_required
def get_bookings_with_details_route():
    try:
        # Solo administradores pueden ver todos los detalles
        if request.current_user.get('role') != 'ADMIN':
            return jsonify({"error": "Acceso denegado"}), 403
        
        bookings = get_bookings_with_details()
        return jsonify(bookings)
    except Exception as e:
        return jsonify({"error": "Error obteniendo reservas con detalles"}), 500
