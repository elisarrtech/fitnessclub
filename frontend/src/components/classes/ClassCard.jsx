// frontend/src/components/classes/ClassCard.jsx (actualizado)
import React, { useState } from 'react';
import BookingForm from '../bookings/BookingForm';
import WaitlistForm from '../bookings/WaitlistForm';

const ClassCard = ({ class: classData, onBookSuccess }) => {
  const [showBookingForm, setShowBookingForm] = useState(null);
  const [showWaitlistForm, setShowWaitlistForm] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [waitlistSuccess, setWaitlistSuccess] = useState(null);

  const handleBookClass = (schedule) => {
    // Verificar si la clase está llena
    const isFull = schedule.current_bookings >= classData.capacity;
    
    if (isFull) {
      setShowWaitlistForm(schedule);
    } else {
      setShowBookingForm(schedule);
    }
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

  const handleWaitlistSuccess = (waitlistData) => {
    setWaitlistSuccess(waitlistData);
    setShowWaitlistForm(null);
    
    // Ocultar mensaje de éxito después de 3 segundos
    setTimeout(() => {
      setWaitlistSuccess(null);
    }, 3000);
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

  if (showWaitlistForm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="max-w-md w-full">
          <WaitlistForm
            schedule={showWaitlistForm}
            classData={classData}
            onWaitlistSuccess={handleWaitlistSuccess}
            onCancel={() => setShowWaitlistForm(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {(bookingSuccess || waitlistSuccess) && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                <span className="font-medium">
                  {bookingSuccess ? '¡Reserva confirmada!' : '¡Agregado a lista de espera!'}
                </span> {bookingSuccess ? 'Tu clase ha sido reservada exitosamente.' : 'Serás notificado si hay disponibilidad.'}
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
              {classData.schedules.slice(0, 3).map((schedule) => {
                const isFull = schedule.current_bookings >= classData.capacity;
                const availability = classData.capacity - schedule.current_bookings;
                
                return (
                  <li key={schedule.id} className="flex justify-between items-center text-sm">
                    <div className="flex-1">
                      <span className="text-gray-600">
                        {formatDateTime(schedule.start_ts)}
                      </span>
                      {isFull ? (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Llena
                        </span>
                      ) : (
                        <span className="ml-2 text-gray-500">
                          ({availability} lugares)
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleBookClass(schedule)}
                      className={`font-medium ${
                        isFull 
                          ? 'text-yellow-600 hover:text-yellow-800' 
                          : 'text-blue-600 hover:text-blue-800'
                      }`}
                    >
                      {isFull ? 'Lista Espera' : 'Reservar'}
                    </button>
                  </li>
                );
              })}
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
