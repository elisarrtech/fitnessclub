// frontend/src/pages/Classes.jsx
import React, { useState, useEffect } from 'react';
import { classesAPI } from '../services/api';
import ClassCard from '../components/features/classes/ClassCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await classesAPI.getWithSchedules();
      setClasses(response.data);
    } catch (err) {
      setError('Error al cargar las clases');
      console.error('Error fetching classes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookClass = (classData) => {
    // Aquí implementaremos la lógica de reserva
    console.log('Reservar clase:', classData);
    alert(`Funcionalidad de reserva para ${classData.title} - Implementar en próxima iteración`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
          <button
            onClick={fetchClasses}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Clases Disponibles</h1>
        <p className="mt-2 text-gray-600">
          Explora nuestras clases y reserva tu lugar favorito
        </p>
      </div>
      
      {classes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay clases disponibles en este momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classData) => (
            <ClassCard
              key={classData.id}
              class={classData}
              onBook={handleBookClass}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Classes;
