// frontend/src/App.jsx (fragmento actualizado)
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
import ClassManagement from './pages/admin/ClassManagement';
import InstructorManagement from './pages/admin/InstructorManagement';
import UserManagement from './pages/admin/UserManagement';
import ScheduleManagement from './pages/admin/ScheduleManagement';
import PaymentsManagement from './pages/admin/PaymentsManagement';
import BulkNotifications from './pages/admin/BulkNotifications';
import AuditLog from './pages/admin/AuditLog';
import MembershipsManagement from './pages/admin/MembershipsManagement';
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
              <Route 
                path="/admin/classes" 
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <ClassManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/instructors" 
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <InstructorManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <UserManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/schedules" 
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <ScheduleManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/payments" 
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <PaymentsManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/notifications" 
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <BulkNotifications />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/audit" 
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <AuditLog />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/memberships" 
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <MembershipsManagement />
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
