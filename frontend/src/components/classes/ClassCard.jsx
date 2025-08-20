// frontend/src/components/classes/ClassCard.jsx
import React, { useState } from 'react';
import BookingForm from '../bookings/BookingForm';

const ClassCard = ({ class: classData, onBookSuccess }) => {
  const [showBookingForm, setShowBookingForm] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // Función para calcular lugares disponibles con validación
  const getAvailableSeats = (schedule) => {
    // Validar que los datos existan y sean números válidos
    if (!schedule || !classData || !classData.capacity) {
      return 'N/A';
    }
    
    const currentBookings = schedule.current_bookings || 0;
    const capacity = classData.capacity;
    
    // Calcular lugares disponibles
    const available = capacity - currentBookings;
    
    // Devolver como string para evitar problemas de renderizado
    return available < 0 ? 'Llena' : available.toString();
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    }) + ' ' + date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleBookClass = (schedule) => {
    setShowBookingForm(schedule);
  };

  const handleBookingSuccess = (bookingData) => {
    setBookingSuccess(bookingData);
    setShowBookingForm(null);
    if (onBookSuccess) {
      onBookSuccess(bookingData);
    }
    
    // Ocultar mensaje de éxito después de 3 segundos
    setTimeout(() => {
      setBookingSuccess(null);
    }, 3000);
  };

  if (showBookingForm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="max-w-md w-full">
          <BookingForm
            schedule={showBookingForm}
            classData={classData}
            onBookingSuccess={handleBookingSuccess}
            onCancel={() => setShowBookingForm(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {bookingSuccess && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                <span className="font-medium">¡Reserva confirmada!</span> Tu clase ha sido reservada exitosamente.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{classData.title}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {classData.level} • {classData.duration_min} min
            </p>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {classData.modality}
          </span>
        </div>
        
        <div className="mt-4">
          <p className="text-gray-600">
            Capacidad: {classData.capacity} personas
          </p>
          <p className="text-gray-600">
            Precio: ${(classData.base_price / 100).toFixed(2)}
          </p>
        </div>
        
        {classData.schedules && classData.schedules.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900">Próximos horarios:</h4>
            <ul className="mt-2 space-y-2">
              {classData.schedules.slice(0, 3).map((schedule) => (
                <li key={schedule.id} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">
                    {formatDateTime(schedule.start_ts)}
                  </span>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">
                      {getAvailableSeats(schedule)} lugares
                    </span>
                    <button
                      onClick={() => handleBookClass(schedule)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Reservar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="mt-6">
          <button
            onClick={() => alert('Funcionalidad de ver detalles de clase - Implementar en próxima iteración')}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-300"
          >
            Ver Detalles
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassCard;
