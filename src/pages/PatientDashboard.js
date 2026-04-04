import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getPatientAppointments, cancelAppointment } from '../utils/api';
import './PatientDashboard.css';

export default function PatientDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('appointments');

  useEffect(() => { loadAppointments(); }, []);

  const loadAppointments = async () => {
    try {
      const res = await getPatientAppointments();
      setAppointments(res.data.appointments);
    } catch (e) {}
    finally { setLoading(false); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await cancelAppointment(id);
      loadAppointments();
    } catch (e) { alert('Could not cancel appointment.'); }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const upcoming = appointments.filter(a => ['pending','confirmed'].includes(a.status));
  const past = appointments.filter(a => ['completed','cancelled','no-show'].includes(a.status));

  const getBadge = (status) => <span className={`badge badge-${status}`}>{status}</span>;

  return (
    <div className="patient-layout">
      {/* Header */}
      <header className="patient-header">
        <div className="header-logo">⚕ MediConnect</div>
        <div className="header-user">
          <div className="user-avatar">{user?.full_name?.[0] || 'P'}</div>
          <div className="user-info">
            <div className="user-name">{user?.full_name}</div>
            <div className="user-role">Patient</div>
          </div>
          <button className="btn btn-secondary" onClick={handleLogout} style={{ padding: '7px 14px', fontSize: '0.82rem' }}>
            Logout
          </button>
        </div>
      </header>

      <main className="patient-main">
        {/* Welcome */}
        <div className="patient-welcome animate-in">
          <div className="welcome-text">
            <h1>Hello, {user?.full_name?.split(' ')[0]}! 👋</h1>
            <p>Manage your appointments and health records</p>
          </div>
          <div className="welcome-stats">
            <div className="welcome-stat">
              <div className="welcome-stat-value">{upcoming.length}</div>
              <div className="welcome-stat-label">Upcoming</div>
            </div>
            <div className="welcome-stat">
              <div className="welcome-stat-value">{past.length}</div>
              <div className="welcome-stat-label">Completed</div>
            </div>
            <div className="welcome-stat">
              <div className="welcome-stat-value">{appointments.length}</div>
              <div className="welcome-stat-label">Total</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="patient-tabs">
          <button className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}>
            📅 My Appointments
          </button>
          <button className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}>
            👤 My Profile
          </button>
        </div>

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="animate-in">
            {loading ? (
              <div className="loading-screen">
                <div className="spinner" style={{ width: 28, height: 28 }} />
              </div>
            ) : appointments.length === 0 ? (
              <div className="card">
                <div className="empty-state">
                  <div className="empty-icon">📅</div>
                  <p>No appointments yet</p>
                  <p style={{ fontSize: '0.82rem', marginTop: 8, color: 'var(--text-muted)' }}>
                    Book via your clinic's WhatsApp bot
                  </p>
                </div>
              </div>
            ) : (
              <>
                {upcoming.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <div className="section-title" style={{ marginBottom: 14 }}>Upcoming Appointments</div>
                    <div className="appt-list">
                      {upcoming.map(a => (
                        <div key={a.id} className="appt-card card">
                          <div className="appt-header">
                            <div>
                              <div className="appt-doctor">Dr. {a.doctor_name}</div>
                              <div className="appt-spec">{a.specialization}</div>
                            </div>
                            {getBadge(a.status)}
                          </div>
                          <div className="appt-details">
                            <div className="appt-detail">
                              <span>🏥</span> {a.clinic_name}
                            </div>
                            <div className="appt-detail">
                              <span>📅</span> {new Date(a.appointment_date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                            <div className="appt-detail">
                              <span>🕐</span> {a.appointment_time}
                            </div>
                            <div className="appt-detail">
                              <span>💰</span> ₹{a.fees}
                            </div>
                          </div>
                          {a.reason && (
                            <div className="appt-reason">Reason: {a.reason}</div>
                          )}
                          {a.status === 'pending' && (
                            <button className="btn btn-danger" style={{ marginTop: 12, fontSize: '0.82rem', padding: '7px 14px' }}
                              onClick={() => handleCancel(a.id)}>
                              Cancel Appointment
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {past.length > 0 && (
                  <div>
                    <div className="section-title" style={{ marginBottom: 14 }}>Past Appointments</div>
                    <div className="card">
                      <div className="table-container">
                        <table>
                          <thead><tr>
                            <th>Doctor</th><th>Clinic</th><th>Date</th><th>Status</th><th>Fees</th>
                          </tr></thead>
                          <tbody>
                            {past.map(a => (
                              <tr key={a.id}>
                                <td>Dr. {a.doctor_name}</td>
                                <td style={{ color: 'var(--text-secondary)' }}>{a.clinic_name}</td>
                                <td>{new Date(a.appointment_date).toLocaleDateString('en-IN')}</td>
                                <td>{getBadge(a.status)}</td>
                                <td>₹{a.fees}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="animate-in">
            <div className="card">
              <div className="profile-header">
                <div className="profile-avatar">{user?.full_name?.[0]}</div>
                <div>
                  <h2 className="profile-name">{user?.full_name}</h2>
                  <p className="profile-email">{user?.email}</p>
                </div>
              </div>
              <div className="profile-details">
                {[
                  { label: 'Phone', value: user?.phone },
                  { label: 'Gender', value: user?.gender },
                  { label: 'Blood Group', value: user?.blood_group },
                  { label: 'Date of Birth', value: user?.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString('en-IN') : null },
                ].filter(d => d.value).map(d => (
                  <div key={d.label} className="profile-row">
                    <span className="profile-label">{d.label}</span>
                    <span className="profile-value">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
