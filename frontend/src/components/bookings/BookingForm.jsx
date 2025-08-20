// frontend/src/components/bookings/BookingForm.jsx (actualizado)
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { bookingsAPI } from '../../services/api';
import notificationService from '../../services/notificationService';

const BookingForm = ({ schedule, classData, onBookingSuccess, onCancel }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBooking = async () => {
    if (!user) {
      setError('Debes iniciar sesión para reservar una clase');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const bookingData = {
        schedule_id: schedule.id,
        user_email: user.email
      };

      const response = await bookingsAPI.create(bookingData);
      
      // Enviar notificación de confirmación
      await notificationService.sendBookingConfirmation(response.data, user);
      
      if (onBookingSuccess) {
        onBookingSuccess(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error al reservar la clase');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) + ' a las ' + date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Confirmar Reserva</h3>
      
      <div className="space-y-4">
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900">{classData.title}</h4>
          <p className="text-sm text-gray-600 mt-1">
            {formatDateTime(schedule.start_ts)}
          </p>
          <p className="text-sm text-gray-600">
            Duración: {classData.duration_min} minutos
          </p>
          <p className="text-sm text-gray-600">
            Instructor: {classData.instructor?.name || 'Por asignar'}
          </p>
          {schedule.room && (
            <p className="text-sm text-gray-600">
              Sala: {schedule.room}
            </p>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900">Detalles de la Reserva</h4>
          <p className="text-sm text-blue-800 mt-1">
            Precio: ${(classData.base_price / 100).toFixed(2)}
          </p>
          <p className="text-sm text-blue-800">
            Capacidad disponible: {classData.capacity} lugares
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="flex space-x-3 pt-4">
          <button
            onClick={handleBooking}
            disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md transition duration-300 disabled:opacity-50"
          >
            {loading ? 'Procesando...' : 'Confirmar Reserva'}
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition duration-300"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
