import React, { useState } from 'react';
import { api } from '../../services/api';
import { User } from '../../types';
import { X, UserPlus, LogIn, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register';
  onClose: () => void;
  onSuccess: (user: User, token: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('patient@careflow.com');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Registration Form State
  const [regData, setRegData] = useState({
    fullName: '',
    dob: '',
    age: '',
    gender: 'Male',
    phone: '',
    email: '',
    password: 'password123',
    address: '',
    bloodGroup: 'O+',
    allergies: '',
    medicalHistory: '',
    currentMedications: '',
    emergencyContact: ''
  });

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.login(loginEmail, loginPassword);
      localStorage.setItem('careflow_token', res.token);
      onSuccess(res.user, res.token);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.register(regData);
      localStorage.setItem('careflow_token', res.token);
      onSuccess(res.user, res.token);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  // Quick fill demo user
  const setDemoLogin = (email: string) => {
    setLoginEmail(email);
    setLoginPassword('password123');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        maxWidth: mode === 'register' ? '640px' : '440px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: 'var(--shadow-xl)',
        padding: '32px',
        position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            color: 'var(--text-muted)',
            padding: '4px'
          }}
        >
          <X size={20} />
        </button>

        {/* Tab Headers */}
        <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border-color)', marginBottom: '24px' }}>
          <button 
            onClick={() => { setMode('login'); setError(null); }}
            style={{
              padding: '10px 16px',
              fontWeight: 700,
              fontSize: '1rem',
              color: mode === 'login' ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: mode === 'login' ? '2px solid var(--primary)' : '2px solid transparent'
            }}
          >
            Sign In
          </button>
          <button 
            onClick={() => { setMode('register'); setError(null); }}
            style={{
              padding: '10px 16px',
              fontWeight: 700,
              fontSize: '1rem',
              color: mode === 'register' ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: mode === 'register' ? '2px solid var(--primary)' : '2px solid transparent'
            }}
          >
            Patient Registration
          </button>
        </div>

        {error && (
          <div style={{
            background: 'var(--danger-bg)',
            border: '1px solid var(--danger-border)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
            color: 'var(--danger)',
            fontSize: '0.86rem',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                className="form-input" 
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-input" 
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-lg" 
              style={{ width: '100%', marginTop: '10px' }}
              disabled={loading}
            >
              <LogIn size={18} />
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            </button>

            {/* Quick Login Helper Chips */}
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                QUICK DEMO ACCOUNTS (Password: password123)
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setDemoLogin('patient@careflow.com')}>
                  Patient (John)
                </button>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setDemoLogin('doctor.sharma@careflow.com')}>
                  Dr. Sharma (Cardio)
                </button>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setDemoLogin('reception@careflow.com')}>
                  Receptionist
                </button>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setDemoLogin('admin@careflow.com')}>
                  Admin
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Patient Registration Form */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit}>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Your unique Patient ID (e.g. PAT-2026-XXXXX) will be generated automatically upon submission.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Alex Carter"
                  value={regData.fullName}
                  onChange={e => setRegData({ ...regData, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input 
                  type="tel" 
                  className="form-input" 
                  placeholder="e.g. +91 98765 43210"
                  value={regData.phone}
                  onChange={e => setRegData({ ...regData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="e.g. john@example.com"
                  value={regData.email}
                  onChange={e => setRegData({ ...regData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={regData.dob}
                  onChange={e => {
                    const dobVal = e.target.value;
                    let calculatedAge = regData.age;
                    if (dobVal) {
                      const birthYear = new Date(dobVal).getFullYear();
                      calculatedAge = String(new Date().getFullYear() - birthYear);
                    }
                    setRegData({ ...regData, dob: dobVal, age: calculatedAge });
                  }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Age *</label>
                <input 
                  type="number" 
                  className="form-input" 
                  placeholder="e.g. 42"
                  value={regData.age}
                  onChange={e => setRegData({ ...regData, age: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gender *</label>
                <select 
                  className="form-select"
                  value={regData.gender}
                  onChange={e => setRegData({ ...regData, gender: e.target.value })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Blood Group</label>
                <select 
                  className="form-select"
                  value={regData.bloodGroup}
                  onChange={e => setRegData({ ...regData, bloodGroup: e.target.value })}
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Known Allergies</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Penicillin, Peanuts, None"
                  value={regData.allergies}
                  onChange={e => setRegData({ ...regData, allergies: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Previous Medical Conditions</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Hypertension, Asthma, Diabetes (or None)"
                value={regData.medicalHistory}
                onChange={e => setRegData({ ...regData, medicalHistory: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Current Medications</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Amlodipine 5mg, Multivitamins"
                value={regData.currentMedications}
                onChange={e => setRegData({ ...regData, currentMedications: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Emergency Contact</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Sarah Doe (Spouse) - +91 98765 43211"
                value={regData.emergencyContact}
                onChange={e => setRegData({ ...regData, emergencyContact: e.target.value })}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-lg" 
              style={{ width: '100%', marginTop: '12px' }}
              disabled={loading}
            >
              <UserPlus size={18} />
              <span>{loading ? 'Creating Patient Profile...' : 'Complete Registration'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
