import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const registerUser = (userData) =>
  API.post('/users/register', {
    full_name: userData.fullName,
    email: userData.email,
    phone: userData.phone,
    password: userData.password,
    role: userData.role || 'user',
  });

export const loginUser = (credentials) => API.post('/users/login', credentials);

export const createEmergencyReport = (reportData) =>
  API.post('/emergency/report', {
    title: reportData.title,
    disaster_type: reportData.disasterType,
    location_address: reportData.locationAddress,
    description: reportData.description,
  });

export const getEmergencyReports = () => API.get('/emergency/all');

export const updateReportStatus = (emergencyId, status) =>
  API.patch(`/emergency/${emergencyId}/status`, { status });

export const createReport = (reportData) => API.post('/reports', reportData);

export const getReports = () => API.get('/reports');

export default API;