// frontend/src/components/bookings/BookingForm.jsx (actualizado con recordatorios)
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { bookingsAPI } from '../../services/api';
import notificationService from '../../services/notificationService';
import reminderService from '../../services/reminderService';

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
      
      // Programar recordatorio (1 hora antes de la clase)
      reminderService.scheduleReminder(response.data, user, 60);
      
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
          <p className="text-sm text-blue-800 mt-2">
            <svg className="inline h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Recibirás un recordatorio 1 hora antes de la clase
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
