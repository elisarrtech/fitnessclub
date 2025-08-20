// frontend/src/components/instructors/InstructorList.jsx
import React, { useState, useEffect } from 'react';
import InstructorCard from './InstructorCard';
import LoadingSpinner from '../common/LoadingSpinner';

const InstructorList = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Datos de ejemplo - en producción esto vendría de la API
  const sampleInstructors = [
    {
      id: 1,
      name: 'Alex Coach',
      email: 'alex@fitnessclub.com',
      bio: 'Especialista en HIIT y fuerza funcional con más de 10 años de experiencia.',
      rating: 4.8
    },
    {
      id: 2,
      name: 'Maria Fitness',
      email: 'maria@fitnessclub.com',
      bio: 'Instructora de yoga y pilates certificada con enfoque en bienestar integral.',
      rating: 4.9
    },
    {
      id: 3,
      name: 'Carlos Strength',
      email: 'carlos@fitnessclub.com',
      bio: 'Especialista en entrenamiento de fuerza y nutrición deportiva.',
      rating: 4.7
    }
  ];

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setInstructors(sampleInstructors);
      setLoading(false);
    }, 1000);
  }, []);

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
        {instructors.map((instructor) => (
          <InstructorCard key={instructor.id} instructor={instructor} />
        ))}
      </div>
      
      {instructors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay instructores disponibles en este momento.</p>
        </div>
      )}
    </div>
  );
};

export default InstructorList;
