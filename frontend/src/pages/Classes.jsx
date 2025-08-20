// frontend/src/pages/Classes.jsx
import React from 'react';
import ClassList from '../components/classes/ClassList';

const Classes = () => {
  const handleBookClass = (classData) => {
    // Aquí implementarías la lógica de reserva
    console.log('Reservar clase:', classData);
    alert(`Funcionalidad de reserva para ${classData.title} - Implementar en próxima iteración`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Clases Disponibles</h1>
        <p className="mt-2 text-gray-600">
          Explora nuestras clases y reserva tu lugar favorito
        </p>
      </div>
      
      <ClassList onBookClass={handleBookClass} />
    </div>
  );
};

export default Classes;
