// frontend/src/pages/Instructors.jsx
import React from 'react';
import InstructorList from '../components/instructors/InstructorList';

const Instructors = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Nuestros Instructores</h1>
        <p className="mt-2 text-gray-600">
          Conoce a nuestro equipo de profesionales certificados
        </p>
      </div>
      
      <InstructorList />
    </div>
  );
};

export default Instructors;
