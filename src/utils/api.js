import axios from 'axios';

const API_BASE_URL = 'https://mediconnect-backend-production-bb1c.up.railway.app';

const api = axios.create({
  baseURL: API_BASE_URL,
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
});

export const clinicSignup  = (data) => api.post('/api/clinic/signup', data);
export const clinicLogin   = (data) => api.post('/api/clinic/login', data);
export const patientSignup = (data) => api.post('/api/patient/signup', data);
export const patientLogin  = (data) => api.post('/api/patient/login', data);

export const getAppointments   = ()          => api.get('/api/appointments');
export const createAppointment = (data)      => api.post('/api/appointments', data);
export const updateAppointment = (id, data)  => api.put(`/api/appointments/${id}`, data);
export const deleteAppointment = (id)        => api.delete(`/api/appointments/${id}`);

export const getPatients    = ()   => api.get('/api/patients');
export const getPatientById = (id) => api.get(`/api/patients/${id}`);

export const getPrescriptions   = ()     => api.get('/api/prescriptions');
export const createPrescription = (data) => api.post('/api/prescriptions', data);

export const getFeedback    = ()     => api.get('/api/feedback');
export const submitFeedback = (data) => api.post('/api/feedback', data);

export default api;