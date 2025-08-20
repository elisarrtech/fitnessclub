// frontend/src/pages/admin/AuditLog.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { auditAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ReportGenerator from '../../components/admin/reports/ReportGenerator';

const AuditLog = () => {
  const { user } = useAuth();
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({
    action: 'all',
    user: 'all',
    dateRange: 'week'
  });

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      fetchAuditLogs();
    }
  }, [user, filter]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const response = await auditAPI.getLogs(filter);
      setAuditLogs(response.data);
    } catch (err) {
      setError('Error al cargar el registro de auditoría');
      console.error('Error fetching audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
            onClick={fetchAuditLogs}
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
          <h1 className="text-3xl font-bold text-gray-900">Registro de Auditoría</h1>
          <p className="mt-2 text-gray-600">
            Historial completo de acciones administrativas
          </p>
        </div>
        <ReportGenerator 
          data={auditLogs} 
          reportType="audit" 
          title="Registro de Auditoría" 
        />
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="action" className="block text-sm font-medium text-gray-700 mb-1">
              Acción
            </label>
            <select
              id="action"
              value={filter.action}
              onChange={(e) => setFilter({...filter, action: e.target.value})}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
            >
              <option value="all">Todas las acciones</option>
              <option value="CREATE">Creación</option>
              <option value="UPDATE">Actualización</option>
              <option value="DELETE">Eliminación</option>
              <option value="LOGIN">Inicio de sesión</option>
              <option value="LOGOUT">Cierre de sesión</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="user" className="block text-sm font-medium text-gray-700 mb-1">
              Usuario
            </label>
            <select
              id="user"
              value={filter.user}
              onChange={(e) => setFilter({...filter, user: e.target.value})}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
            >
              <option value="all">Todos los usuarios</option>
              <option value="admin">Solo administradores</option>
              <option value="instructor">Solo instructores</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 mb-1">
              Rango de fechas
            </label>
            <select
              id="dateRange"
              value={filter.dateRange}
              onChange={(e) => setFilter({...filter, dateRange: e.target.value})}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
            >
              <option value="today">Hoy</option>
              <option value="week">Esta semana</option>
              <option value="month">Este mes</option>
              <option value="year">Este año</option>
              <option value="all">Todo el historial</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={fetchAuditLogs}
              className="w-full inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
              Filtrar
            </button>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900">Total de Acciones</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">{auditLogs.length}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900">Creaciones</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {auditLogs.filter(log => log.action === 'CREATE').length}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900">Actualizaciones</h3>
          <p className="mt-2 text-3xl font-bold text-yellow-600">
            {auditLogs.filter(log => log.action === 'UPDATE').length}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900">Eliminaciones</h3>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {auditLogs.filter(log => log.action === 'DELETE').length}
          </p>
        </div>
      </div>

      {/* Tabla de registros */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha y Hora
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acción
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Entidad
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Detalles
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                IP
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(log.timestamp)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{log.user?.name || 'Usuario desconocido'}</div>
                  <div className="text-sm text-gray-500">{log.user?.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    log.action === 'CREATE' ? 'bg-green-100 text-green-800' :
                    log.action === 'UPDATE' ? 'bg-yellow-100 text-yellow-800' :
                    log.action === 'DELETE' ? 'bg-red-100 text-red-800' :
                    log.action === 'LOGIN' ? 'bg-blue-100 text-blue-800' :
                    log.action === 'LOGOUT' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {log.action === 'CREATE' && 'Creación'}
                    {log.action === 'UPDATE' && 'Actualización'}
                    {log.action === 'DELETE' && 'Eliminación'}
                    {log.action === 'LOGIN' && 'Inicio Sesión'}
                    {log.action === 'LOGOUT' && 'Cierre Sesión'}
                    {!['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'].includes(log.action) && log.action}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {log.entity_type}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                  <div className="truncate" title={log.details}>
                    {log.details}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {log.ip_address}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {auditLogs.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay registros de auditoría</h3>
            <p className="mt-1 text-sm text-gray-500">
              No se encontraron acciones con los filtros seleccionados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLog;
