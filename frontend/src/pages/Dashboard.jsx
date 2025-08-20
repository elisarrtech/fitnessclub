// frontend/src/pages/Dashboard.jsx
import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Acceso denegado. Solo administradores pueden acceder a esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
        <p className="mt-2 text-gray-600">
          Bienvenido, {user.name}. Gestiona tu centro fitness desde aquí.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tarjeta de estadísticas */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900">Usuarios</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">150</p>
          <p className="mt-1 text-sm text-gray-500">Registrados</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900">Clases</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">24</p>
          <p className="mt-1 text-sm text-gray-500">Activas</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900">Instructores</h3>
          <p className="mt-2 text-3xl font-bold text-purple-600">8</p>
          <p className="mt-1 text-sm text-gray-500">Certificados</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900">Reservas Hoy</h3>
          <p className="mt-2 text-3xl font-bold text-yellow-600">32</p>
          <p className="mt-1 text-sm text-gray-500">Nuevas</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900">Ingresos</h3>
          <p className="mt-2 text-3xl font-bold text-red-600">$2,450</p>
          <p className="mt-1 text-sm text-gray-500">Este mes</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900">Ocupación</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">78%</p>
          <p className="mt-1 text-sm text-gray-500">Promedio</p>
        </div>
      </div>

      {/* Sección de acciones rápidas */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-300">
            Crear Clase
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md transition duration-300">
            Agregar Instructor
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-md transition duration-300">
            Ver Reportes
          </button>
          <button className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-4 rounded-md transition duration-300">
            Gestionar Usuarios
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
