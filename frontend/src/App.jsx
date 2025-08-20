// frontend/src/App.jsx (actualizado)
import React, { useEffect } from 'react';
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
import reminderService from './services/reminderService';
import './App.css';

function App() {
  useEffect(() => {
    // Iniciar verificación de recordatorios
    reminderService.startReminderCheck();
    
    // Limpiar al desmontar
    return () => {
      reminderService.stopReminderCheck();
    };
  }, []);

  return (
    <
