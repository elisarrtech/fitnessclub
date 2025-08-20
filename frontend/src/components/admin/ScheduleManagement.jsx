// frontend/src/pages/admin/ScheduleManagement.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { scheduleAPI, classesAPI, instructorsAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ScheduleForm from '../../components/admin/ScheduleForm';

const ScheduleManagement = () => {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [classes, setClasses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Obtener todos los datos en paralelo
      const [schedulesRes, classesRes, instructorsRes] = await Promise.all([
        scheduleAPI.getAll(),
        classesAPI.getAll(),
        instructorsAPI.getAll()
      ]);
      
      setSchedules(schedulesRes.data);
      setClasses(classesRes.data);
      setInstructors(instructorsRes.data);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchedule = () => {
    setEditingSchedule(null);
    setShowForm(true);
  };

  const handleEditSchedule = (scheduleData) => {
    setEditingSchedule(scheduleData);
    setShowForm(true);
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este horario?')) {
      return;
    }

    try {
      await scheduleAPI.delete(scheduleId);
      setSchedules(schedules.filter(s => s.id !== scheduleId));
      alert('Horario eliminado exitosamente');
    } catch (err) {
      alert('Error al eliminar el horario');
    }
  };

  const handleFormSuccess = (scheduleData) => {
    setShowForm(false);
    setEditingSchedule(null);
    
    if (editingSchedule) {
      setSchedules(schedules.map(s => s.id === scheduleData.id ? scheduleData : s));
    } else {
      setSchedules([...schedules, scheduleData]);
    }
    
    alert(editingSchedule ? 'Horario actualizado exitosamente' : 'Horario creado exitosamente');
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
          <ScheduleForm
            initialData={editingSchedule}
            classes={classes}
            instructors={instructors}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false);
              setEditingSchedule(null);
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
            onClick={fetchData}
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
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Horarios</h1>
          <p className="mt-2 text-gray-600">
            Administra los horarios de todas las clases
          </p>
        </div>
        <button
          onClick={handleCreateSchedule}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Nuevo Horario
        </button>
      </div>

      {/* Calendario de horarios */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Clase
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Instructor
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha y Hora
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sala
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Disponibilidad
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {schedules.map((schedule) => {
              const classData = classes.find(c => c.id === schedule.class_id);
              const instructorData = instructors.find(i => i.id === schedule.instructor_id);
              
              return (
                <tr key={schedule.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {classData?.title || 'Clase no encontrada'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {classData?.level}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {instructorData?.name || 'Sin asignar'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(schedule.start_ts).toLocaleDateString('es-ES', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(schedule.start_ts).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })} - {new Date(schedule.end_ts).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {schedule.room || 'No asignada'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {schedule.current_bookings || 0} / {classData?.capacity || 0}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          ((schedule.current_bookings || 0) / (classData?.capacity || 1)) > 0.8 
                            ? 'bg-red-600' 
                            : ((schedule.current_bookings || 0) / (classData?.capacity || 1)) > 0.5 
                              ? 'bg-yellow-500' 
                              : 'bg-green-500'
                        }`}
                        style={{ 
                          width: `${Math.min(100, ((schedule.current_bookings || 0) / (classData?.capacity || 1)) * 100)}%` 
                        }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditSchedule(schedule)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteSchedule(schedule.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {schedules.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay horarios</h3>
            <p className="mt-1 text-sm text-gray-500">
              Comienza creando tu primer horario.
            </p>
            <div className="mt-6">
              <button
                onClick={handleCreateSchedule}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Crear Horario
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleManagement;
