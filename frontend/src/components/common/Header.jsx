// frontend/src/components/common/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();

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
                    <Link to="/my-bookings" className="hover:text-blue-200">Mis Reservas</Link>
                  </li>
                  <li>
                    <Link to="/profile" className="hover:text-blue-200">Perfil</Link>
                  </li>
                  {user?.role === 'ADMIN' && (
                    <li>
                      <Link to="/dashboard" className="hover:text-blue-200">Dashboard</Link>
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
