// frontend/src/components/admin/ClassForm.jsx
import React, { useState } from 'react';

const ClassForm = ({ initialData, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    modality: initialData?.modality || 'presencial',
    level: initialData?.level || 'básico',
    duration_min: initialData?.duration_min || 60,
    base_price: initialData?.base_price || 18000,
    capacity: initialData?.capacity || 18,
    description: initialData?.description || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'duration_min' || name === 'base_price' || name === 'capacity' 
        ? parseInt(value) || 0 
        : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.title.trim()) {
      setError('El título de la clase es requerido');
      return;
    }
    
    if (formData.duration_min <= 0) {
      setError('La duración debe ser mayor a 0');
      return;
    }
    
    if (formData.base_price <= 0) {
      setError('El precio debe ser mayor a 0');
      return;
    }
    
    if (formData.capacity <= 0) {
      setError('La capacidad debe ser mayor a 0');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // En producción, aquí conectarías con la API
      // const response = initialData 
      //   ? await classesAPI.update(initialData.id, formData)
      //   : await classesAPI.create(formData);
      
      // Simular éxito
      const classData = {
        ...formData,
        id: initialData?.id || Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      if (onSuccess) {
        onSuccess(classData);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar la clase');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">
          {initialData ? 'Editar Clase' : 'Crear Nueva Clase'}
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
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Título de la Clase *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
              placeholder="Ej: Yoga Vinyasa"
            />
          </div>
          
          <div>
            <label htmlFor="modality" className="block text-sm font-medium text-gray-700 mb-1">
              Modalidad
            </label>
            <select
              id="modality"
              name="modality"
              value={formData.modality}
              onChange={handleChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
            >
              <option value="presencial">Presencial</option>
              <option value="online">Online</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
              Nivel
            </label>
            <select
              id="level"
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
            >
              <option value="básico">Básico</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="duration_min" className="block text-sm font-medium text-gray-700 mb-1">
              Duración (minutos) *
            </label>
            <input
              type="number"
              id="duration_min"
              name="duration_min"
              value={formData.duration_min}
              onChange={handleChange}
              min="1"
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
              placeholder="60"
            />
          </div>
          
          <div>
            <label htmlFor="base_price" className="block text-sm font-medium text-gray-700 mb-1">
              Precio (centavos) *
            </label>
            <input
              type="number"
              id="base_price"
              name="base_price"
              value={formData.base_price}
              onChange={handleChange}
              min="1"
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
              placeholder="18000"
            />
            <p className="mt-1 text-xs text-gray-500">
              ${(formData.base_price / 100).toFixed(2)} en dólares
            </p>
          </div>
          
          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
              Capacidad *
            </label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              min="1"
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
              placeholder="18"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
            placeholder="Describe brevemente la clase..."
          />
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
              initialData ? 'Actualizar Clase' : 'Crear Clase'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClassForm;
