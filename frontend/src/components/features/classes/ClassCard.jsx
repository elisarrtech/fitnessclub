// frontend/src/components/features/classes/ClassCard.jsx
import React from 'react';

const ClassCard = ({ class: classData, onBook }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
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
            <ul className="mt-2 space-y-1">
              {classData.schedules.slice(0, 3).map((schedule) => (
                <li key={schedule.id} className="text-sm text-gray-600">
                  {new Date(schedule.start_ts).toLocaleDateString()} - {new Date(schedule.start_ts).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="mt-6">
          <button
            onClick={() => onBook && onBook(classData)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
          >
            Reservar Clase
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassCard;
