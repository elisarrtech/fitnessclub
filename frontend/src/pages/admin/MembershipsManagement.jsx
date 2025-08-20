// frontend/src/pages/admin/MembershipsManagement.jsx
import React, { useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { membershipsAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import MembershipForm from '../../components/admin/MembershipForm';

const MembershipsManagement = () => {
  const { user } = useContext(AuthContext);
  const [memberships, setMemberships] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Obtener todos los datos en paralelo
      const [membershipsRes, plansRes] = await Promise.all([
        membershipsAPI.getAll(),
        membershipsAPI.getPlans()
      ]);
      
      setMemberships(membershipsRes.data);
      setPlans(plansRes.data);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = () => {
    setEditingPlan(null);
    setShowForm(true);
  };

  const handleEditPlan = (planData) => {
    setEditingPlan(planData);
    setShowForm(true);
  };

  const handleDeletePlan = async (planId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este plan de membresía?')) {
      return;
    }

    try {
      await membershipsAPI.deletePlan(planId);
      setPlans(plans.filter(p => p.id !== planId));
      alert('Plan eliminado exitosamente');
    } catch (err) {
      alert('Error al eliminar el plan');
    }
  };

  const handleFormSuccess = (planData) => {
    setShowForm(false);
    setEditingPlan(null);
    
    if (editingPlan) {
      setPlans(plans.map(p => p.id === planData.id ? planData : p));
    } else {
      setPlans([...plans, planData]);
    }
    
    alert(editingPlan ? 'Plan actualizado exitosamente' : 'Plan creado exitosamente');
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
          <MembershipForm
            initialData={editingPlan}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false);
              setEditingPlan(null);
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
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Membresías</h1>
          <p className="mt-2 text-gray-600">
            Administra planes de membresía y suscripciones
          </p>
        </div>
        <button
          onClick={handleCreatePlan}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Nuevo Plan
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900">Total Membresías</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">{memberships.length}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900">Planes Activos</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {plans.filter(p => p.active).length}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900">Ingresos Mensuales</h3>
          <p className="mt-2 text-3xl font-bold text-purple-600">
            ${memberships
              .filter(m => m.status === 'active')
              .reduce((sum, m) => sum + (m.plan?.price_monthly || 0), 0)
              .toFixed(2)}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900">Renovaciones</h3>
          <p className="mt-2 text-3xl font-bold text-yellow-600">
            {memberships.filter(m => m.renewal_date && new Date(m.renewal_date) > new Date()).length}
          </p>
        </div>
      </div>

      {/* Planes de membresía */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Planes de Membresía</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
                  </div>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    plan.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {plan.active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                
                <div className="mt-6">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-extrabold text-gray-900">
                      ${(plan.price_monthly / 100).toFixed(2)}
                    </span>
                    <span className="ml-1 text-xl font-medium text-gray-500">/mes</span>
                  </div>
                  {plan.price_yearly > 0 && (
                    <div className="mt-1 text-sm text-gray-500">
                      ${(plan.price_yearly / 100).toFixed(2)} anual (${((plan.price_yearly / 12) / 100).toFixed(2)}/mes)
                    </div>
                  )}
                </div>
                
                <ul className="mt-6 space-y-3">
                  {plan.features && plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-3 text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8 flex justify-between">
                  <button
                    onClick={() => handleEditPlan(plan)}
                    className="text-blue-600 hover:text-blue-900 font-medium"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeletePlan(plan.id)}
                    className="text-red-600 hover:text-red-900 font-medium"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {plans.length === 0 && (
            <div className="col-span-full text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay planes de membresía</h3>
              <p className="mt-1 text-sm text-gray-500">
                Comienza creando tu primer plan de membresía.
              </p>
              <div className="mt-6">
                <button
                  onClick={handleCreatePlan}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Crear Plan
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Membresías activas */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Membresías Activas</h2>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de Inicio
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Renovación
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {memberships.filter(m => m.status === 'active').map((membership) => (
                <tr key={membership.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{membership.user?.name || 'Usuario desconocido'}</div>
                    <div className="text-sm text-gray-500">{membership.user?.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {membership.plan?.name || 'Plan desconocido'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${(membership.plan?.price_monthly / 100).toFixed(2)}/mes
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(membership.start_date).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {membership.renewal_date ? new Date(membership.renewal_date).toLocaleDateString('es-ES') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Activa
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {memberships.filter(m => m.status === 'active').length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay membresías activas</h3>
              <p className="mt-1 text-sm text-gray-500">
                Los usuarios aún no se han suscrito a ningún plan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MembershipsManagement;
