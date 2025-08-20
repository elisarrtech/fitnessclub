// frontend/src/components/admin/ScheduleForm.jsx
import React, { useState } from 'react';

const ScheduleForm = ({ initialData, classes, instructors, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    class_id: initialData?.class_id || '',
    instructor_id: initialData?.instructor_id || '',
    start_ts: initialData?.start_ts ? new Date(initialData.start_ts).toISOString().slice(0, 16) : '',
    end_ts: initialData?.end_ts ? new Date(initialData.end_ts).toISOString().slice(0, 16) : '',
    room: initialData?.room || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.class_id) {
      setError('Debe seleccionar una clase');
      return;
    }
    
    if (!formData.start_ts) {
      setError('Debe seleccionar una fecha y hora de inicio');
      return;
    }
    
    if (!formData.end_ts) {
      setError('Debe seleccionar una fecha y hora de fin');
      return;
    }
    
    const startDate = new Date(formData.start_ts);
    const endDate = new Date(formData.end_ts);
    
    if (startDate >= endDate) {
      setError('La fecha de inicio debe ser anterior a la fecha de fin');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // En producción, aquí conectarías con la API
      const scheduleData = {
        ...formData,
        start_ts: new Date(formData.start_ts).toISOString(),
        end_ts: new Date(formData.end_ts).toISOString(),
        id: initialData?.id || Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      if (onSuccess) {
        onSuccess(scheduleData);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar el horario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">
          {initialData ? 'Editar Horario' : 'Crear Nuevo Horario'}
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="px-6 py-4">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="class_id" className="block text-sm font-medium text-gray-700 mb-1">
              Clase *
            </label>
            <select
              id="class_id"
              name="class_id"
              value={formData.class_id}
              onChange={handleChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
            >
              <option value="">Seleccione una clase</option>
              {classes.map((classItem) => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.title} ({classItem.level})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="instructor_id" className="block text-sm font-medium text-gray-700 mb-1">
              Instructor
            </label>
            <select
              id="instructor_id"
              name="instructor_id"
              value={formData.instructor_id}
              onChange={handleChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
            >
              <option value="">Sin asignar</option>
              {instructors.map((instructor) => (
                <option key={instructor.id} value={instructor.id}>
                  {instructor.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="start_ts" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha y Hora de Inicio *
            </label>
            <input
              type="datetime-local"
              id="start_ts"
              name="start_ts"
              value={formData.start_ts}
              onChange={handleChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
            />
          </div>
          
          <div>
            <label htmlFor="end_ts" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha y Hora de Fin *
            </label>
            <input
              type="datetime-local"
              id="end_ts"
              name="end_ts"
              value={formData.end_ts}
              onChange={handleChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
            />
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="room" className="block text-sm font-medium text-gray-700 mb-1">
              Sala
            </label>
            <input
              type="text"
              id="room"
              name="room"
              value={formData.room}
              onChange={handleChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
              placeholder="Nombre de la sala (opcional)"
            />
          </div>
        </div>
        
        <div className="mt-8 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              </>
            ) : (
              initialData ? 'Actualizar Horario' : 'Crear Horario'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleForm;
