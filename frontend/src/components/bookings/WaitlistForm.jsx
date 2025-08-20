// frontend/src/components/bookings/WaitlistForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { bookingsAPI } from '../../services/api';

const WaitlistForm = ({ schedule, classData, onWaitlistSuccess, onCancel }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoinWaitlist = async () => {
    if (!user) {
      setError('Debes iniciar sesión para unirte a la lista de espera');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const waitlistData = {
        schedule_id: schedule.id,
        user_email: user.email
      };

      const response = await bookingsAPI.joinWaitlist(waitlistData);
      
      if (onWaitlistSuccess) {
        onWaitlistSuccess(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error al unirse a la lista de espera');
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
      <h3 className="text-xl font-bold text-gray-900 mb-4">Lista de Espera</h3>
      
      <div className="space-y-4">
        <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Clase Llena</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Esta clase ha alcanzado su capacidad máxima. Puedes unirte a la lista de espera y serás notificado si hay disponibilidad.
                </p>
              </div>
            </div>
          </div>
        </div>

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

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="flex space-x-3 pt-4">
          <button
            onClick={handleJoinWaitlist}
            disabled={loading}
            className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-4 rounded-md transition duration-300 disabled:opacity-50"
          >
            {loading ? 'Uniéndose...' : 'Unirme a Lista de Espera'}
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

export default WaitlistForm;
