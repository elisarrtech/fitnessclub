// frontend/src/components/instructors/InstructorCard.jsx
import React from 'react';

const InstructorCard = ({ instructor }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
          <div>
            <h3 className="text-xl font-bold text-gray-900">{instructor.name}</h3>
            {instructor.rating && (
              <div className="flex items-center">
                <span className="text-yellow-500">★</span>
                <span className="ml-1 text-sm text-gray-600">{instructor.rating}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-gray-600 text-sm line-clamp-3">
            {instructor.bio || 'Sin biografía disponible'}
          </p>
        </div>
        
        <div className="mt-6">
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition duration-300">
            Ver Perfil
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructorCard;
