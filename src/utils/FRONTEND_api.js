import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://mediconnect-backend-production-bb1c.up.railway.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to every request if logged in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Auth APIs ───────────────────────────

// Clinic
export const clinicSignup = (data) => api.post('/api/auth/clinic/signup', data);
export const clinicLogin  = (data) => api.post('/api/auth/clinic/login', data);

// Patient
export const patientSignup = (data) => api.post('/api/auth/patient/signup', data);
export const patientLogin  = (data) => api.post('/api/auth/patient/login', data);

export default api;
