// frontend/src/services/api.js (actualizado)
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
  // Nueva función para lista de espera
  joinWaitlist: (waitlistData) => api.post('/api/v1/bookings/waitlist', waitlistData),
  getWaitlist: (scheduleId) => api.get(`/api/v1/bookings/waitlist/${scheduleId}`),
};

// Funciones de instructores
export const instructorsAPI = {
  getAll: () => api.get('/api/v1/instructors'),
  getById: (id) => api.get(`/api/v1/instructors/${id}`),
};

// Agregar al final de api.js
export const scheduleAPI = {
  getAll: () => api.get('/api/v1/schedules'),
  getById: (id) => api.get(`/api/v1/schedules/${id}`),
  create: (scheduleData) => api.post('/api/v1/schedules', scheduleData),
  update: (id, scheduleData) => api.put(`/api/v1/schedules/${id}`, scheduleData),
  delete: (id) => api.delete(`/api/v1/schedules/${id}`),
  getByClass: (classId) => api.get(`/api/v1/schedules/class/${classId}`),
};

export const usersAPI = {
  getAll: () => api.get('/api/v1/users'),
  getById: (id) => api.get(`/api/v1/users/${id}`),
  getMe: () => api.get('/api/v1/users/me'),
  update: (userData) => api.put('/api/v1/users/me', userData),
};

export default api;

