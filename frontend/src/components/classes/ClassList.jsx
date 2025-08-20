// frontend/src/components/classes/ClassList.jsx
import React, { useState, useEffect } from 'react';
import ClassCard from './ClassCard';
import LoadingSpinner from '../common/LoadingSpinner';

const ClassList = ({ onBookClass }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Datos de ejemplo - en producción esto vendría de la API
  const sampleClasses = [
    {
      id: 1,
      title: 'Yoga Vinyasa',
      modality: 'presencial',
      level: 'básico',
      duration_min: 60,
      base_price: 18000,
      capacity: 18,
      schedules: [
        {
          id: 1,
          start_ts: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          end_ts: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          start_ts: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          end_ts: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString()
        }
      ]
    },
    {
      id: 2,
      title: 'HIIT 30',
      modality: 'presencial',
      level: 'intermedio',
      duration_min: 30,
      base_price: 12000,
      capacity: 20,
      schedules: [
        {
          id: 3,
          start_ts: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
          end_ts: new Date(Date.now() + 3 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString()
        }
      ]
    },
    {
      id: 3,
      title: 'Pilates Mat',
      modality: 'presencial',
      level: 'básico',
      duration_min: 45,
      base_price: 15000,
      capacity: 15,
      schedules: []
    }
  ];

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setClasses(sampleClasses);
      setLoading(false);
    }, 1000);
  }, []);

  const handleBookClass = (classData) => {
    if (onBookClass) {
      onBookClass(classData);
    } else {
      alert(`Funcionalidad de reserva para ${classData.title} - Implementar en próxima iteración`);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classData) => (
          <ClassCard
            key={classData.id}
            class={classData}
            onBook={handleBookClass}
          />
        ))}
      </div>
      
      {classes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay clases disponibles en este momento.</p>
        </div>
      )}
    </div>
  );
};

export default ClassList;
