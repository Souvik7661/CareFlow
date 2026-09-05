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
  Moon
} from 'lucide-react';
import { FashionLogo } from './common/FashionLogo';

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
                  <span>Services</span>
                </button>
                <button 
                  className={`nav-link-btn header-btn-triage ${(currentView === 'find-doctor' || currentView === 'ai-triage' || currentView === 'recommendation') ? 'active' : ''}`}
                  onClick={() => onNavigate('ai-triage')}
                >
                  <Stethoscope size={15} color="#a855f7" />
                  <span>AI Triage & Match</span>
                </button>
                <button 
                  className={`nav-link-btn header-btn-doctors ${(currentView === 'find-doctors' || currentView === 'doctor-list') ? 'active' : ''}`}
                  onClick={() => onNavigate('doctor-list')}
                >
                  <Stethoscope size={15} />
                  <span>Doctors</span>
                </button>
                <button 
                  className="btn btn-outline btn-sm header-btn-login"
                  onClick={() => onOpenAuth('login')}
                  style={{ fontSize: '0.82rem', padding: '6px 14px', borderRadius: '9999px' }}
                >
                  <span>Sign In</span>
                </button>
                <button 
                  className="btn btn-primary btn-sm header-btn-register"
                  onClick={() => onOpenAuth('register')}
                  style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                >
                  <span>Register</span>
                </button>
                <button 
                  className="nav-link-btn header-btn-lobby"
                  onClick={() => onNavigate('waiting-tv')}
                  style={{ fontSize: '0.8rem' }}
                >
                  <Tv size={14} />
                  <span>Lobby</span>
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
                  <span>Services</span>
                </button>
                <button 
                  className={`nav-link-btn header-btn-triage ${(currentView === 'find-doctor' || currentView === 'ai-triage' || currentView === 'recommendation') ? 'active' : ''}`}
                  onClick={() => onNavigate('ai-triage')}
                >
                  <Stethoscope size={15} color="#a855f7" />
                  <span>AI Triage & Match</span>
                </button>
                <button 
                  className={`nav-link-btn header-btn-doctors ${(currentView === 'find-doctors' || currentView === 'doctor-list') ? 'active' : ''}`}
                  onClick={() => onNavigate('doctor-list')}
                >
                  <Stethoscope size={15} />
                  <span>Doctors</span>
                </button>
                <button 
                  className={`nav-link-btn header-btn-appointments ${currentView === 'my-appointments' ? 'active' : ''}`}
                  onClick={() => onNavigate('my-appointments')}
                >
                  <Calendar size={15} />
                  <span>Appointments</span>
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
            {/* Dark/Light Mode Switcher */}
            {onToggleTheme && (
              <button
                className="theme-toggle-btn"
                onClick={onToggleTheme}
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#0d9488" />}
              </button>
            )}

            {currentUser ? (
              <>
                {/* Notifications Dropdown for Patients */}
                {currentUser.role === 'PATIENT' && (
                  <div style={{ position: 'relative' }}>
                    <button 
                      className="btn btn-outline btn-sm"
                      style={{ position: 'relative', padding: '8px 10px' }}
                      onClick={() => setShowNotifications(!showNotifications)}
                      title="Notifications"
                    >
                      <Bell size={16} />
                      {unreadCount > 0 && (
                        <span style={{
                          position: 'absolute',
                          top: -4,
                          right: -4,
                          background: 'var(--danger)',
                          color: '#fff',
                          borderRadius: '9999px',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '1px 5px'
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-muted)',
                    border: '1.5px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: 'var(--primary)'
                  }}>
                    {currentUser.fullName.charAt(0)}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: 600, lineHeight: 1.1 }}>
                      {currentUser.fullName}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {currentUser.patientId || currentUser.role}
                    </span>
                  </div>
                </div>

                <button 
                  className="btn btn-outline btn-sm"
                  onClick={onLogout}
                  title="Sign Out"
                  style={{ color: 'var(--text-muted)' }}
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
                  Sign In
                </button>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => onOpenAuth('register')}
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
};
