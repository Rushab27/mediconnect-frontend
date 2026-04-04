import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      {/* Background effects */}
      <div className="landing-bg">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-grid" />
      </div>

      {/* Nav */}
      <nav className="landing-nav">
        <div className="nav-logo">
          <span className="logo-icon">⚕</span>
          <span className="logo-text">MediConnect</span>
        </div>
      </nav>

      {/* Hero */}
      <main className="landing-hero">
        <div className="hero-badge">🏥 Smart Healthcare Management</div>
        <h1 className="hero-title">
          The Future of<br />
          <span className="hero-gradient">Clinic Management</span>
        </h1>
        <p className="hero-subtitle">
          Connect your clinic with patients via WhatsApp AI Bot, manage appointments,
          track health records, and grow your practice — all in one place.
        </p>

        {/* Feature pills */}
        <div className="feature-pills">
          {['WhatsApp Bot', 'Smart Scheduling', 'Patient Records', 'Analytics', 'Prescriptions'].map(f => (
            <span key={f} className="pill">✦ {f}</span>
          ))}
        </div>

        {/* CTA Cards */}
        <div className="cta-cards">
          <div className="cta-card cta-clinic">
            <div className="cta-icon">🏥</div>
            <h3>I'm a Clinic / Doctor</h3>
            <p>Manage your clinic, doctors, appointments and patient records</p>
            <div className="cta-actions">
              <button className="btn btn-primary" onClick={() => navigate('/clinic/login')}>
                Login
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/clinic/signup')}>
                Register Clinic
              </button>
            </div>
          </div>

          <div className="cta-divider">
            <span>or</span>
          </div>

          <div className="cta-card cta-patient">
            <div className="cta-icon">👤</div>
            <h3>I'm a Patient</h3>
            <p>Book appointments, view prescriptions and manage your health</p>
            <div className="cta-actions">
              <button className="btn btn-primary" onClick={() => navigate('/patient/login')}>
                Login
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/patient/signup')}>
                Register
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Stats bar */}
      <div className="stats-bar">
        {[
          { value: '24/7', label: 'WhatsApp Bot' },
          { value: '100%', label: 'Secure Data' },
          { value: '∞', label: 'Patients Supported' },
          { value: 'Free', label: 'To Start' },
        ].map(s => (
          <div key={s.label} className="stat-item">
            <div className="stat-number">{s.value}</div>
            <div className="stat-name">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
