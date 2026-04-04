import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import { ClinicLogin, ClinicSignup, PatientLogin, PatientSignup } from './pages/Auth';
import ClinicDashboard from './pages/ClinicDashboard';
import PatientDashboard from './pages/PatientDashboard';

// Protected route for clinic
function ClinicRoute({ children }) {
  const { user, role, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#8b9fc7' }}>Loading...</div>;
  if (!user || role !== 'clinic') return <Navigate to="/clinic/login" />;
  return children;
}

// Protected route for patient
function PatientRoute({ children }) {
  const { user, role, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#8b9fc7' }}>Loading...</div>;
  if (!user || role !== 'patient') return <Navigate to="/patient/login" />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/clinic/login" element={<ClinicLogin />} />
      <Route path="/clinic/signup" element={<ClinicSignup />} />
      <Route path="/patient/login" element={<PatientLogin />} />
      <Route path="/patient/signup" element={<PatientSignup />} />
      <Route path="/clinic/dashboard" element={<ClinicRoute><ClinicDashboard /></ClinicRoute>} />
      <Route path="/patient/dashboard" element={<PatientRoute><PatientDashboard /></PatientRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
