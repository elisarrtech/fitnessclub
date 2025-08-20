// frontend/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { classesAPI, bookingsAPI, usersAPI, instructorsAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    classes: 0,
    instructors: 0,
    bookings: 0,
    revenue: 0,
    occupancy: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('week'); // week, month, year

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      fetchDashboardStats();
    }
  }, [user, timeRange]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // En producción, aquí harías llamadas reales a la API
      // Por ahora, simulamos datos
      
      // Simular datos de ejemplo
      setTimeout(() => {
        setStats({
          users: 150,
          classes: 24,
          instructors: 8,
          bookings: 32,
          revenue: 2450,
          occupancy: 78
        });
        setLoading(false);
      }, 1000);
      
      /*
      // En producción, usarías estas llamadas reales:
      const [usersRes, classesRes, instructorsRes, bookingsRes] = await Promise.all([
        usersAPI.getAll(),
        classesAPI.getAll(),
        instructorsAPI.getAll(),
        bookingsAPI.getRecentBookings(timeRange)
      ]);
      
      setStats({
        users: usersRes.data.length,
        classes: classesRes.data.length,
        instructors: instructorsRes.data.length,
        bookings: bookingsRes.data.length,
        revenue: calculateRevenue(bookingsRes.data),
        occupancy: calculateOccupancy(bookingsRes.data)
      });
      */
    } catch (err) {
      setError('Error al cargar las estadísticas');
      console.error('Error fetching dashboard stats:', err);
      setLoading(false);
    }
  };

  const calculateRevenue = (bookings) => {
    return bookings.reduce((total, booking) => {
      return total + (booking.class?.base_price || 0);
    }, 0) / 100; // Convertir de centavos a dólares
  };

  const calculateOccupancy = (bookings) => {
    if (bookings.length === 0) return 0;
    const totalCapacity = bookings.reduce((total, booking) => {
      return total + (booking.schedule?.class?.capacity || 0);
    }, 0);
    return totalCapacity > 0 ? Math.round((bookings.length / totalCapacity) * 100) : 0;
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

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
          <button
            onClick={fetchDashboardStats}
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
        <p className="mt-2 text-gray-600">
          Bienvenido, {user.name}. Gestiona tu centro fitness desde aquí.
        </p>
      </div>

      {/* Selector de rango de tiempo */}
      <div className="mb-6">
        <div className="flex space-x-2">
          {['day', 'week', 'month', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {range === 'day' && 'Hoy'}
              {range === 'week' && 'Esta Semana'}
              {range === 'month' && 'Este Mes'}
              {range === 'year' && 'Este Año'}
            </button>
          ))}
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
          title="Reservas Hoy"
          value={stats.bookings}
          icon="📅"
          color="bg-yellow-500"
        />
        <StatCard
          title="Ingresos"
          value={`$${stats.revenue.toFixed(2)}`}
          icon="💰"
          color="bg-red-500"
        />
        <StatCard
          title="Ocupación"
          value={`${stats.occupancy}%`}
          icon="📊"
          color="bg-indigo-500"
        />
      </div>

      {/* Gráficos y reportes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Reservas por Día</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Gráfico de reservas por día - Implementar con Chart.js o similar</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Clases Populares</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Gráfico de clases más populares - Implementar con Chart.js o similar</p>
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            title="Crear Clase"
            description="Agregar nueva clase al catálogo"
            icon="➕"
            onClick={() => alert('Funcionalidad de crear clase - Implementar en próxima iteración')}
          />
          <QuickActionCard
            title="Agregar Instructor"
            description="Registrar nuevo instructor en el sistema"
            icon="👨‍🏫"
            onClick={() => alert('Funcionalidad de agregar instructor - Implementar en próxima iteración')}
          />
          <QuickActionCard
            title="Ver Reportes"
            description="Generar reportes detallados del sistema"
            icon="📋"
            onClick={() => alert('Funcionalidad de ver reportes - Implementar en próxima iteración')}
          />
          <QuickActionCard
            title="Gestionar Usuarios"
            description="Administrar cuentas de usuarios"
            icon="👥"
            onClick={() => alert('Funcionalidad de gestionar usuarios - Implementar en próxima iteración')}
          />
        </div>
      </div>
    </div>
  );
};

// Componente para tarjetas de estadísticas
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
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

// Componente para acciones rápidas
const QuickActionCard = ({ title, description, icon, onClick }) => (
  <div 
    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-200 hover:border-blue-300"
    onClick={onClick}
  >
    <div className="flex items-center">
      <div className="bg-blue-100 rounded-full p-3 text-blue-600 text-xl">
        {icon}
      </div>
      <div className="ml-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
    </div>
  </div>
);

export default Dashboard;
