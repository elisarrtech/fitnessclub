// frontend/src/pages/ClassDetail.jsx (actualizado)
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { classesAPI } from '../services/api';
import BookingForm from '../components/bookings/BookingForm';
import ReviewList from '../components/reviews/ReviewList';

const ClassDetail = () => {
  const { id } = useParams();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  useEffect(() => {
    fetchClassDetail();
  }, [id]);

  const fetchClassDetail = async () => {
    try {
      setLoading(true);
      const response = await classesAPI.getById(id);
      setClassData(response.data);
    } catch (err) {
      setError('Clase no encontrada');
      console.error('Error fetching class:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookClass = (schedule) => {
    setShowBookingForm(schedule);
  };

  const handleBookingSuccess = (bookingData) => {
    setBookingSuccess(bookingData);
    setShowBookingForm(null);
    
    // Recargar los detalles de la clase para actualizar la información
    fetchClassDetail();
    
    // Ocultar mensaje de éxito después de 3 segundos
    setTimeout(() => {
      setBookingSuccess(null);
    }, 3000);
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !classData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Clase no encontrada</p>
          <Link to="/classes" className="mt-2 inline-block text-blue-600 hover:text-blue-800">
            ← Volver a clases
          </Link>
        </div>
      </div>
    );
  }

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
    <div className="container mx-auto px-4 py-8">
      <Link to="/classes" className="inline-block mb-4 text-blue-600 hover:text-blue-800">
        ← Volver a clases
      </Link>
      
      {bookingSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
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
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{classData.title}</h1>
              <div className="flex items-center mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {classData.modality}
                </span>
                <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {classData.level}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                ${(classData.base_price / 100).toFixed(2)}
              </p>
              <p className="text-gray-600">{classData.duration_min} minutos</p>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-900">Descripción</h2>
            <p className="mt-2 text-gray-600">
              {classData.description || 'Descripción no disponible'}
            </p>
          </div>

          {/* Instructor */}
          {classData.instructor && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">Instructor</h2>
              <div className="mt-2 flex items-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
                <div className="ml-3">
                  <p className="font-medium text-gray-900">{classData.instructor.name}</p>
                  {classData.instructor.rating && (
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1 text-sm text-gray-600">{classData.instructor.rating}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Horarios disponibles */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-900">Horarios Disponibles</h2>
            <div className="mt-4 space-y-3">
              {classData.schedules && classData.schedules.length > 0 ? (
                classData.schedules.map((schedule) => (
                  <div key={schedule.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        {formatDateTime(schedule.start_ts)}
                      </p>
                      <p className="text-gray-600">
                        {new Date(schedule.start_ts).toLocaleTimeString('es-ES', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })} - {new Date(schedule.end_ts).toLocaleTimeString('es-ES', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                      {schedule.room && (
                        <p className="text-sm text-gray-500">Sala: {schedule.room}</p>
                      )}
                    </div>
                    <button 
                      onClick={() => handleBookClass(schedule)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
                    >
                      Reservar
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No hay horarios disponibles próximamente.</p>
              )}
            </div>
          </div>

          {/* Reseñas */}
          <ReviewList classId={classData.id} />

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600">Capacidad: {classData.capacity} personas</p>
              </div>
              <button 
                onClick={() => alert('Funcionalidad de reserva general - Implementar en próxima iteración')}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-md transition duration-300"
              >
                Reservar Clase
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetail;
