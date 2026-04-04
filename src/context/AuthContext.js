import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'clinic' or 'patient'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on app start
    const savedUser = localStorage.getItem('user');
    const savedRole = localStorage.getItem('role');
    const savedToken = localStorage.getItem('token');

    if (savedUser && savedRole && savedToken) {
      setUser(JSON.parse(savedUser));
      setRole(savedRole);
    }
    setLoading(false);
  }, []);

  const loginClinic = (clinicData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(clinicData));
    localStorage.setItem('role', 'clinic');
    setUser(clinicData);
    setRole('clinic');
  };

  const loginPatient = (patientData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(patientData));
    localStorage.setItem('role', 'patient');
    setUser(patientData);
    setRole('patient');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, loginClinic, loginPatient, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
