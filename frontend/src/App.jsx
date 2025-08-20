// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Header from './components/common/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Instructors from './pages/Instructors';
import Classes from './pages/Classes';
import ClassDetail from './pages/ClassDetail';
import Schedule from './pages/Schedule';
import MyBookings from './pages/MyBookings';
import InstructorRegister from './pages/InstructorRegister';
import AdminRegister from './pages/AdminRegister';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/instructor-register" element={<InstructorRegister />} />
              <Route path="/admin-register" element={<AdminRegister />} />
              
              {/* Rutas protegidas para usuarios autenticados */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route path="/instructors" element={<Instructors />} />
              <Route path="/classes" element={<Classes />} />
              <Route path="/classes/:id" element={<ClassDetail />} />
              <Route path="/schedule" element={<Schedule />} />
              
              {/* Rutas protegidas para usuarios con reservas */}
              <Route 
                path="/my-bookings" 
                element={
                  <ProtectedRoute>
                    <MyBookings />
                  </ProtectedRoute>
                } 
              />
              
              {/* Rutas protegidas solo para administradores */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
