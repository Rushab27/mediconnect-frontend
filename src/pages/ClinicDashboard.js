import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  getDashboardStats, getTodaysAppointments, getClinicAppointments,
  getDoctors, addDoctor, updateAppointmentStatus
} from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import './ClinicDashboard.css';

const NAV_ITEMS = [
  { id: 'dashboard', icon: '⊞', label: 'Dashboard' },
  { id: 'appointments', icon: '📅', label: 'Appointments' },
  { id: 'doctors', icon: '👨‍⚕️', label: 'Doctors' },
  { id: 'analytics', icon: '📊', label: 'Analytics' },
];

export default function ClinicDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [todayAppts, setTodayAppts] = useState([]);
  const [allAppts, setAllAppts] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddDoctor, setShowAddDoctor] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [statsRes, todayRes, doctorsRes] = await Promise.all([
        getDashboardStats(), getTodaysAppointments(), getDoctors()
      ]);
      setStats(statsRes.data);
      setTodayAppts(todayRes.data.appointments);
      setDoctors(doctorsRes.data.doctors);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const loadAppointments = async () => {
    try {
      const res = await getClinicAppointments();
      setAllAppts(res.data.appointments);
    } catch (e) {}
  };

  useEffect(() => {
    if (activeTab === 'appointments') loadAppointments();
  }, [activeTab]);

  const handleLogout = () => { logout(); navigate('/'); };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateAppointmentStatus(id, { status });
      loadAppointments();
      loadData();
    } catch (e) {}
  };

  const getBadge = (status) => <span className={`badge badge-${status}`}>{status}</span>;

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner" style={{ width: 32, height: 32 }} />
      <p>Loading dashboard...</p>
    </div>
  );

  return (
    <div className="clinic-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon">⚕</span>
          <span>MediConnect</span>
        </div>

        <div className="clinic-info">
          <div className="clinic-avatar">{user?.clinic_name?.[0] || 'C'}</div>
          <div>
            <div className="clinic-name">{user?.clinic_name}</div>
            <div className="clinic-city">{user?.city}</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.id === 'appointments' && todayAppts.length > 0 && (
                <span className="nav-badge">{todayAppts.length}</span>
              )}
            </button>
          ))}
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          ⏻ Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="clinic-main">
        {/* Header */}
        <div className="main-header">
          <div>
            <h1 className="page-title">
              {NAV_ITEMS.find(n => n.id === activeTab)?.label}
            </h1>
            <p className="page-date">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          {activeTab === 'doctors' && (
            <button className="btn btn-primary" onClick={() => setShowAddDoctor(true)}>
              + Add Doctor
            </button>
          )}
        </div>

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="animate-in">
            {/* Stats */}
            <div className="grid-4" style={{ marginBottom: 24 }}>
              <div className="stat-card blue">
                <div className="stat-icon">📅</div>
                <div className="stat-value">{stats?.stats.today_appointments ?? 0}</div>
                <div className="stat-label">Today's Appointments</div>
              </div>
              <div className="stat-card green">
                <div className="stat-icon">👥</div>
                <div className="stat-value">{stats?.stats.total_patients ?? 0}</div>
                <div className="stat-label">Total Patients</div>
              </div>
              <div className="stat-card amber">
                <div className="stat-icon">🩺</div>
                <div className="stat-value">{stats?.stats.total_appointments ?? 0}</div>
                <div className="stat-label">All Appointments</div>
              </div>
              <div className="stat-card purple">
                <div className="stat-icon">👨‍⚕️</div>
                <div className="stat-value">{stats?.stats.total_doctors ?? 0}</div>
                <div className="stat-label">Active Doctors</div>
              </div>
            </div>

            <div className="grid-2">
              {/* Weekly chart */}
              <div className="card">
                <div className="section-title" style={{ marginBottom: 16 }}>Weekly Appointments</div>
                {stats?.weekly_appointments?.length > 0 ? (
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={stats.weekly_appointments}>
                      <XAxis dataKey="appointment_date" tick={{ fontSize: 11, fill: '#8b9fc7' }}
                        tickFormatter={d => new Date(d).toLocaleDateString('en', { weekday: 'short' })} />
                      <YAxis tick={{ fontSize: 11, fill: '#8b9fc7' }} />
                      <Tooltip contentStyle={{ background: '#111d35', border: '1px solid #1e2d4a', borderRadius: 8 }} />
                      <Bar dataKey="count" radius={[4,4,0,0]}>
                        {stats.weekly_appointments.map((_, i) => (
                          <Cell key={i} fill={i === stats.weekly_appointments.length - 1 ? '#3b82f6' : '#1e3a5f'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="empty-state" style={{ padding: '30px 0' }}>
                    <div className="empty-icon">📊</div>
                    <p>No data yet</p>
                  </div>
                )}
              </div>

              {/* Today's appointments */}
              <div className="card">
                <div className="section-title" style={{ marginBottom: 16 }}>Today's Schedule</div>
                {todayAppts.length === 0 ? (
                  <div className="empty-state" style={{ padding: '30px 0' }}>
                    <div className="empty-icon">📅</div>
                    <p>No appointments today</p>
                  </div>
                ) : (
                  <div className="today-list">
                    {todayAppts.slice(0, 5).map(a => (
                      <div key={a.id} className="today-item">
                        <div className="today-time">{a.appointment_time}</div>
                        <div className="today-info">
                          <div className="today-patient">{a.patient_name}</div>
                          <div className="today-doctor">Dr. {a.doctor_name}</div>
                        </div>
                        {getBadge(a.status)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent appointments */}
            {stats?.recent_appointments?.length > 0 && (
              <div className="card" style={{ marginTop: 24 }}>
                <div className="section-title" style={{ marginBottom: 16 }}>Recent Activity</div>
                <div className="table-container">
                  <table>
                    <thead><tr>
                      <th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Status</th>
                    </tr></thead>
                    <tbody>
                      {stats.recent_appointments.map(a => (
                        <tr key={a.id}>
                          <td>{a.patient_name}</td>
                          <td>Dr. {a.doctor_name}</td>
                          <td>{new Date(a.appointment_date).toLocaleDateString('en-IN')}</td>
                          <td>{a.appointment_time}</td>
                          <td>{getBadge(a.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* APPOINTMENTS TAB */}
        {activeTab === 'appointments' && (
          <div className="animate-in">
            <div className="card">
              <div className="table-container">
                {allAppts.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📅</div>
                    <p>No appointments found</p>
                  </div>
                ) : (
                  <table>
                    <thead><tr>
                      <th>Patient</th><th>Phone</th><th>Doctor</th><th>Date</th><th>Time</th><th>Status</th><th>Actions</th>
                    </tr></thead>
                    <tbody>
                      {allAppts.map(a => (
                        <tr key={a.id}>
                          <td><strong>{a.patient_name}</strong></td>
                          <td style={{ color: 'var(--text-secondary)' }}>{a.patient_phone}</td>
                          <td>Dr. {a.doctor_name}</td>
                          <td>{new Date(a.appointment_date).toLocaleDateString('en-IN')}</td>
                          <td>{a.appointment_time}</td>
                          <td>{getBadge(a.status)}</td>
                          <td>
                            {a.status === 'pending' && (
                              <div style={{ display: 'flex', gap: 6 }}>
                                <button className="btn btn-success" style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                                  onClick={() => handleStatusUpdate(a.id, 'confirmed')}>Confirm</button>
                                <button className="btn btn-danger" style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                                  onClick={() => handleStatusUpdate(a.id, 'cancelled')}>Cancel</button>
                              </div>
                            )}
                            {a.status === 'confirmed' && (
                              <button className="btn btn-success" style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                                onClick={() => handleStatusUpdate(a.id, 'completed')}>✓ Done</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* DOCTORS TAB */}
        {activeTab === 'doctors' && (
          <div className="animate-in">
            {doctors.length === 0 ? (
              <div className="card">
                <div className="empty-state">
                  <div className="empty-icon">👨‍⚕️</div>
                  <p>No doctors added yet</p>
                  <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setShowAddDoctor(true)}>
                    + Add First Doctor
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid-3">
                {doctors.map(doc => (
                  <div key={doc.id} className="doctor-card card">
                    <div className="doctor-avatar">{doc.full_name[0]}</div>
                    <h3 className="doctor-name">Dr. {doc.full_name}</h3>
                    <div className="doctor-spec">{doc.specialization}</div>
                    <div className="doctor-fee">₹{doc.consultation_fee} / visit</div>
                    {doc.timings && <div className="doctor-timings">🕐 {doc.timings}</div>}
                    <div className={`doctor-status ${doc.is_active ? 'active' : 'inactive'}`}>
                      {doc.is_active ? '● Active' : '○ Inactive'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div className="animate-in">
            <div className="grid-2">
              <div className="card">
                <div className="section-title" style={{ marginBottom: 16 }}>Weekly Appointments</div>
                {stats?.weekly_appointments?.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={stats.weekly_appointments}>
                      <XAxis dataKey="appointment_date" tick={{ fontSize: 11, fill: '#8b9fc7' }}
                        tickFormatter={d => new Date(d).toLocaleDateString('en', { weekday: 'short' })} />
                      <YAxis tick={{ fontSize: 11, fill: '#8b9fc7' }} />
                      <Tooltip contentStyle={{ background: '#111d35', border: '1px solid #1e2d4a', borderRadius: 8 }} />
                      <Bar dataKey="count" fill="#3b82f6" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : <div className="empty-state"><p>No data yet</p></div>}
              </div>

              <div className="card">
                <div className="section-title" style={{ marginBottom: 16 }}>Top Conditions</div>
                {stats?.top_diseases?.length > 0 ? (
                  <div className="disease-list">
                    {stats.top_diseases.map((d, i) => (
                      <div key={i} className="disease-item">
                        <span className="disease-name">{d.reason}</span>
                        <span className="disease-count">{d.count} cases</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state"><p>No data yet — comes from appointment reasons</p></div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add Doctor Modal */}
      {showAddDoctor && (
        <AddDoctorModal onClose={() => setShowAddDoctor(false)} onSuccess={() => { setShowAddDoctor(false); loadData(); }} />
      )}
    </div>
  );
}

// ─── Add Doctor Modal ──────────────────────────────────────────────
function AddDoctorModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ full_name: '', specialization: '', consultation_fee: '', phone: '', timings: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await addDoctor(form);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add doctor.');
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h2 className="modal-title">👨‍⚕️ Add New Doctor</h2>
        {error && <div className="alert alert-error">⚠ {error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input className="form-input" placeholder="Dr. Priya Sharma" value={form.full_name} onChange={set('full_name')} required />
          </div>
          <div className="form-group">
            <label className="form-label">Specialization *</label>
            <input className="form-input" placeholder="General Physician, Cardiologist..." value={form.specialization} onChange={set('specialization')} required />
          </div>
          <div className="form-group">
            <label className="form-label">Consultation Fee (₹) *</label>
            <input className="form-input" type="number" placeholder="300" value={form.consultation_fee} onChange={set('consultation_fee')} required />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input className="form-input" placeholder="9876543210" value={form.phone} onChange={set('phone')} />
          </div>
          <div className="form-group">
            <label className="form-label">Timings</label>
            <input className="form-input" placeholder="Mon-Sat 9AM - 5PM" value={form.timings} onChange={set('timings')} />
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button className="btn btn-secondary" type="button" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
            <button className="btn btn-primary" type="submit" disabled={loading} style={{ flex: 1, justifyContent: 'center' }}>
              {loading ? <><span className="spinner" /> Adding...</> : 'Add Doctor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
