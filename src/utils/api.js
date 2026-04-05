
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Automatically attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto logout on 401
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      window.location.href = '/';
    }
    return Promise.reject(err);
  }
);

// ── CLINIC AUTH ────────────────────────────
export const clinicSignup = (data) => API.post('//api/auth/clinic/', data);
export const clinicLogin = (data) => API.post('/clinic/login', data);
export const getClinicProfile = () => API.get('/clinic/profile');
export const updateClinicProfile = (data) => API.put('/clinic/profile', data);

// ── PATIENT AUTH ───────────────────────────
export const patientSignup = (data) => API.post('/patient/signup', data);
export const patientLogin = (data) => API.post('/patient/login', data);
export const getPatientProfile = () => API.get('/patient/profile');

// ── DOCTORS ────────────────────────────────
export const getDoctors = () => API.get('/doctors');
export const addDoctor = (data) => API.post('/doctors', data);
export const updateDoctor = (id, data) => API.put(`/doctors/${id}`, data);
export const deleteDoctor = (id) => API.delete(`/doctors/${id}`);
export const getPublicDoctors = (clinicId) => API.get(`/public/clinics/${clinicId}/doctors`);

// ── APPOINTMENTS ───────────────────────────
export const bookAppointment = (data) => API.post('/appointments', data);
export const cancelAppointment = (id) => API.put(`/appointments/${id}/cancel`);
export const getPatientAppointments = () => API.get('/patient/appointments');
export const getClinicAppointments = (params) => API.get('/clinic/appointments', { params });
export const getTodaysAppointments = () => API.get('/clinic/appointments/today');
export const updateAppointmentStatus = (id, data) => API.put(`/clinic/appointments/${id}/status`, data);

// ── ANALYTICS ──────────────────────────────
export const getDashboardStats = () => API.get('/clinic/dashboard');
export const getMonthlyAnalytics = (params) => API.get('/clinic/analytics/monthly', { params });

export default API;
