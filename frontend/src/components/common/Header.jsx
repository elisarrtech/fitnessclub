// frontend/src/components/common/Header.jsx (fragmento actualizado)
import React from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            Fitness Club
          </Link>
          
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link to="/" className="hover:text-blue-200">Inicio</Link>
              </li>
              <li>
                <Link to="/classes" className="hover:text-blue-200">Clases</Link>
              </li>
              <li>
                <Link to="/instructors" className="hover:text-blue-200">Instructores</Link>
              </li>
              
              {isAuthenticated ? (
                <>
                  <li>
                    <Link to="/schedule" className="hover:text-blue-200">Horarios</Link>
                  </li>
                  <li>
                    <Link to="/my-bookings" className="hover:text-blue-200">Mis Reservas</Link>
                  </li>
                  <li>
                    <Link to="/profile" className="hover:text-blue-200">Perfil</Link>
                  </li>
                  {user?.role === 'ADMIN' && (
                    <li className="relative group">
                      <button className="hover:text-blue-200">
                        Administración
                      </button>
                      <ul className="absolute hidden group-hover:block bg-white text-gray-800 rounded-md shadow-lg py-2 mt-1 w-48 z-50">
                        <li>
                          <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">
                            Dashboard
                          </Link>
                        </li>
                        <li>
                          <Link to="/admin/classes" className="block px-4 py-2 hover:bg-gray-100">
                            Gestionar Clases
                          </Link>
                        </li>
                        <li>
                          <Link to="/admin/instructors" className="block px-4 py-2 hover:bg-gray-100">
                            Gestionar Instructores
                          </Link>
                        </li>
                        <li>
                          <Link to="/admin/users" className="block px-4 py-2 hover:bg-gray-100">
                            Gestionar Usuarios
                          </Link>
                        </li>
                        <li>
                          <Link to="/admin/schedules" className="block px-4 py-2 hover:bg-gray-100">
                            Gestionar Horarios
                          </Link>
                        </li>
                        <li>
                          <Link to="/admin/payments" className="block px-4 py-2 hover:bg-gray-100">
                            Pagos y Facturación
                          </Link>
                        </li>
                        <li>
                          <Link to="/admin/notifications" className="block px-4 py-2 hover:bg-gray-100">
                            Notificaciones Masivas
                          </Link>
                        </li>
                        <li>
                          <Link to="/admin/audit" className="block px-4 py-2 hover:bg-gray-100">
                            Auditoría
                          </Link>
                        </li>
                        <li>
                          <Link to="/admin/memberships" className="block px-4 py-2 hover:bg-gray-100">
                            Membresías
                          </Link>
                        </li>
                      </ul>
                    </li>
                  )}
                  <li>
                    <button 
                      onClick={logout}
                      className="hover:text-blue-200"
                    >
                      Salir
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="hover:text-blue-200">Iniciar Sesión</Link>
                  </li>
                  <li>
                    <Link to="/register" className="hover:text-blue-200">Registrarse</Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
