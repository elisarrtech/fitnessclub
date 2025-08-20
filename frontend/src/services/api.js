// frontend/src/services/api.js
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Funciones de autenticación
export const authAPI = {
  login: (credentials) => api.post('/api/v1/auth/login', credentials),
  register: (userData) => api.post('/api/v1/auth/register', userData),
};

// Funciones de clases
export const classesAPI = {
  getAll: () => api.get('/api/v1/classes'),
  getWithSchedules: () => api.get('/api/v1/classes/with-schedules'),
  getById: (id) => api.get(`/api/v1/classes/${id}`),
};

// Funciones de reservas
export const bookingsAPI = {
  create: (bookingData) => api.post('/api/v1/bookings', bookingData),
  getMyBookings: () => api.get('/api/v1/bookings/my-bookings'),
  cancel: (bookingId) => api.post(`/api/v1/bookings/${bookingId}/cancel`),
  getBySchedule: (scheduleId) => api.get(`/api/v1/bookings/schedule/${scheduleId}`),
};

// Funciones de instructores
export const instructorsAPI = {
  getAll: () => api.get('/api/v1/instructors'),
  getById: (id) => api.get(`/api/v1/instructors/${id}`),
};

export default api;
