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

// Funciones de usuarios
export const usersAPI = {
  getAll: () => api.get('/api/v1/users'),
  getById: (id) => api.get(`/api/v1/users/${id}`),
  getMe: () => api.get('/api/v1/users/me'),
  update: (userData) => api.put('/api/v1/users/me', userData),
};

// Funciones de horarios
export const scheduleAPI = {
  getAll: () => api.get('/api/v1/schedules'),
  getById: (id) => api.get(`/api/v1/schedules/${id}`),
  create: (scheduleData) => api.post('/api/v1/schedules', scheduleData),
  update: (id, scheduleData) => api.put(`/api/v1/schedules/${id}`, scheduleData),
  delete: (id) => api.delete(`/api/v1/schedules/${id}`),
  getByClass: (classId) => api.get(`/api/v1/schedules/class/${classId}`),
};

// Funciones de pagos
export const paymentsAPI = {
  getAll: () => api.get('/api/v1/payments'),
  getById: (id) => api.get(`/api/v1/payments/${id}`),
  create: (paymentData) => api.post('/api/v1/payments', paymentData),
  update: (id, paymentData) => api.put(`/api/v1/payments/${id}`, paymentData),
  delete: (id) => api.delete(`/api/v1/payments/${id}`),
  getRecent: (limit = 10) => api.get(`/api/v1/payments/recent?limit=${limit}`),
  getByUser: (userId) => api.get(`/api/v1/payments/user/${userId}`),
  processPayment: (paymentData) => api.post('/api/v1/payments/process', paymentData),
};

// Funciones de notificaciones masivas
export const bulkNotificationsAPI = {
  sendBulk: (notificationData) => api.post('/api/v1/notifications/bulk', notificationData),
  getRecent: () => api.get('/api/v1/notifications/recent'),
  getAll: () => api.get('/api/v1/notifications'),
  getById: (id) => api.get(`/api/v1/notifications/${id}`),
  delete: (id) => api.delete(`/api/v1/notifications/${id}`),
};


export const notificationsAPI = {
  sendBulk: (notificationData) => api.post('/api/v1/notifications/bulk', notificationData),
  getAll: () => api.get('/api/v1/notifications'),
  getById: (id) => api.get(`/api/v1/notifications/${id}`),
  delete: (id) => api.delete(`/api/v1/notifications/${id}`),
  getRecent: (limit = 10) => api.get(`/api/v1/notifications/recent?limit=${limit}`),
  markAsRead: (id) => api.post(`/api/v1/notifications/${id}/read`),
  markAllAsRead: () => api.post('/api/v1/notifications/read-all'),
};

export const auditAPI = {
  getLogs: (filters) => api.get('/api/v1/audit/logs', { params: filters }),
  getById: (id) => api.get(`/api/v1/audit/logs/${id}`),
  exportLogs: (format) => api.get(`/api/v1/audit/export/${format}`),
  getRecent: (limit = 50) => api.get(`/api/v1/audit/logs/recent?limit=${limit}`),
  search: (query) => api.get(`/api/v1/audit/logs/search?q=${query}`),
  getStats: () => api.get('/api/v1/audit/stats'),
};

export const membershipsAPI = {
  getAll: () => api.get('/api/v1/memberships'),
  getById: (id) => api.get(`/api/v1/memberships/${id}`),
  create: (membershipData) => api.post('/api/v1/memberships', membershipData),
  update: (id, membershipData) => api.put(`/api/v1/memberships/${id}`, membershipData),
  delete: (id) => api.delete(`/api/v1/memberships/${id}`),
  getActive: () => api.get('/api/v1/memberships/active'),
  getByUser: (userId) => api.get(`/api/v1/memberships/user/${userId}`),
  renew: (membershipId) => api.post(`/api/v1/memberships/${membershipId}/renew`),
  cancel: (membershipId) => api.post(`/api/v1/memberships/${membershipId}/cancel`),
  getPlans: () => api.get('/api/v1/memberships/plans'),
  createPlan: (planData) => api.post('/api/v1/memberships/plans', planData),
  updatePlan: (planId, planData) => api.put(`/api/v1/memberships/plans/${planId}`, planData),
  deletePlan: (planId) => api.delete(`/api/v1/memberships/plans/${planId}`),
};

export default api;
