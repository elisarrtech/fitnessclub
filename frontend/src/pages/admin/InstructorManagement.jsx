// frontend/src/pages/admin/InstructorManagement.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { instructorsAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import InstructorForm from '../../components/admin/InstructorForm';

const InstructorManagement = () => {
  const { user } = useAuth();
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState(null);

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      fetchInstructors();
    }
  }, [user]);

  const fetchInstructors = async () => {
    try {
      setLoading(true);
      const response = await instructorsAPI.getAll();
      setInstructors(response.data);
    } catch (err) {
      setError('Error al cargar los instructores');
      console.error('Error fetching instructors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInstructor = () => {
    setEditingInstructor(null);
    setShowForm(true);
  };

  const handleEditInstructor = (instructorData) => {
    setEditingInstructor(instructorData);
    setShowForm(true);
  };

  const handleDeleteInstructor = async (instructorId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este instructor? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      // En producción, aquí conectarías con la API para eliminar el instructor
      // await instructorsAPI.delete(instructorId);

      // Actualizar la lista localmente
      setInstructors(instructors.filter(i => i.id !== instructorId));

      alert('Instructor eliminado exitosamente');
    } catch (err) {
      alert('Error al eliminar el instructor');
    }
  };

  const handleFormSuccess = (instructorData) => {
    setShowForm(false);
    setEditingInstructor(null);

    // Actualizar la lista de instructores
    if (editingInstructor) {
      // Actualizar instructor existente
      setInstructors(instructors.map(i => i.id === instructorData.id ? instructorData : i));
    } else {
      // Agregar nuevo instructor
      setInstructors([...instructors, instructorData]);
    }

    alert(editingInstructor ? 'Instructor actualizado exitosamente' : 'Instructor creado exitosamente');
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
          <InstructorForm
            initialData={editingInstructor}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false);
              setEditingInstructor(null);
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
            onClick={fetchInstructors}
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
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Instructores</h1>
          <p className="mt-2 text-gray-600">
            Administra todos los instructores del centro
          </p>
        </div>
        <button
          onClick={handleCreateInstructor}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Nuevo Instructor
        </button>
      </div>

      {/* Tabla de instructores */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Instructor
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Teléfono
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Calificación
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {instructors.map((instructor) => (
              <tr key={instructor.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{instructor.name}</div>
                      <div className="text-sm text-gray-500">{instructor.bio || 'Sin biografía'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {instructor.email || 'No proporcionado'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {instructor.phone || 'No proporcionado'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {instructor.rating ? (
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1 text-sm text-gray-600">{instructor.rating}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">Sin calificación</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEditInstructor(instructor)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteInstructor(instructor.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {instructors.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay instructores</h3>
            <p className="mt-1 text-sm text-gray-500">
              Comienza registrando tu primer instructor.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorManagement;
