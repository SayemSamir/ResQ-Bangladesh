import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// সঠিক পাথে API কলগুলো ডিফাইন করা
export const registerUser = (userData) => api.post('/users/register', userData);
export const loginUser = (credentials) => api.post('/users/login', credentials);
export const createReport = (reportData) => api.post('/reports', reportData);
export const getReports = () => api.get('/reports');
export const deleteReport = (id) => api.delete(`/reports/${id}`);
export const updateReportStatus = (id, status) => 
  api.patch(`/reports/${id}/status`, { status });
  