// frontend/src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Bienvenido a Fitness Club
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Tu centro de fitness donde puedes reservar clases, seguir instructores y mantener tu salud en forma.
        </p>
        
        <div className="flex justify-center space-x-4">
          <Link 
            to="/classes" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
          >
            Ver Clases
          </Link>
          <Link 
            to="/register" 
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
          >
            Registrarse
          </Link>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 mt-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">Variedad de Clases</h3>
          <p className="text-gray-600">
            Ofrecemos una amplia gama de clases para todos los niveles y preferencias.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">Instructores Expertos</h3>
          <p className="text-gray-600">
            Nuestros instructores certificados te guiarán en cada paso de tu entrenamiento.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">Reservas Fáciles</h3>
          <p className="text-gray-600">
            Reserva tus clases favoritas en línea con solo unos clics.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
