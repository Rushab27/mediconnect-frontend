import axios from 'axios';

const api = axios.create({
  baseURL: 'https://mediconnect-backend-production-bb1c.up.railway.app',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const clinicSignup            = (data)      => api.post('/api/clinic/signup', data);
export const clinicLogin             = (data)      => api.post('/api/clinic/login', data);
export const patientSignup           = (data)      => api.post('/api/patient/signup', data);
export const patientLogin            = (data)      => api.post('/api/patient/login', data);
export const getDashboardStats       = ()          => api.get('/api/clinic/dashboard');
export const getMonthlyAnalytics     = ()          => api.get('/api/clinic/analytics/monthly');
export const getTodaysAppointments   = ()          => api.get('/api/clinic/appointments/today');
export const getClinicAppointments   = ()          => api.get('/api/clinic/appointments');
export const updateAppointmentStatus = (id, data)  => api.put(`/api/clinic/appointments/${id}/status`, data);
export const getAppointments         = ()          => api.get('/api/appointments');
export const createAppointment       = (data)      => api.post('/api/appointments', data);
export const updateAppointment       = (id, data)  => api.put(`/api/appointments/${id}`, data);
export const deleteAppointment       = (id)        => api.delete(`/api/appointments/${id}`);
export const getPatients             = ()          => api.get('/api/patients');
export const getPatientById          = (id)        => api.get(`/api/patients/${id}`);
export const getPrescriptions        = ()          => api.get('/api/prescriptions');
export const createPrescription      = (data)      => api.post('/api/prescriptions', data);
export const getDoctors              = ()          => api.get('/api/doctors');
export const addDoctor               = (data)      => api.post('/api/doctors', data);

export default api;