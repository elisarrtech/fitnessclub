// frontend/src/pages/admin/BulkNotifications.jsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { notificationsAPI } from '../../services/api';

const BulkNotifications = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'email',
    recipients: 'all' // all, instructors, admins, specific
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('El título es requerido');
      return;
    }
    
    if (!formData.message.trim()) {
      setError('El mensaje es requerido');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // En producción, aquí conectarías con la API
      await notificationsAPI.sendBulk({
        ...formData,
        sender: user.email
      });
      
      setSuccess('Notificaciones enviadas exitosamente');
      setFormData({
        title: '',
        message: '',
        type: 'email',
        recipients: 'all'
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Error al enviar las notificaciones');
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Notificaciones Masivas</h1>
        <p className="mt-2 text-gray-600">
          Envía notificaciones a múltiples usuarios al mismo tiempo
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Crear Notificación Masiva</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="px-6 py-4">
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
              
              {success && (
                <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              )}
              
              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                  placeholder="Título de la notificación"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Mensaje *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                  placeholder="Escribe el contenido de tu notificación..."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Notificación
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                  >
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="both">Email y SMS</option>
                    <option value="push">Notificación Push</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="recipients" className="block text-sm font-medium text-gray-700 mb-1">
                    Destinatarios
                  </label>
                  <select
                    id="recipients"
                    name="recipients"
                    value={formData.recipients}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                  >
                    <option value="all">Todos los usuarios</option>
                    <option value="instructors">Solo instructores</option>
                    <option value="admins">Solo administradores</option>
                    <option value="specific">Usuarios específicos</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end">
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
                      Enviando...
                    </>
                  ) : (
                    'Enviar Notificaciones'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Plantillas Rápidas</h3>
            <div className="space-y-3">
              <button 
                onClick={() => setFormData({
                  ...formData,
                  title: '¡Nueva clase disponible!',
                  message: 'Hola, tenemos una nueva clase disponible en nuestro horario. ¡Reserva tu lugar ahora!'
                })}
                className="w-full text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
              >
                <div className="font-medium">Nueva clase</div>
                <div className="text-gray-600">Plantilla para anunciar nuevas clases</div>
              </button>
              
              <button 
                onClick={() => setFormData({
                  ...formData,
                  title: 'Recordatorio de clase',
                  message: 'Te recordamos que tienes una clase programada para hoy. ¡No llegues tarde!'
                })}
                className="w-full text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
              >
                <div className="font-medium">Recordatorio</div>
                <div className="text-gray-600">Recordatorio automático de clases</div>
              </button>
              
              <button 
                onClick={() => setFormData({
                  ...formData,
                  title: 'Mantenimiento programado',
                  message: 'Nuestro sistema estará en mantenimiento el próximo fin de semana. Disculpa las molestias.'
                })}
                className="w-full text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
              >
                <div className="font-medium">Mantenimiento</div>
                <div className="text-gray-600">Aviso de mantenimiento del sistema</div>
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Estadísticas Recientes</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Emails enviados hoy</span>
                  <span className="font-medium">1,247</span>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">SMS enviados hoy</span>
                  <span className="font-medium">89</span>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '12%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tasa de entrega</span>
                  <span className="font-medium">98.5%</span>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '98.5%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkNotifications;
