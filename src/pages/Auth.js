import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { clinicLogin, clinicSignup, patientLogin, patientSignup } from '../utils/api';
import './Auth.css';

// ─── Reusable Auth Shell ──────────────────────────────────────────
function AuthShell({ title, subtitle, children }) {
  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
      </div>
      <div className="auth-card animate-in">
        <Link to="/" className="auth-back">← Back</Link>
        <div className="auth-logo">⚕ MediConnect</div>
        <h1 className="auth-title">{title}</h1>
        <p className="auth-subtitle">{subtitle}</p>
        {children}
      </div>
    </div>
  );
}

// ─── CLINIC LOGIN ─────────────────────────────────────────────────
export function ClinicLogin() {
  const navigate = useNavigate();
  const { loginClinic } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await clinicLogin(form);
      loginClinic(res.data.clinic, res.data.token);
      navigate('/clinic/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <AuthShell title="Clinic Login" subtitle="Access your clinic dashboard">
      {error && <div className="alert alert-error">⚠ {error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" placeholder="clinic@example.com"
            value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="••••••••"
            value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
        </div>
        <button className="btn btn-primary auth-btn" type="submit" disabled={loading}>
          {loading ? <><span className="spinner" /> Logging in...</> : 'Login to Dashboard'}
        </button>
      </form>
      <p className="auth-switch">
        Don't have an account? <Link to="/clinic/signup">Register your clinic</Link>
      </p>
    </AuthShell>
  );
}

// ─── CLINIC SIGNUP ────────────────────────────────────────────────
export function ClinicSignup() {
  const navigate = useNavigate();
  const { loginClinic } = useAuth();
  const [form, setForm] = useState({
    clinic_name: '', email: '', password: '', phone: '',
    address: '', city: '', specialization: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await clinicSignup(form);
      loginClinic(res.data.clinic, res.data.token);
      navigate('/clinic/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <AuthShell title="Register Clinic" subtitle="Set up your clinic in minutes">
      {error && <div className="alert alert-error">⚠ {error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Clinic Name *</label>
            <input className="form-input" placeholder="City Care Clinic" value={form.clinic_name} onChange={set('clinic_name')} required />
          </div>
          <div className="form-group">
            <label className="form-label">Specialization</label>
            <input className="form-input" placeholder="General, Dental, Eye..." value={form.specialization} onChange={set('specialization')} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Email *</label>
          <input className="form-input" type="email" placeholder="clinic@example.com" value={form.email} onChange={set('email')} required />
        </div>
        <div className="form-group">
          <label className="form-label">Password *</label>
          <input className="form-input" type="password" placeholder="Min 6 characters" value={form.password} onChange={set('password')} required />
        </div>
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Phone *</label>
            <input className="form-input" placeholder="9876543210" value={form.phone} onChange={set('phone')} required />
          </div>
          <div className="form-group">
            <label className="form-label">City *</label>
            <input className="form-input" placeholder="Mumbai" value={form.city} onChange={set('city')} required />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Address *</label>
          <input className="form-input" placeholder="123, Main Street, Area" value={form.address} onChange={set('address')} required />
        </div>
        <button className="btn btn-primary auth-btn" type="submit" disabled={loading}>
          {loading ? <><span className="spinner" /> Creating account...</> : 'Register Clinic'}
        </button>
      </form>
      <p className="auth-switch">
        Already registered? <Link to="/clinic/login">Login</Link>
      </p>
    </AuthShell>
  );
}

// ─── PATIENT LOGIN ────────────────────────────────────────────────
export function PatientLogin() {
  const navigate = useNavigate();
  const { loginPatient } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await patientLogin(form);
      loginPatient(res.data.patient, res.data.token);
      navigate('/patient/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <AuthShell title="Patient Login" subtitle="Access your health dashboard">
      {error && <div className="alert alert-error">⚠ {error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" placeholder="patient@example.com"
            value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="••••••••"
            value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
        </div>
        <button className="btn btn-primary auth-btn" type="submit" disabled={loading}>
          {loading ? <><span className="spinner" /> Logging in...</> : 'Login'}
        </button>
      </form>
      <p className="auth-switch">
        New patient? <Link to="/patient/signup">Register here</Link>
      </p>
    </AuthShell>
  );
}

// ─── PATIENT SIGNUP ───────────────────────────────────────────────
export function PatientSignup() {
  const navigate = useNavigate();
  const { loginPatient } = useAuth();
  const [form, setForm] = useState({
    full_name: '', email: '', password: '', phone: '',
    date_of_birth: '', gender: '', blood_group: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await patientSignup(form);
      loginPatient(res.data.patient, res.data.token);
      navigate('/patient/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally { setLoading(false); }
  };

  return (
    <AuthShell title="Patient Registration" subtitle="Create your health profile">
      {error && <div className="alert alert-error">⚠ {error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input className="form-input" placeholder="Rahul Sharma" value={form.full_name} onChange={set('full_name')} required />
        </div>
        <div className="form-group">
          <label className="form-label">Email *</label>
          <input className="form-input" type="email" placeholder="patient@example.com" value={form.email} onChange={set('email')} required />
        </div>
        <div className="form-group">
          <label className="form-label">Password *</label>
          <input className="form-input" type="password" placeholder="Min 6 characters" value={form.password} onChange={set('password')} required />
        </div>
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Phone *</label>
            <input className="form-input" placeholder="9876543210" value={form.phone} onChange={set('phone')} required />
          </div>
          <div className="form-group">
            <label className="form-label">Date of Birth</label>
            <input className="form-input" type="date" value={form.date_of_birth} onChange={set('date_of_birth')} />
          </div>
        </div>
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Gender</label>
            <select className="form-input" value={form.gender} onChange={set('gender')}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Blood Group</label>
            <select className="form-input" value={form.blood_group} onChange={set('blood_group')}>
              <option value="">Select</option>
              {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        </div>
        <button className="btn btn-primary auth-btn" type="submit" disabled={loading}>
          {loading ? <><span className="spinner" /> Creating account...</> : 'Create Account'}
        </button>
      </form>
      <p className="auth-switch">
        Already registered? <Link to="/patient/login">Login</Link>
      </p>
    </AuthShell>
  );
}
