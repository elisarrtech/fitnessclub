# app/api/v1/bookings.py
from flask import Blueprint, request, jsonify
from app.core.auth_middleware import auth_required
from app.services import booking_service

bookings_bp = Blueprint('bookings', __name__, url_prefix='/api/v1/bookings')

@bookings_bp.route('/', methods=['POST'])
@auth_required
async def create_booking():
    try:
        # Obtener el ID del usuario del token
        user_id = request.current_user.get('user_id')
        if not user_id:
            return jsonify({"error": "Usuario no autenticado"}), 401
        
        booking_data = request.get_json()
        # Asegurar que el booking sea del usuario autenticado
        booking_data['user_id'] = user_id
        
        booking = await booking_service.create_booking(booking_data)
        return jsonify(booking), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Error creando reserva"}), 500

@bookings_bp.route('/my-bookings', methods=['GET'])
@auth_required
async def get_my_bookings():
    try:
        user_id = request.current_user.get('user_id')
        bookings = await booking_service.get_bookings_by_user(user_id)
        return jsonify(bookings)
    except Exception as e:
        return jsonify({"error": "Error obteniendo mis reservas"}), 500

@bookings_bp.route('/<booking_id>/cancel', methods=['POST'])
@auth_required
async def cancel_booking(booking_id):
    try:
        user_id = request.current_user.get('user_id')
        booking = await booking_service.cancel_booking(booking_id, user_id)
        if booking:
            return jsonify(booking)
        return jsonify({"error": "Reserva no encontrada"}), 404
    except Exception as e:
        return jsonify({"error": "Error cancelando reserva"}), 500

@bookings_bp.route('/with-details', methods=['GET'])
@auth_required
async def get_bookings_with_details():
    try:
        # Solo administradores pueden ver todos los detalles
        if request.current_user.get('role') != 'ADMIN':
            return jsonify({"error": "Acceso denegado"}), 403
        
        bookings = await booking_service.get_bookings_with_details()
        return jsonify(bookings)
    except Exception as e:
        return jsonify({"error": "Error obteniendo reservas con detalles"}), 500
