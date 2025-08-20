// frontend/src/pages/admin/ClassManagement.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { classesAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ClassForm from '../../components/admin/ClassForm';

const ClassManagement = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingClass, setEditingClass] = useState(null);

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      fetchClasses();
    }
  }, [user]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await classesAPI.getAll();
      setClasses(response.data);
    } catch (err) {
      setError('Error al cargar las clases');
      console.error('Error fetching classes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = () => {
    setEditingClass(null);
    setShowForm(true);
  };

  const handleEditClass = (classData) => {
    setEditingClass(classData);
    setShowForm(true);
  };

  const handleDeleteClass = async (classId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta clase? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      // En producción, aquí conectarías con la API para eliminar la clase
      // await classesAPI.delete(classId);
      
      // Actualizar la lista localmente
      setClasses(classes.filter(c => c.id !== classId));
      
      alert('Clase eliminada exitosamente');
    } catch (err) {
      alert('Error al eliminar la clase');
    }
  };

  const handleFormSuccess = (classData) => {
    setShowForm(false);
    setEditingClass(null);
    
    // Actualizar la lista de clases
    if (editingClass) {
      // Actualizar clase existente
      setClasses(classes.map(c => c.id === classData.id ? classData : c));
    } else {
      // Agregar nueva clase
      setClasses([...classes, classData]);
    }
    
    alert(editingClass ? 'Clase actualizada exitosamente' : 'Clase creada exitosamente');
  };

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Acceso denegado. Solo administradores pueden acceder a esta página.</p>
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="max-w-2xl w-full max-h-screen overflow-y-auto">
          <ClassForm
            initialData={editingClass}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false);
              setEditingClass(null);
            }}
          />
        </div>
      </div>
    );
  }

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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Clases</h1>
          <p className="mt-2 text-gray-600">
            Administra todas las clases disponibles en el centro
          </p>
        </div>
        <button
          onClick={handleCreateClass}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Nueva Clase
        </button>
      </div>

      {/* Tabla de clases */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Clase
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Modalidad
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nivel
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duración
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Capacidad
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {classes.map((classData) => (
              <tr key={classData.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{classData.title}</div>
                      <div className="text-sm text-gray-500 line-clamp-2">{classData.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {classData.modality}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {classData.level}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {classData.duration_min} min
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${(classData.base_price / 100).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {classData.capacity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEditClass(classData)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteClass(classData.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {classes.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay clases</h3>
            <p className="mt-1 text-sm text-gray-500">
              Comienza creando tu primera clase.
            </p>
            <div className="mt-6">
              <button
                onClick={handleCreateClass}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Crear Primera Clase
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassManagement;
