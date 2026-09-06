import React, { useState, useEffect } from 'react';
import { User, Appointment, LiveQueueStatus } from '../../types';
import { api } from '../../services/api';
import { 
  Menu, 
  Bell, 
  Search, 
  Heart, 
  Activity, 
  Droplet, 
  ChevronRight, 
  FlaskConical, 
  Pill, 
  FileText, 
  AlertTriangle, 
  Home, 
  Calendar, 
  FileCheck, 
  User as UserIcon, 
  Plus, 
  Clock, 
  Stethoscope, 
  MapPin, 
  Sparkles 
} from 'lucide-react';

interface PatientDashboardProps {
  user: User;
  onNavigate: (view: string) => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  user,
  onNavigate
}) => {
  const [upcomingApt, setUpcomingApt] = useState<Appointment | null>(null);
  const [queueStatus, setQueueStatus] = useState<LiveQueueStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user.patientId) {
      Promise.all([
        api.getMyAppointments(user.patientId),
        api.getPatientQueueStatus(user.patientId)
      ]).then(([aptRes, qRes]) => {
        const valid = (aptRes.appointments || []).find(
          a => a.status === 'BOOKED' || a.status === 'CHECKED_IN' || a.status === 'IN_CONSULTATION'
        );
        setUpcomingApt(valid || null);
        setQueueStatus(qRes);
      }).catch(err => {
        console.error('Error fetching dashboard data:', err);
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [user.patientId]);

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header matching Blueprint Screen 2 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button 
          className="apple-circle-action-btn"
          onClick={() => onNavigate('disease-catalog')}
          title="Browse Specialties"
        >
          <Menu size={18} />
        </button>

        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
            Dashboard
          </h1>
          <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Good Morning, {user.fullName?.split(' ')[0] || 'Alex'} 👋
          </span>
        </div>

        <div style={{ position: 'relative' }}>
          <button 
            className="apple-circle-action-btn"
            onClick={() => onNavigate('my-appointments')}
            title="Notifications"
          >
            <Bell size={18} />
          </button>
          <span style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#f43f5e',
            border: '1.5px solid #ffffff'
          }} />
        </div>
      </div>

      {/* Soft Neumorphic Inset Search Bar matching Blueprint Screen 2 */}
      <div 
        className="apple-search-bar" 
        style={{ cursor: 'pointer', padding: '12px 18px' }}
        onClick={() => onNavigate('find-doctors')}
      >
        <Search size={17} color="#94a3b8" />
        <input 
          type="text" 
          className="apple-search-input" 
          placeholder="Search doctors, services..." 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          readOnly
        />
      </div>

      {/* Health Overview Section matching Blueprint Screen 2 */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Health Overview
          </h3>
          <button 
            style={{ background: 'none', border: 'none', fontSize: '0.8rem', fontWeight: 700, color: '#0d9488', cursor: 'pointer' }}
            onClick={() => onNavigate('health-status')}
          >
            View All
          </button>
        </div>

        {/* 3D Heart Card with Live Animated ECG Wave */}
        <div className="card" style={{ padding: '18px 20px', borderRadius: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {/* 3D Heart Graphic */}
              <div className="heart-pulse-3d" style={{
                width: '48px',
                height: '48px',
                borderRadius: '16px',
                background: 'radial-gradient(circle at 35% 35%, #ff708f, #f43f5e 65%, #be123c)',
                boxShadow: '0 10px 22px rgba(244, 63, 94, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}>
                <Heart size={26} fill="#ffffff" />
              </div>

              <div>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block' }}>Heart Rate</span>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
                  72 <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)' }}>bpm</span>
                </div>
              </div>
            </div>

            {/* Live ECG Wave Graphic */}
            <div style={{ width: '120px', height: '36px' }}>
              <svg viewBox="0 0 120 36" width="120" height="36">
                <path 
                  className="live-ecg-path"
                  d="M 0 18 L 25 18 L 32 28 L 40 4 L 48 32 L 56 12 L 64 18 L 120 18" 
                  fill="none" 
                  stroke="#f43f5e" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Dual Sub-Cards: Blood Pressure & Blood Sugar */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
          <div className="card" style={{ padding: '14px 16px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(13, 148, 136, 0.12)', color: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity size={14} />
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Blood Pressure</span>
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '8px' }}>
              120/80 <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>mmHg</span>
            </div>
          </div>

          <div className="card" style={{ padding: '14px 16px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(6, 182, 212, 0.12)', color: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Droplet size={14} />
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Blood Sugar</span>
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '8px' }}>
              98 <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>mg/dL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Appointment Section matching Blueprint Screen 2 */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Upcoming Appointment
          </h3>
          <button 
            style={{ background: 'none', border: 'none', fontSize: '0.8rem', fontWeight: 700, color: '#0d9488', cursor: 'pointer' }}
            onClick={() => onNavigate('my-appointments')}
          >
            View All
          </button>
        </div>

        <div 
          className="card" 
          style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderRadius: '20px' }}
          onClick={() => upcomingApt ? onNavigate('live-queue') : onNavigate('find-doctors')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0d9488, #0f766e)',
              color: '#fff',
              fontSize: '1.2rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(13, 148, 136, 0.25)'
            }}>
              {upcomingApt?.doctor_name ? upcomingApt.doctor_name.replace('Dr. ', '').charAt(0) : 'S'}
            </div>

            <div>
              <h4 style={{ fontSize: '0.96rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                {upcomingApt?.doctor_name || 'Dr. Sarah Johnson'}
              </h4>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {upcomingApt?.department_name || 'Cardiologist'} &bull; Room {upcomingApt?.room_no || '204'}
              </span>
              <div style={{ fontSize: '0.76rem', color: '#0d9488', fontWeight: 700, marginTop: '3px' }}>
                {upcomingApt?.appointment_date ? `${upcomingApt.appointment_date} • ${upcomingApt.appointment_time}` : '28 May 2024 • 10:30 AM'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {upcomingApt?.token_number && (
              <span className="badge badge-success" style={{ fontWeight: 800 }}>
                {upcomingApt.token_number}
              </span>
            )}
            <ChevronRight size={20} color="#94a3b8" />
          </div>
        </div>
      </div>

      {/* Quick Actions Grid matching Blueprint Screen 2 */}
      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 10px 0' }}>
          Quick Actions
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          <button 
            className="card" 
            style={{ padding: '14px 6px', textAlign: 'center', cursor: 'pointer', borderRadius: '20px' }}
            onClick={() => onNavigate('find-doctor')}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(13, 148, 136, 0.12)', color: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px auto' }}>
              <FlaskConical size={18} />
            </div>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-primary)' }}>Lab Test</span>
          </button>

          <button 
            className="card" 
            style={{ padding: '14px 6px', textAlign: 'center', cursor: 'pointer', borderRadius: '20px' }}
            onClick={() => onNavigate('medical-history')}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.12)', color: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px auto' }}>
              <Pill size={18} />
            </div>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-primary)' }}>Medicines</span>
          </button>

          <button 
            className="card" 
            style={{ padding: '14px 6px', textAlign: 'center', cursor: 'pointer', borderRadius: '20px' }}
            onClick={() => onNavigate('medical-history')}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.12)', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px auto' }}>
              <FileText size={18} />
            </div>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-primary)' }}>Reports</span>
          </button>

          <button 
            className="card" 
            style={{ padding: '14px 6px', textAlign: 'center', cursor: 'pointer', borderRadius: '20px' }}
            onClick={() => onNavigate('ambulance')}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px auto' }}>
              <AlertTriangle size={18} />
            </div>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#ef4444' }}>Emergency</span>
          </button>
        </div>
      </div>

      {/* Floating Bottom Navigation Dock matching Reference Blueprint */}
      <div 
        className="apple-bottom-dock" 
        style={{
          position: 'fixed',
          bottom: '18px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 32px)',
          maxWidth: '520px',
        }}
      >
        <button 
          className="apple-dock-item active" 
          onClick={() => onNavigate('dashboard')}
          style={{ color: '#0d9488' }}
        >
          <Home size={20} />
          <span style={{ fontSize: '0.66rem', fontWeight: 700 }}>Home</span>
        </button>

        <button 
          className="apple-dock-item" 
          onClick={() => onNavigate('my-appointments')}
        >
          <Calendar size={20} />
          <span style={{ fontSize: '0.66rem', fontWeight: 600 }}>Appointments</span>
        </button>

        <button 
          className="apple-dock-center-btn" 
          onClick={() => onNavigate('find-doctor')}
          title="Find Doctor (AI Triage)"
        >
          <Plus size={24} strokeWidth={2.5} />
        </button>

        <button 
          className="apple-dock-item" 
          onClick={() => onNavigate('medical-history')}
        >
          <FileCheck size={20} />
          <span style={{ fontSize: '0.66rem', fontWeight: 600 }}>Records</span>
        </button>

        <button 
          className="apple-dock-item" 
          onClick={() => onNavigate('health-status')}
        >
          <UserIcon size={20} />
          <span style={{ fontSize: '0.66rem', fontWeight: 600 }}>Profile</span>
        </button>
      </div>
    </div>
  );
};
