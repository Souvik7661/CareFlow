import React, { useState, useEffect, useRef } from 'react';
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
  Calendar, 
  Droplet, 
  Pill, 
  FileText, 
  ChevronDown, 
  UserPlus, 
  AlertCircle,
  ShieldCheck,
  Smartphone,
  Key,
  RefreshCw,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { COUNTRIES, CountryPhoneConfig, DEFAULT_COUNTRY, findCountryByCode } from '../../utils/countryData';
import { useLanguage } from '../../context/LanguageContext';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register';
  onClose: () => void;
  onSuccess: (user: User, token: string, remember?: boolean) => void;
}

// Reusable 6-digit OTP Input component
const OtpInputBox: React.FC<{
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}> = ({ value, onChange, disabled }) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, '');
    if (!clean) return;
    const arr = value.split('');
    arr[index] = clean.slice(-1);
    const updated = arr.join('').slice(0, 6);
    onChange(updated);
    if (index < 5 && clean) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
      const arr = value.split('');
      arr[index] = '';
      onChange(arr.join(''));
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted) {
      onChange(pasted);
      const focusIndex = Math.min(5, pasted.length);
      inputsRef.current[focusIndex]?.focus();
    }
  };

  return (
    <div className="cf-nm-otp-container" onPaste={handlePaste}>
      {[0, 1, 2, 3, 4, 5].map((idx) => (
        <input
          key={idx}
          ref={(el) => { inputsRef.current[idx] = el; }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={value[idx] || ''}
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          className="cf-nm-otp-digit"
          disabled={disabled}
          autoFocus={idx === 0}
          aria-label={`Digit ${idx + 1}`}
        />
      ))}
    </div>
  );
};

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onSuccess
}) => {
  const { t, translateText } = useLanguage();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Sign In Sub-tab: 'phone' (Patient OTP) or 'email' (Hospital Staff)
  const [signInType, setSignInType] = useState<'phone' | 'email'>('phone');

  // Login Phone State
  const [loginCountry, setLoginCountry] = useState<CountryPhoneConfig>(DEFAULT_COUNTRY);
  const [loginPhoneDigits, setLoginPhoneDigits] = useState('');
  const [loginOtpSent, setLoginOtpSent] = useState(false);
  const [loginOtp, setLoginOtp] = useState('');
  const [loginOtpTimer, setLoginOtpTimer] = useState(0);
  const [loginSmsToast, setLoginSmsToast] = useState<{ code: string; phone: string } | null>(null);

  // Registration Multi-Step State
  const [regStep, setRegStep] = useState<1 | 2>(1);
  const [regCountry, setRegCountry] = useState<CountryPhoneConfig>(DEFAULT_COUNTRY);
  const [regPhoneDigits, setRegPhoneDigits] = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [regOtpSent, setRegOtpSent] = useState(false);
  const [regOtp, setRegOtp] = useState('');
  const [regOtpTimer, setRegOtpTimer] = useState(0);
  const [regSmsToast, setRegSmsToast] = useState<{ code: string; phone: string } | null>(null);

  // Email / Password Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Patient Registration Details State
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

  useEffect(() => {
    setMode(initialMode);
    setError(null);
    setRegStep(1);
    setLoginOtpSent(false);
    setRegOtpSent(false);
    setIsPhoneVerified(false);
    setLoginOtp('');
    setRegOtp('');
    setLoginSmsToast(null);
    setRegSmsToast(null);
  }, [initialMode, isOpen]);

  // Login countdown timer
  useEffect(() => {
    let timer: any;
    if (loginOtpTimer > 0) {
      timer = setInterval(() => setLoginOtpTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [loginOtpTimer]);

  // Reg countdown timer
  useEffect(() => {
    let timer: any;
    if (regOtpTimer > 0) {
      timer = setInterval(() => setRegOtpTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [regOtpTimer]);

  if (!isOpen) return null;

  // ===================== REGISTRATION OTP HANDLERS =====================
  const handleSendRegOtp = async () => {
    if (!regData.fullName.trim()) {
      setError('Please enter your full name before requesting an OTP.');
      return;
    }
    if (regPhoneDigits.length < regCountry.minLength || regPhoneDigits.length > regCountry.maxLength) {
      setError(`Please enter a valid ${regCountry.maxLength}-digit mobile number for ${regCountry.name}. Current: ${regPhoneDigits.length} digits.`);
      return;
    }

    setLoading(true);
    setError(null);
    const fullPhone = `${regCountry.dialCode} ${regPhoneDigits}`;

    try {
      const res = await api.sendOtp(fullPhone, 'REGISTER');
      setRegOtpSent(true);
      setRegOtpTimer(60);
      setRegOtp('');
      if (res.otp) {
        setRegSmsToast({ code: res.otp, phone: fullPhone });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP to your mobile number.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyRegOtp = async () => {
    if (regOtp.length !== 6) {
      setError('Please enter the complete 6-digit OTP code sent to your phone.');
      return;
    }

    setLoading(true);
    setError(null);
    const fullPhone = `${regCountry.dialCode} ${regPhoneDigits}`;

    try {
      const res = await api.verifyOtp(fullPhone, regOtp, 'REGISTER');
      if (res.verified) {
        setIsPhoneVerified(true);
        setRegData(prev => ({ ...prev, phone: fullPhone }));
        setRegStep(2); // Seamlessly proceed to the next fill ups in the form!
        setError(null);
      }
    } catch (err: any) {
      setError(err.message || 'Incorrect OTP code. Please check your SMS and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPhoneVerified) {
      setError('Please verify your mobile number with OTP first.');
      setRegStep(1);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fullPhoneNumber = `${regCountry.dialCode} ${regPhoneDigits}`;
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

  // ===================== SIGN IN OTP HANDLERS =====================
  const handleSendLoginOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (loginPhoneDigits.length < loginCountry.minLength || loginPhoneDigits.length > loginCountry.maxLength) {
      setError(`Please enter a valid ${loginCountry.maxLength}-digit phone number for ${loginCountry.name}. Current: ${loginPhoneDigits.length} digits.`);
      return;
    }

    setLoading(true);
    setError(null);
    const fullPhone = `${loginCountry.dialCode} ${loginPhoneDigits}`;

    try {
      const res = await api.sendOtp(fullPhone, 'LOGIN');
      setLoginOtpSent(true);
      setLoginOtpTimer(60);
      setLoginOtp('');
      if (res.otp) {
        setLoginSmsToast({ code: res.otp, phone: fullPhone });
      }
    } catch (err: any) {
      setError(err.message || 'No registered patient found with this phone number. Please register first.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyLoginOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (loginOtp.length !== 6) {
      setError('Please enter the 6-digit OTP sent to your phone.');
      return;
    }

    setLoading(true);
    setError(null);
    const fullPhone = `${loginCountry.dialCode} ${loginPhoneDigits}`;

    try {
      const res = await api.verifyOtp(fullPhone, loginOtp, 'LOGIN');
      if (res.token && res.user) {
        sessionManager.setToken(res.token, rememberMe);
        sessionManager.setUser(res.user, rememberMe);
        onSuccess(res.user, res.token, rememberMe);
        onClose();
      } else {
        setError('Verification failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid OTP code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Standard Email/Password Login
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

  return (
    <div className="cf-nm-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div 
        className="cf-nm-card"
        style={{ maxWidth: mode === 'register' ? (regStep === 2 ? '720px' : '520px') : '480px' }}
      >
        {/* Header Tabs and Close Button */}
        <div className="cf-nm-header">
          <div className="cf-nm-tabs">
            <button 
              type="button"
              className={`cf-nm-tab-btn ${mode === 'login' ? 'active' : ''}`}
              onClick={() => { setMode('login'); setError(null); }}
            >
              {t('auth.loginTitle')}
              {mode === 'login' && <div className="cf-nm-tab-indicator" />}
            </button>

            <button 
              type="button"
              className={`cf-nm-tab-btn ${mode === 'register' ? 'active' : ''}`}
              onClick={() => { setMode('register'); setError(null); }}
            >
              {t('auth.registerTitle')}
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
            marginBottom: '16px',
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
          <div>
            {/* End-to-End Encryption Security Banner */}
            <div className="cf-nm-e2ee-badge">
              <div className="cf-nm-e2ee-icon">
                <ShieldCheck size={20} />
              </div>
              <div>
                <div style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                  {translateText("256-Bit End-to-End Encrypted Patient Portal")}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {translateText("Sign in securely using your registered mobile number and real-time one-time password (OTP).")}
                </div>
              </div>
            </div>

            {/* Segmented Switch: Patient Phone (OTP) vs Hospital Staff */}
            <div className="cf-nm-signin-toggle-row">
              <button 
                type="button"
                className={`cf-nm-signin-toggle-btn ${signInType === 'phone' ? 'active' : ''}`}
                onClick={() => { setSignInType('phone'); setError(null); }}
              >
                <Smartphone size={15} />
                <span>{t('auth.patientLogin')}</span>
              </button>
              <button 
                type="button"
                className={`cf-nm-signin-toggle-btn ${signInType === 'email' ? 'active' : ''}`}
                onClick={() => { setSignInType('email'); setError(null); }}
              >
                <Mail size={15} />
                <span>{t('auth.staffLogin')}</span>
              </button>
            </div>

            {/* --- PATIENT PHONE OTP LOGIN --- */}
            {signInType === 'phone' && (
              <div>
                {/* Simulated SMS Alert Toast (Realistic incoming SMS carrier simulation) */}
                {loginSmsToast && (
                  <div className="cf-nm-sms-toast">
                    <div className="cf-nm-sms-header">
                      <span className="cf-nm-sms-badge">
                        <Smartphone size={12} /> {translateText("SMS CARRIER GATEWAY (REAL-TIME)")}
                      </span>
                      <span>{translateText("Delivered to")} {loginSmsToast.phone}</span>
                    </div>
                    <div className="cf-nm-sms-body">
                      <span>{translateText("CareFlow Security: Your login OTP is")} </span>
                      <strong className="cf-nm-sms-code-highlight">{loginSmsToast.code}</strong>
                      <span>. {translateText("Valid for 5 mins.")}</span>
                      <button 
                        type="button" 
                        className="cf-nm-sms-auto-fill-btn"
                        onClick={() => setLoginOtp(loginSmsToast.code)}
                      >
                        {t('auth.autoFill')}
                      </button>
                    </div>
                  </div>
                )}

                {!loginOtpSent ? (
                  /* Stage 1: Enter Phone Number */
                  <form onSubmit={handleSendLoginOtp}>
                    <div className="cf-nm-field-group">
                      <label className="cf-nm-label">
                        {t('auth.mobileNumber')} *
                        <span className={`cf-nm-length-hint ${loginPhoneDigits.length === loginCountry.maxLength ? 'valid' : ''}`}>
                          ({loginPhoneDigits.length > 0 ? `${loginPhoneDigits.length}/${loginCountry.maxLength} ${translateText("digits")}` : `${loginCountry.maxLength} ${translateText("digits")}`})
                        </span>
                      </label>
                      <div className="cf-nm-slot cf-nm-phone-slot">
                        {/* Interactive Country Selector */}
                        <div 
                          className="cf-nm-country-dropdown-btn"
                          title={`Selected: ${loginCountry.name} (${loginCountry.dialCode})`}
                        >
                          <select 
                            className="cf-nm-country-select-hidden"
                            value={loginCountry.code}
                            onChange={(e) => {
                              const found = findCountryByCode(e.target.value);
                              setLoginCountry(found);
                              setLoginPhoneDigits(prev => prev.slice(0, found.maxLength));
                            }}
                            aria-label="Select Country"
                          >
                            {COUNTRIES.map(c => (
                              <option key={c.code} value={c.code}>
                                {c.flag} {c.name} ({c.dialCode})
                              </option>
                            ))}
                          </select>
                          <span className="cf-nm-country-flag">{loginCountry.flag}</span>
                          <span className="cf-nm-country-dial">{loginCountry.dialCode}</span>
                          <ChevronDown size={14} className="cf-nm-slot-icon" style={{ pointerEvents: 'none' }} />
                        </div>

                        <div className="cf-nm-phone-divider" />

                        {/* Digits Input */}
                        <input 
                          type="tel" 
                          inputMode="numeric"
                          pattern="[0-9]*"
                          className="cf-nm-input cf-nm-phone-input" 
                          placeholder={`e.g. ${loginCountry.placeholder}`}
                          value={loginPhoneDigits}
                          maxLength={loginCountry.maxLength}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, '').slice(0, loginCountry.maxLength);
                            setLoginPhoneDigits(digits);
                          }}
                          required
                          autoFocus
                        />
                      </div>
                    </div>

                    {/* Remember Me */}
                    <div 
                      className="cf-nm-checkbox-row"
                      onClick={() => setRememberMe(!rememberMe)}
                    >
                      <div className={`cf-nm-checkbox-box ${rememberMe ? 'checked' : ''}`}>
                        {rememberMe && <Check size={13} color="#ffffff" strokeWidth={3} />}
                      </div>
                      <span className="cf-nm-checkbox-label">
                        {translateText("Keep me signed in on this device")}
                      </span>
                    </div>

                    {/* Submit / Give OTP Button */}
                    <button 
                      type="submit" 
                      className="cf-nm-btn-primary"
                      disabled={loading || loginPhoneDigits.length < loginCountry.minLength}
                      style={{ marginTop: '12px' }}
                    >
                      <Key size={18} />
                      <span>{loading ? translateText("Sending OTP...") : t('auth.giveOtp')}</span>
                    </button>
                  </form>
                ) : (
                  /* Stage 2: Enter OTP */
                  <form onSubmit={handleVerifyLoginOtp}>
                    <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                      <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: '0 0 4px 0' }}>
                        {translateText("Enter the 6-digit security code sent to:")}
                      </p>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        <span>{loginCountry.dialCode} {loginPhoneDigits}</span>
                        <button 
                          type="button" 
                          onClick={() => { setLoginOtpSent(false); setLoginSmsToast(null); }}
                          style={{ background: 'none', border: 'none', color: '#0d9488', fontSize: '0.78rem', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                        >
                          {translateText("Change")}
                        </button>
                      </div>
                    </div>

                    <OtpInputBox 
                      value={loginOtp} 
                      onChange={setLoginOtp} 
                      disabled={loading} 
                    />

                    {/* Resend OTP Row */}
                    <div style={{ textAlign: 'center', fontSize: '0.80rem', color: '#64748b', marginBottom: '16px' }}>
                      {loginOtpTimer > 0 ? (
                        <span>{translateText("Resend security code in")} <strong>{loginOtpTimer}s</strong></span>
                      ) : (
                        <button 
                          type="button" 
                          onClick={() => handleSendLoginOtp()}
                          style={{ background: 'none', border: 'none', color: '#0d9488', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <RefreshCw size={13} />
                          <span>{t('auth.resendOtp')}</span>
                        </button>
                      )}
                    </div>

                    {/* Verify & Enter Patient Dashboard */}
                    <button 
                      type="submit" 
                      className="cf-nm-btn-primary"
                      disabled={loading || loginOtp.length !== 6}
                    >
                      <ShieldCheck size={19} />
                      <span>{loading ? translateText("Verifying Secure Token...") : t('auth.verifyAndLogin')}</span>
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* --- HOSPITAL STAFF / EMAIL LOGIN --- */}
            {signInType === 'email' && (
              <form onSubmit={handleLoginSubmit}>
                {/* Email Address */}
                <div className="cf-nm-field-group">
                  <label className="cf-nm-label">{t('auth.email')}</label>
                  <div className="cf-nm-slot">
                    <div className="cf-nm-slot-icon">
                      <Mail size={18} />
                    </div>
                    <input 
                      type="email" 
                      className="cf-nm-input" 
                      placeholder="e.g. doctor@careflow.com"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="cf-nm-field-group">
                  <label className="cf-nm-label">{t('auth.password')}</label>
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

                {/* Remember me */}
                <div 
                  className="cf-nm-checkbox-row"
                  onClick={() => setRememberMe(!rememberMe)}
                >
                  <div className={`cf-nm-checkbox-box ${rememberMe ? 'checked' : ''}`}>
                    {rememberMe && <Check size={13} color="#ffffff" strokeWidth={3} />}
                  </div>
                  <span className="cf-nm-checkbox-label">
                    {translateText("Remember me on this browser")}
                  </span>
                </div>

                {/* Submit */}
                <button 
                  type="submit" 
                  className="cf-nm-btn-primary"
                  disabled={loading}
                >
                  <LogIn size={19} />
                  <span>{loading ? translateText("Signing In...") : translateText("Sign In as Staff")}</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* ============= PATIENT REGISTRATION TAB ============= */}
        {mode === 'register' && (
          <div>
            {/* Multi-Step Indicator */}
            <div className="cf-nm-stepper">
              <div className="cf-nm-stepper-line">
                <div 
                  className="cf-nm-stepper-line-fill" 
                  style={{ width: regStep === 2 ? '100%' : '0%' }} 
                />
              </div>

              <div className={`cf-nm-step-item ${regStep === 1 ? 'active' : 'completed'}`}>
                <div className="cf-nm-step-bubble">
                  {regStep === 2 ? <Check size={16} /> : '1'}
                </div>
                <span>{translateText("Phone & OTP")}</span>
              </div>

              <div className={`cf-nm-step-item ${regStep === 2 ? 'active' : ''}`}>
                <div className="cf-nm-step-bubble">2</div>
                <span>{translateText("Medical Profile")}</span>
              </div>
            </div>

            {/* STEP 1: Phone Verification with Real-Time "Give OTP" Option */}
            {regStep === 1 && (
              <div>
                <p className="cf-nm-subtitle" style={{ marginBottom: '14px' }}>
                  {translateText("Step 1: Enter your mobile number to receive a real-time OTP and verify your patient identity.")}
                </p>

                {/* Real-time SMS Toast (Carrier gateway simulation) */}
                {regSmsToast && (
                  <div className="cf-nm-sms-toast">
                    <div className="cf-nm-sms-header">
                      <span className="cf-nm-sms-badge">
                        <Smartphone size={12} /> {translateText("SMS CARRIER GATEWAY (REAL-TIME)")}
                      </span>
                      <span>{translateText("Delivered to")} {regSmsToast.phone}</span>
                    </div>
                    <div className="cf-nm-sms-body">
                      <span>{translateText("CareFlow Security: Your verification OTP is")} </span>
                      <strong className="cf-nm-sms-code-highlight">{regSmsToast.code}</strong>
                      <span>. {translateText("Valid for 5 mins.")}</span>
                      <button 
                        type="button" 
                        className="cf-nm-sms-auto-fill-btn"
                        onClick={() => setRegOtp(regSmsToast.code)}
                      >
                        {t('auth.autoFill')}
                      </button>
                    </div>
                  </div>
                )}

                {/* Full Name */}
                <div className="cf-nm-field-group">
                  <label className="cf-nm-label">{t('auth.fullName')} *</label>
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

                {/* Phone Number with Country Selector & Give OTP Button */}
                <div className="cf-nm-field-group">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <label className="cf-nm-label" style={{ marginBottom: 0 }}>
                      {t('auth.mobileNumber')} *
                      <span className={`cf-nm-length-hint ${regPhoneDigits.length === regCountry.maxLength ? 'valid' : ''}`}>
                        ({regPhoneDigits.length > 0 ? `${regPhoneDigits.length}/${regCountry.maxLength} ${translateText("digits")}` : `${regCountry.maxLength} ${translateText("digits")}`})
                      </span>
                    </label>

                    {/* Give OTP button directly appears here when phone digits match */}
                    {regPhoneDigits.length === regCountry.maxLength && !regOtpSent && (
                      <button 
                        type="button"
                        className="cf-nm-give-otp-btn pulse"
                        onClick={handleSendRegOtp}
                        disabled={loading}
                      >
                        <Key size={13} />
                        <span>{t('auth.giveOtp')}</span>
                      </button>
                    )}
                  </div>

                  <div className="cf-nm-slot cf-nm-phone-slot">
                    {/* Country Selector */}
                    <div 
                      className="cf-nm-country-dropdown-btn"
                      title={`Selected: ${regCountry.name} (${regCountry.dialCode})`}
                    >
                      <select 
                        className="cf-nm-country-select-hidden"
                        value={regCountry.code}
                        onChange={(e) => {
                          const found = findCountryByCode(e.target.value);
                          setRegCountry(found);
                          const trimmed = regPhoneDigits.slice(0, found.maxLength);
                          setRegPhoneDigits(trimmed);
                          setRegOtpSent(false);
                          setRegSmsToast(null);
                        }}
                        aria-label="Select Country"
                      >
                        {COUNTRIES.map(c => (
                              <option key={c.code} value={c.code}>
                            {c.flag} {c.name} ({c.dialCode})
                          </option>
                        ))}
                      </select>
                      <span className="cf-nm-country-flag">{regCountry.flag}</span>
                      <span className="cf-nm-country-dial">{regCountry.dialCode}</span>
                      <ChevronDown size={14} className="cf-nm-slot-icon" style={{ pointerEvents: 'none' }} />
                    </div>

                    <div className="cf-nm-phone-divider" />

                    {/* Phone Digits Input */}
                    <input 
                      type="tel" 
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className="cf-nm-input cf-nm-phone-input" 
                      placeholder={`e.g. ${regCountry.placeholder}`}
                      value={regPhoneDigits}
                      maxLength={regCountry.maxLength}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '').slice(0, regCountry.maxLength);
                        setRegPhoneDigits(digits);
                        if (regOtpSent) {
                          setRegOtpSent(false);
                          setRegSmsToast(null);
                        }
                      }}
                      required
                    />

                    {/* If OTP already sent, button allows resending */}
                    {regOtpSent && (
                      <button 
                        type="button" 
                        className="cf-nm-give-otp-btn"
                        onClick={handleSendRegOtp}
                        disabled={loading || regOtpTimer > 0}
                        style={{ background: '#475569', fontSize: '0.72rem', padding: '4px 8px' }}
                      >
                        {regOtpTimer > 0 ? `${regOtpTimer}s` : translateText('Resend')}
                      </button>
                    )}
                  </div>
                </div>

                {/* OTP Entry Area: Appears after clicking "Give OTP" */}
                {regOtpSent && (
                  <div style={{
                    background: 'rgba(13, 148, 136, 0.05)',
                    border: '1.5px solid rgba(13, 148, 136, 0.25)',
                    borderRadius: '16px',
                    padding: '16px',
                    marginTop: '16px',
                    textAlign: 'center'
                  }}>
                    <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {translateText("Enter 6-Digit OTP Sent to")} {regCountry.dialCode} {regPhoneDigits}
                    </span>

                    <OtpInputBox 
                      value={regOtp} 
                      onChange={setRegOtp} 
                      disabled={loading} 
                    />

                    <button 
                      type="button" 
                      className="cf-nm-btn-primary"
                      onClick={handleVerifyRegOtp}
                      disabled={loading || regOtp.length !== 6}
                      style={{ marginTop: '8px' }}
                    >
                      <CheckCircle2 size={18} />
                      <span>{loading ? translateText("Verifying OTP...") : translateText("Verify OTP & Proceed to Form")}</span>
                    </button>
                  </div>
                )}

                {/* Primary Action Button if OTP hasn't been clicked yet */}
                {!regOtpSent && (
                  <button 
                    type="button" 
                    className="cf-nm-btn-primary"
                    onClick={handleSendRegOtp}
                    disabled={loading || regPhoneDigits.length < regCountry.minLength || !regData.fullName.trim()}
                    style={{ marginTop: '20px' }}
                  >
                    <Key size={18} />
                    <span>{t('auth.giveOtp')}</span>
                  </button>
                )}
              </div>
            )}

            {/* STEP 2: The Next Fill Ups in the Form (Proceeds here after OTP verification) */}
            {regStep === 2 && (
              <form onSubmit={handleRegisterSubmit}>
                {/* Verified Phone Banner */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={18} color="#059669" />
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#065f46' }}>
                        {regData.fullName} • {translateText("Phone Verified")}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#047857' }}>
                        {regCountry.dialCode} {regPhoneDigits}
                      </div>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setRegStep(1)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#0d9488',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <ArrowLeft size={13} />
                    <span>{translateText("Edit Phone")}</span>
                  </button>
                </div>

                <p className="cf-nm-subtitle" style={{ marginTop: 0 }}>
                  {translateText("Fill in your medical details. Your unique Patient ID (PAT-2026-XXXXX) will be generated automatically.")}
                </p>

                <div className="cf-nm-grid-2">
                  {/* Row 1: Email Address */}
                  <div className="cf-nm-field-group">
                    <label className="cf-nm-label">{t('auth.email')} ({translateText("Optional")})</label>
                    <div className="cf-nm-slot">
                      <div className="cf-nm-slot-icon">
                        <Mail size={18} />
                      </div>
                      <input 
                        type="email" 
                        className="cf-nm-input" 
                        placeholder="e.g. alex@example.com"
                        value={regData.email}
                        onChange={e => setRegData({ ...regData, email: e.target.value })}
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Row 1: Date of Birth */}
                  <div className="cf-nm-field-group">
                    <label className="cf-nm-label">{translateText("Date of Birth")}</label>
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

                  {/* Row 2: Age */}
                  <div className="cf-nm-field-group">
                    <label className="cf-nm-label">{t('auth.age')} *</label>
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

                  {/* Row 2: Gender */}
                  <div className="cf-nm-field-group">
                    <label className="cf-nm-label">{t('auth.gender')} *</label>
                    <div className="cf-nm-slot">
                      <div className="cf-nm-slot-icon">
                        <UserIcon size={18} />
                      </div>
                      <select 
                        className="cf-nm-select"
                        value={regData.gender}
                        onChange={e => setRegData({ ...regData, gender: e.target.value })}
                      >
                        <option value="Male">{translateText("Male")}</option>
                        <option value="Female">{translateText("Female")}</option>
                        <option value="Other">{translateText("Other")}</option>
                      </select>
                      <ChevronDown size={18} className="cf-nm-slot-icon" style={{ pointerEvents: 'none' }} />
                    </div>
                  </div>

                  {/* Row 3: Blood Group */}
                  <div className="cf-nm-field-group">
                    <label className="cf-nm-label">{t('auth.bloodGroup')}</label>
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

                  {/* Row 3: Known Allergies */}
                  <div className="cf-nm-field-group">
                    <label className="cf-nm-label">{t('auth.allergies')}</label>
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

                {/* Previous Medical Conditions (Full Width) */}
                <div className="cf-nm-field-group" style={{ marginTop: '12px' }}>
                  <label className="cf-nm-label">{t('auth.medicalHistory')}</label>
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

                {/* Current Medications (Full Width) */}
                <div className="cf-nm-field-group">
                  <label className="cf-nm-label">{t('auth.medications')}</label>
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
                  <span>{loading ? translateText('Creating Encrypted Patient Profile...') : t('auth.completeRegistration')}</span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
