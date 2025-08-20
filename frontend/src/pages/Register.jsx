// frontend/src/pages/Register.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import InstructorRegisterForm from '../components/auth/InstructorRegisterForm';
import AdminRegisterForm from '../components/auth/AdminRegisterForm';

const Register = () => {
  const [userType, setUserType] = useState('user'); // 'user', 'instructor', 'admin'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Selecciona el tipo de cuenta que deseas crear
          </p>
        </div>

        {/* Selector de tipo de usuario */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setUserType('user')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              userType === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Usuario
          </button>
          <button
            onClick={() => setUserType('instructor')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              userType === 'instructor'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Instructor
          </button>
          <button
            onClick={() => setUserType('admin')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              userType === 'admin'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Administrador
          </button>
        </div>

        {/* Formularios según el tipo de usuario */}
        <div className="mt-8">
          {userType === 'user' && <RegisterForm />}
          {userType === 'instructor' && <InstructorRegisterForm />}
          {userType === 'admin' && <AdminRegisterForm />}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
