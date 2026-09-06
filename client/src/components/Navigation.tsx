import React, { useState, useEffect } from 'react';
import { User, NotificationItem } from '../types';
import { api } from '../services/api';
import { 
  HeartPulse, 
  User as UserIcon, 
  Bell, 
  LogOut, 
  Stethoscope, 
  ClipboardList, 
  ShieldCheck, 
  Tv, 
  Calendar, 
  CheckCircle, 
  Activity, 
  MapPin, 
  Ambulance, 
  Ticket, 
  Sparkles,
  Sun,
  Moon,
  Globe2
} from 'lucide-react';
import { FashionLogo } from './common/FashionLogo';
import { ThemeSwitch } from './common/ThemeSwitch';
import { NetworkStatusBadge } from './common/NetworkStatusBadge';
import { useLanguage } from '../context/LanguageContext';

interface NavigationProps {
  currentUser: User | null;
  currentView: string;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onNavigate: (view: string) => void;
  onRoleSwitch: (role: string, doctorId?: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onLogout: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentUser,
  currentView,
  theme = 'light',
  onToggleTheme,
  onNavigate,
  onRoleSwitch,
  onOpenAuth,
  onLogout
}) => {
  const { currentLanguageObj, openLanguageModal, t } = useLanguage();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (currentUser?.patientId) {
      api.getPatientNotifications(currentUser.patientId).then(res => {
        setNotifications(res.notifications || []);
        setUnreadCount(res.notifications.filter(n => !n.read_status).length);
      }).catch(() => {});
    }
  }, [currentUser, currentView]);

  const handleMarkRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.notification_id === id ? { ...n, read_status: 1 } : n));
      setUnreadCount(prev => Math.max(prev - 1, 0));
    } catch (err) {}
  };

  return (
    <>
      {/* Main Navigation Header */}
      <header className="app-header">
        <div className="header-inner">
          <FashionLogo 
            size="md" 
            className="header-fashion-logo"
            onClick={() => {
              if (currentUser) onNavigate('token-window');
              else onOpenAuth('login');
            }}
          />

          <nav className="header-nav">
            {!currentUser && (
              <>
                <button 
                  className={`nav-link-btn header-btn-services ${currentView === 'welcome-hub' ? 'active' : ''}`}
                  onClick={() => onNavigate('welcome-hub')}
                >
                  <Sparkles size={15} />
                  <span>{t('nav.services', 'Services')}</span>
                </button>
                <button 
                  className={`nav-link-btn header-btn-triage ${(currentView === 'find-doctor' || currentView === 'ai-triage' || currentView === 'recommendation') ? 'active' : ''}`}
                  onClick={() => onNavigate('ai-triage')}
                >
                  <Stethoscope size={15} color="#a855f7" />
                  <span>{t('nav.teleconsultation', 'AI Triage & Match')}</span>
                </button>
                <button 
                  className={`nav-link-btn header-btn-doctors ${(currentView === 'find-doctors' || currentView === 'doctor-list') ? 'active' : ''}`}
                  onClick={() => onNavigate('doctor-list')}
                >
                  <Stethoscope size={15} />
                  <span>{t('nav.doctors', 'Doctors')}</span>
                </button>
                <button 
                  className="nav-link-btn header-btn-lobby"
                  onClick={() => onNavigate('waiting-tv')}
                  style={{ fontSize: '0.8rem' }}
                >
                  <Tv size={14} />
                  <span>{t('nav.waitingTv', 'Lobby')}</span>
                </button>
              </>
            )}

            {currentUser?.role === 'PATIENT' && (
              <>
                <button 
                  className={`nav-link-btn header-btn-services ${currentView === 'welcome-hub' ? 'active' : ''}`}
                  onClick={() => onNavigate('welcome-hub')}
                >
                  <Sparkles size={15} />
                  <span>{t('nav.services', 'Services')}</span>
                </button>
                <button 
                  className={`nav-link-btn header-btn-triage ${(currentView === 'find-doctor' || currentView === 'ai-triage' || currentView === 'recommendation') ? 'active' : ''}`}
                  onClick={() => onNavigate('ai-triage')}
                >
                  <Stethoscope size={15} color="#a855f7" />
                  <span>{t('nav.teleconsultation', 'AI Triage & Match')}</span>
                </button>
                <button 
                  className={`nav-link-btn header-btn-doctors ${(currentView === 'find-doctors' || currentView === 'doctor-list') ? 'active' : ''}`}
                  onClick={() => onNavigate('doctor-list')}
                >
                  <Stethoscope size={15} />
                  <span>{t('nav.doctors', 'Doctors')}</span>
                </button>
                <button 
                  className={`nav-link-btn header-btn-appointments ${currentView === 'my-appointments' ? 'active' : ''}`}
                  onClick={() => onNavigate('my-appointments')}
                >
                  <Calendar size={15} />
                  <span>{t('nav.myAppointments', 'Appointments')}</span>
                </button>
                <button 
                  className={`nav-link-btn header-btn-support ${currentView === 'ambulance' ? 'active' : ''}`}
                  onClick={() => onNavigate('ambulance')}
                  style={{ color: '#ef4444', fontWeight: 700 }}
                >
                  <Ambulance size={15} />
                  <span>24/7</span>
                </button>
                <button 
                  className={`nav-link-btn header-btn-token ${currentView === 'token-window' ? 'active' : ''}`}
                  onClick={() => onNavigate('token-window')}
                  style={{
                    background: currentView === 'token-window' ? 'var(--primary)' : 'var(--primary-light)',
                    color: currentView === 'token-window' ? '#ffffff' : 'var(--primary)',
                    border: '1.5px solid var(--primary-border)',
                    fontWeight: 800,
                    boxShadow: '0 2px 8px rgba(13, 148, 136, 0.25)'
                  }}
                >
                  <Ticket size={15} />
                  <span>Token</span>
                </button>
              </>
            )}

            {currentUser?.role === 'DOCTOR' && (
              <>
                <button 
                  className={`nav-link-btn ${currentView === 'doctor-dashboard' ? 'active' : ''}`}
                  onClick={() => onNavigate('doctor-dashboard')}
                >
                  <Stethoscope size={15} />
                  <span>Consultation Room</span>
                </button>
                <button 
                  className="nav-link-btn"
                  onClick={() => onNavigate('waiting-tv')}
                >
                  <Tv size={15} />
                  <span>Waiting Board</span>
                </button>
              </>
            )}

            {currentUser?.role === 'RECEPTIONIST' && (
              <>
                <button 
                  className={`nav-link-btn ${currentView === 'reception-dashboard' ? 'active' : ''}`}
                  onClick={() => onNavigate('reception-dashboard')}
                >
                  <ClipboardList size={15} />
                  <span>Reception Desk &amp; Triage</span>
                </button>
                <button 
                  className="nav-link-btn"
                  onClick={() => onNavigate('waiting-tv')}
                >
                  <Tv size={15} />
                  <span>Waiting Display</span>
                </button>
              </>
            )}

            {currentUser?.role === 'ADMIN' && (
              <>
                <button 
                  className={`nav-link-btn ${currentView === 'admin-dashboard' ? 'active' : ''}`}
                  onClick={() => onNavigate('admin-dashboard')}
                >
                  <ShieldCheck size={15} />
                  <span>Hospital Admin &amp; Analytics</span>
                </button>
                <button 
                  className="nav-link-btn"
                  onClick={() => onNavigate('waiting-tv')}
                >
                  <Tv size={15} />
                  <span>Lobby Board</span>
                </button>
              </>
            )}
          </nav>

          <div className="header-actions">
            {/* Language Switcher Trigger */}
            <button
              type="button"
              className="btn btn-outline btn-sm header-lang-btn"
              onClick={openLanguageModal}
              title={t('common.selectLanguage', 'Select Language')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: 700
              }}
            >
              <Globe2 size={15} color="var(--primary)" />
              <span>{currentLanguageObj.flag} {currentLanguageObj.code.toUpperCase()}</span>
            </button>

            {/* Rural Offline & Live Connectivity Badge */}
            <NetworkStatusBadge />

            {/* Photorealistic Framer Motion Dark/Light Switcher */}
            {onToggleTheme && (
              <ThemeSwitch
                theme={theme as 'light' | 'dark'}
                onToggle={onToggleTheme}
                size="md"
              />
            )}

            {currentUser ? (
              <>
                {/* Notifications Dropdown for Patients */}
                {currentUser.role === 'PATIENT' && (
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <button 
                      className="btn btn-outline btn-sm"
                      style={{ position: 'relative', padding: '8px 10px', overflow: 'visible', flexShrink: 0 }}
                      onClick={() => setShowNotifications(!showNotifications)}
                      title="Notifications"
                    >
                      <Bell size={16} />
                      {unreadCount > 0 && (
                        <span style={{
                          position: 'absolute',
                          top: -6,
                          right: -6,
                          background: '#ef4444',
                          color: '#ffffff',
                          borderRadius: '9999px',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          minWidth: '18px',
                          height: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '0 4px',
                          boxShadow: '0 2px 8px rgba(239, 68, 68, 0.7)',
                          border: '2px solid var(--bg-card, #18191e)',
                          zIndex: 10,
                          pointerEvents: 'none'
                        }}>
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    {showNotifications && (
                      <div style={{
                        position: 'absolute',
                        right: 0,
                        top: '120%',
                        width: '320px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-xl)',
                        padding: '14px',
                        zIndex: 1000
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Notifications</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{notifications.length} total</span>
                        </div>

                        <div style={{ maxHeight: '260px', overflowY: 'auto' }}>
                          {notifications.length === 0 ? (
                            <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                              No notifications yet.
                            </div>
                          ) : (
                            notifications.map(n => (
                              <div 
                                key={n.notification_id}
                                onClick={() => handleMarkRead(n.notification_id)}
                                style={{
                                  padding: '8px 10px',
                                  borderRadius: 'var(--radius-sm)',
                                  background: n.read_status ? 'var(--bg-muted)' : 'var(--primary-light)',
                                  marginBottom: '6px',
                                  cursor: 'pointer',
                                  border: '1px solid',
                                  borderColor: n.read_status ? 'transparent' : 'var(--primary-border)'
                                }}
                              >
                                <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--text-primary)' }}>{n.title}</div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{n.message}</div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* User Info Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, whiteSpace: 'nowrap' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-full)',
                    background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.25), rgba(6, 182, 212, 0.25))',
                    border: '1.5px solid var(--brand-teal, #14b8a6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    color: 'var(--brand-teal, #14b8a6)',
                    flexShrink: 0
                  }}>
                    {currentUser.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, lineHeight: 1.2 }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: 700, whiteSpace: 'nowrap', color: 'var(--text-primary)' }}>
                      {currentUser.fullName}
                    </span>
                    <span style={{ fontSize: '0.70rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {currentUser.patientId || currentUser.role}
                    </span>
                  </div>
                </div>

                <button 
                  className="btn btn-outline btn-sm"
                  onClick={onLogout}
                  title={t('nav.logout', 'Sign Out')}
                  style={{ color: 'var(--text-muted)', flexShrink: 0, padding: '6px 10px' }}
                >
                  <LogOut size={15} />
                </button>
              </>
            ) : (
              <>
                <button 
                  className="btn btn-outline btn-sm"
                  onClick={() => onOpenAuth('login')}
                >
                  {t('nav.signIn', 'Sign In')}
                </button>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => onOpenAuth('register')}
                >
                  {t('nav.register', 'Register')}
                </button>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
};
