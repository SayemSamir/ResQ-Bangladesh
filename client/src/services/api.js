import axios from 'axios';


const API = axios.create({
    baseURL: 'http://127.0.0.1:8000',
});


export const registerUser = (userData) => API.post('/users/register', userData);


export const loginUser = (formData) => API.post('/users/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
});

export const createReport = (reportData, token) => API.post('/emergency/report', reportData, {
    headers: { Authorization: `Bearer ${token}` }
});


export const getAllReports = () => API.get('/emergency/all');

export default API;