// src/pages/admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    classes: 0,
    instructors: 0,
    bookings: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      // Cargar estadísticas reales cuando el backend funcione
      loadStats();
    }
  }, [user]);

  const loadStats = () => {
    try {
      // Datos simulados mientras se resuelve la conexión al backend
      setStats({
        users: 42,
        classes: 18,
        instructors: 4,
        bookings: 127
      });
      setLoading(false);
    } catch (err) {
      setError('Error al cargar las estadísticas');
      setLoading(false);
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Acceso Denegado</h2>
          <p className="text-red-600">
            Solo los administradores pueden acceder a esta sección.
          </p>
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
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
        <p className="mt-2 text-gray-600">
          Bienvenido, {user.name}. Gestiona tu centro fitness.
        </p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Usuarios" 
          value={stats.users} 
          icon="👥" 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Clases" 
          value={stats.classes} 
          icon="🏋️" 
          color="bg-green-500" 
        />
        <StatCard 
          title="Instructores" 
          value={stats.instructors} 
          icon="👨‍🏫" 
          color="bg-purple-500" 
        />
        <StatCard 
          title="Reservas" 
          value={stats.bookings} 
          icon="📅" 
          color="bg-yellow-500" 
        />
      </div>

      {/* Sección de acciones administrativas */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Gestión del Sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ActionCard 
            title="Gestionar Usuarios" 
            description="Ver y administrar todos los usuarios registrados" 
            onClick={() => console.log('Gestionar usuarios')}
          />
          <ActionCard 
            title="Gestionar Clases" 
            description="Crear, editar y eliminar clases disponibles" 
            onClick={() => console.log('Gestionar clases')}
          />
          <ActionCard 
            title="Gestionar Instructores" 
            description="Administrar el equipo de instructores" 
            onClick={() => console.log('Gestionar instructores')}
          />
          <ActionCard 
            title="Ver Reservas" 
            description="Revisar y gestionar las reservas de los usuarios" 
            onClick={() => console.log('Ver reservas')}
          />
          <ActionCard 
            title="Reportes" 
            description="Generar reportes de uso y estadísticas" 
            onClick={() => console.log('Ver reportes')}
          />
          <ActionCard 
            title="Configuración" 
            description="Ajustes generales del sistema" 
            onClick={() => console.log('Configuración')}
          />
        </div>
      </div>
    </div>
  );
};

// Componente para tarjetas de estadísticas
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
    <div className="flex items-center">
      <div className={`${color} rounded-full p-3 text-white text-xl`}>
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

// Componente para acciones administrativas
const ActionCard = ({ title, description, onClick }) => (
  <div 
    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer bg-gray-50 hover:bg-white"
    onClick={onClick}
  >
    <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

export default Dashboard;
