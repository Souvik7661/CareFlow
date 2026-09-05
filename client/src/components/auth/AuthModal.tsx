import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { User } from '../../types';
import { sessionManager } from '../../services/session';
import { 
  X, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Check, 
  LogIn, 
  User as UserIcon, 
  Phone, 
  Calendar, 
  Droplet, 
  Pill, 
  FileText, 
  ChevronDown, 
  UserPlus, 
  AlertCircle 
} from 'lucide-react';
import { COUNTRIES, CountryPhoneConfig, DEFAULT_COUNTRY, findCountryByCode } from '../../utils/countryData';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register';
  onClose: () => void;
  onSuccess: (user: User, token: string, remember?: boolean) => void;
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
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Country Phone Selection & Digits State
  const [selectedCountry, setSelectedCountry] = useState<CountryPhoneConfig>(DEFAULT_COUNTRY);
  const [phoneDigits, setPhoneDigits] = useState('');

  useEffect(() => {
    setMode(initialMode);
    setError(null);
  }, [initialMode, isOpen]);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Registration Form State matching user design
  const [regData, setRegData] = useState({
    fullName: '',
    phone: '',
    email: '',
    dob: '',
    age: '',
    gender: 'Male',
    bloodGroup: 'O+',
    allergies: '',
    medicalHistory: '',
    currentMedications: '',
    password: 'password123',
    address: '',
    emergencyContact: ''
  });

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.login(loginEmail, loginPassword);
      sessionManager.setToken(res.token, rememberMe);
      sessionManager.setUser(res.user, rememberMe);
      onSuccess(res.user, res.token, rememberMe);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate international mobile number length strictly based on selected country
    if (phoneDigits.length < selectedCountry.minLength || phoneDigits.length > selectedCountry.maxLength) {
      setError(`Please enter a valid ${selectedCountry.maxLength}-digit mobile number for ${selectedCountry.name} (${selectedCountry.dialCode}). You currently entered ${phoneDigits.length} digits.`);
      setLoading(false);
      return;
    }

    try {
      const fullPhoneNumber = `${selectedCountry.dialCode} ${phoneDigits}`;
      const res = await api.register({
        ...regData,
        phone: fullPhoneNumber
      });
      sessionManager.setToken(res.token, false);
      sessionManager.setUser(res.user, false);
      onSuccess(res.user, res.token, false);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoClick = (email: string) => {
    setLoginEmail(email);
    setLoginPassword('password123');
  };

  return (
    <div className="cf-nm-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div 
        className="cf-nm-card"
        style={{ maxWidth: mode === 'register' ? '720px' : '440px' }}
      >
        {/* Header Tabs and Close Button */}
        <div className="cf-nm-header">
          <div className="cf-nm-tabs">
            <button 
              type="button"
              className={`cf-nm-tab-btn ${mode === 'login' ? 'active' : ''}`}
              onClick={() => { setMode('login'); setError(null); }}
            >
              Sign In
              {mode === 'login' && <div className="cf-nm-tab-indicator" />}
            </button>

            <button 
              type="button"
              className={`cf-nm-tab-btn ${mode === 'register' ? 'active' : ''}`}
              onClick={() => { setMode('register'); setError(null); }}
            >
              Patient Registration
              {mode === 'register' && <div className="cf-nm-tab-indicator" />}
            </button>
          </div>

          <button 
            type="button"
            className="cf-nm-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Error Notification Alert */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '16px',
            padding: '10px 16px',
            color: '#b91c1c',
            fontSize: '0.86rem',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 500
          }}>
            <AlertCircle size={17} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* ================= SIGN IN TAB ================= */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit}>
            {/* Email Address */}
            <div className="cf-nm-field-group">
              <label className="cf-nm-label">Email Address</label>
              <div className="cf-nm-slot">
                <div className="cf-nm-slot-icon">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  className="cf-nm-input" 
                  placeholder="your.email@example.com"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div className="cf-nm-field-group">
              <label className="cf-nm-label">Password</label>
              <div className="cf-nm-slot">
                <div className="cf-nm-slot-icon">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  className="cf-nm-input" 
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  className="cf-nm-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember me on this browser */}
            <div 
              className="cf-nm-checkbox-row"
              onClick={() => setRememberMe(!rememberMe)}
            >
              <div className={`cf-nm-checkbox-box ${rememberMe ? 'checked' : ''}`}>
                {rememberMe && <Check size={13} color="#ffffff" strokeWidth={3} />}
              </div>
              <span className="cf-nm-checkbox-label">
                Remember me on this browser
              </span>
            </div>

            {/* Sign In Primary Pill Button */}
            <button 
              type="submit" 
              className="cf-nm-btn-primary"
              disabled={loading}
            >
              <LogIn size={19} />
              <span>{loading ? 'Signing In...' : 'Sign In'}</span>
            </button>

            {/* Quick Demo Accounts */}
            <div className="cf-nm-demo-section">
              <span className="cf-nm-demo-title">
                QUICK DEMO ACCOUNTS (Password: password123)
              </span>
              <div className="cf-nm-demo-chips">
                <button 
                  type="button" 
                  className="cf-nm-chip"
                  onClick={() => handleQuickDemoClick('patient@careflow.com')}
                >
                  Patient (John)
                </button>
                <button 
                  type="button" 
                  className="cf-nm-chip"
                  onClick={() => handleQuickDemoClick('doctor.sharma@careflow.com')}
                >
                  Dr. Sharma (Cardio)
                </button>
                <button 
                  type="button" 
                  className="cf-nm-chip"
                  onClick={() => handleQuickDemoClick('reception@careflow.com')}
                >
                  Receptionist
                </button>
                <button 
                  type="button" 
                  className="cf-nm-chip"
                  onClick={() => handleQuickDemoClick('admin@careflow.com')}
                >
                  Admin
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ============= PATIENT REGISTRATION TAB ============= */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit}>
            <p className="cf-nm-subtitle">
              Your unique Patient ID (e.g. PAT-2026-XXXXX) will be generated automatically upon submission.
            </p>

            <div className="cf-nm-grid-2">
              {/* Row 1: Full Name */}
              <div className="cf-nm-field-group">
                <label className="cf-nm-label">Full Name *</label>
                <div className="cf-nm-slot">
                  <div className="cf-nm-slot-icon">
                    <UserIcon size={18} />
                  </div>
                  <input 
                    type="text" 
                    className="cf-nm-input" 
                    placeholder="e.g. Alex Carter"
                    value={regData.fullName}
                    onChange={e => setRegData({ ...regData, fullName: e.target.value })}
                    required
                    autoFocus
                  />
                </div>
              </div>

              {/* Row 1: Phone Number with World Country Selector & Limit */}
              <div className="cf-nm-field-group">
                <label className="cf-nm-label">
                  Phone Number *
                  <span className={`cf-nm-length-hint ${phoneDigits.length === selectedCountry.maxLength ? 'valid' : ''}`}>
                    ({phoneDigits.length > 0 ? `${phoneDigits.length}/${selectedCountry.maxLength} digits` : `${selectedCountry.maxLength} digits`})
                  </span>
                </label>
                <div className="cf-nm-slot cf-nm-phone-slot">
                  {/* Interactive World Country Selector */}
                  <div 
                    className="cf-nm-country-dropdown-btn"
                    title={`Selected: ${selectedCountry.name} (${selectedCountry.dialCode}) — Click to change country`}
                  >
                    <select 
                      className="cf-nm-country-select-hidden"
                      value={selectedCountry.code}
                      onChange={(e) => {
                        const found = findCountryByCode(e.target.value);
                        setSelectedCountry(found);
                        const trimmed = phoneDigits.slice(0, found.maxLength);
                        setPhoneDigits(trimmed);
                        setRegData(prev => ({ ...prev, phone: `${found.dialCode} ${trimmed}` }));
                      }}
                      aria-label="Select Country"
                    >
                      {COUNTRIES.map(c => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.name} ({c.dialCode})
                        </option>
                      ))}
                    </select>
                    <span className="cf-nm-country-flag">{selectedCountry.flag}</span>
                    <span className="cf-nm-country-dial">{selectedCountry.dialCode}</span>
                    <ChevronDown size={14} className="cf-nm-slot-icon" style={{ pointerEvents: 'none' }} />
                  </div>

                  <div className="cf-nm-phone-divider" />

                  {/* Strictly Limited Digits Input */}
                  <input 
                    type="tel" 
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="cf-nm-input cf-nm-phone-input" 
                    placeholder={`e.g. ${selectedCountry.placeholder}`}
                    value={phoneDigits}
                    maxLength={selectedCountry.maxLength}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, selectedCountry.maxLength);
                      setPhoneDigits(digits);
                      setRegData(prev => ({ ...prev, phone: `${selectedCountry.dialCode} ${digits}` }));
                    }}
                    required
                  />
                </div>
              </div>

              {/* Row 2: Email Address */}
              <div className="cf-nm-field-group">
                <label className="cf-nm-label">Email Address</label>
                <div className="cf-nm-slot">
                  <div className="cf-nm-slot-icon">
                    <Mail size={18} />
                  </div>
                  <input 
                    type="email" 
                    className="cf-nm-input" 
                    placeholder="e.g. john@example.com"
                    value={regData.email}
                    onChange={e => setRegData({ ...regData, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Row 2: Date of Birth */}
              <div className="cf-nm-field-group">
                <label className="cf-nm-label">Date of Birth</label>
                <div className="cf-nm-slot">
                  <div className="cf-nm-slot-icon">
                    <Calendar size={18} />
                  </div>
                  <input 
                    type="date" 
                    className="cf-nm-input" 
                    placeholder="dd/mm/yyyy"
                    value={regData.dob}
                    onChange={e => {
                      const dobVal = e.target.value;
                      let calculatedAge = regData.age;
                      if (dobVal) {
                        const birthYear = new Date(dobVal).getFullYear();
                        if (!isNaN(birthYear)) {
                          calculatedAge = String(Math.max(1, new Date().getFullYear() - birthYear));
                        }
                      }
                      setRegData({ ...regData, dob: dobVal, age: calculatedAge });
                    }}
                  />
                </div>
              </div>

              {/* Row 3: Age */}
              <div className="cf-nm-field-group">
                <label className="cf-nm-label">Age *</label>
                <div className="cf-nm-slot">
                  <div className="cf-nm-slot-icon">
                    <UserIcon size={18} />
                  </div>
                  <input 
                    type="number" 
                    className="cf-nm-input" 
                    placeholder="e.g. 42"
                    value={regData.age}
                    onChange={e => setRegData({ ...regData, age: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Row 3: Gender */}
              <div className="cf-nm-field-group">
                <label className="cf-nm-label">Gender *</label>
                <div className="cf-nm-slot">
                  <div className="cf-nm-slot-icon">
                    <UserIcon size={18} />
                  </div>
                  <select 
                    className="cf-nm-select"
                    value={regData.gender}
                    onChange={e => setRegData({ ...regData, gender: e.target.value })}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown size={18} className="cf-nm-slot-icon" style={{ pointerEvents: 'none' }} />
                </div>
              </div>

              {/* Row 4: Blood Group */}
              <div className="cf-nm-field-group">
                <label className="cf-nm-label">Blood Group</label>
                <div className="cf-nm-slot">
                  <div className="cf-nm-slot-icon">
                    <Droplet size={18} />
                  </div>
                  <select 
                    className="cf-nm-select"
                    value={regData.bloodGroup}
                    onChange={e => setRegData({ ...regData, bloodGroup: e.target.value })}
                  >
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                  <ChevronDown size={18} className="cf-nm-slot-icon" style={{ pointerEvents: 'none' }} />
                </div>
              </div>

              {/* Row 4: Known Allergies */}
              <div className="cf-nm-field-group">
                <label className="cf-nm-label">Known Allergies</label>
                <div className="cf-nm-slot">
                  <div className="cf-nm-slot-icon">
                    <Pill size={18} />
                  </div>
                  <input 
                    type="text" 
                    className="cf-nm-input" 
                    placeholder="e.g. Penicillin, Peanuts, None"
                    value={regData.allergies}
                    onChange={e => setRegData({ ...regData, allergies: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Row 5: Previous Medical Conditions (Full Width) */}
            <div className="cf-nm-field-group">
              <label className="cf-nm-label">Previous Medical Conditions</label>
              <div className="cf-nm-slot">
                <div className="cf-nm-slot-icon">
                  <FileText size={18} />
                </div>
                <input 
                  type="text" 
                  className="cf-nm-input" 
                  placeholder="e.g. Hypertension, Asthma, Diabetes (or None)"
                  value={regData.medicalHistory}
                  onChange={e => setRegData({ ...regData, medicalHistory: e.target.value })}
                />
              </div>
            </div>

            {/* Row 6: Current Medications (Full Width) */}
            <div className="cf-nm-field-group">
              <label className="cf-nm-label">Current Medications</label>
              <div className="cf-nm-slot">
                <div className="cf-nm-slot-icon">
                  <Pill size={18} />
                </div>
                <input 
                  type="text" 
                  className="cf-nm-input" 
                  placeholder="e.g. Amlodipine 5mg, Multivitamins"
                  value={regData.currentMedications}
                  onChange={e => setRegData({ ...regData, currentMedications: e.target.value })}
                />
              </div>
            </div>

            {/* Submit Registration Primary Pill Button */}
            <button 
              type="submit" 
              className="cf-nm-btn-primary"
              style={{ marginTop: '22px' }}
              disabled={loading}
            >
              <UserPlus size={19} />
              <span>{loading ? 'Creating Patient Profile...' : 'Complete Registration'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
