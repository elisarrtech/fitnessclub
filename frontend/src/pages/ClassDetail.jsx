// frontend/src/pages/ClassDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const ClassDetail = () => {
  const { id } = useParams();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Datos de ejemplo - en producción esto vendría de la API
  const sampleClass = {
    id: id,
    title: 'Yoga Vinyasa',
    modality: 'presencial',
    level: 'básico',
    duration_min: 60,
    base_price: 18000,
    capacity: 18,
    description: 'Una clase de yoga dinámica que sincroniza la respiración con el movimiento. Perfecta para principiantes que quieren mejorar su flexibilidad y encontrar equilibrio.',
    instructor: {
      id: 1,
      name: 'Alex Coach',
      bio: 'Especialista en HIIT y fuerza con más de 10 años de experiencia.',
      rating: 4.8
    },
    schedules: [
      {
        id: 1,
        start_ts: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        end_ts: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
        room: 'Sala A'
      },
      {
        id: 2,
        start_ts: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        end_ts: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
        room: 'Sala B'
      }
    ]
  };

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setClassData(sampleClass);
      setLoading(false);
    }, 500);
  }, [id]);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/classes" className="inline-block mb-4 text-blue-600 hover:text-blue-800">
        ← Volver a clases
      </Link>
      
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
              {classData.description}
            </p>
          </div>

          {/* Instructor */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-900">Instructor</h2>
            <div className="mt-2 flex items-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
              <div className="ml-3">
                <p className="font-medium text-gray-900">{classData.instructor.name}</p>
                <div className="flex items-center">
                  <span className="text-yellow-500">★</span>
                  <span className="ml-1 text-sm text-gray-600">{classData.instructor.rating}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Horarios disponibles */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-900">Horarios Disponibles</h2>
            <div className="mt-4 space-y-3">
              {classData.schedules && classData.schedules.length > 0 ? (
                classData.schedules.map((schedule) => (
                  <div key={schedule.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        {new Date(schedule.start_ts).toLocaleDateString('es-ES', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
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
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300">
                      Reservar
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No hay horarios disponibles próximamente.</p>
              )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600">Capacidad: {classData.capacity} personas</p>
              </div>
              <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-md transition duration-300">
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
