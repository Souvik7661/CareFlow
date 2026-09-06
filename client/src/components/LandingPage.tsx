import React from 'react';
import { 
  Heart, 
  ArrowRight, 
  Stethoscope, 
  Calendar, 
  Headphones, 
  Plus, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  Layers, 
  Clock 
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onRoleSwitch: (role: string, doctorId?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onLogin,
  onRoleSwitch
}) => {
  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Top Header Icons matching Blueprint Screen 1 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.95)',
          boxShadow: '0 4px 14px rgba(13, 148, 136, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#0d9488'
        }}>
          <Heart size={20} fill="#0d9488" />
        </div>

        <button 
          className="btn btn-outline btn-sm"
          onClick={onLogin}
          style={{ fontSize: '0.8rem', padding: '6px 16px', borderRadius: '9999px' }}
        >
          Sign In
        </button>
      </div>

      {/* Main Headline & Subtitle matching Blueprint Screen 1 */}
      <div>
        <h1 style={{
          fontSize: '2.6rem',
          fontWeight: 800,
          lineHeight: 1.15,
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-heading)',
          letterSpacing: '-0.02em',
          margin: 0
        }}>
          Your Health<br />Our Priority
        </h1>
        <p style={{
          fontSize: '0.98rem',
          color: 'var(--text-secondary)',
          marginTop: '10px',
          lineHeight: 1.5,
          maxWidth: '440px'
        }}>
          Advanced healthcare for a better and healthier you. Instant AI triage, specialist matching, and optimized queue flow.
        </p>

        {/* CTA Button matching Blueprint Screen 1 */}
        <div style={{ marginTop: '18px' }}>
          <button
            className="btn btn-primary btn-lg"
            style={{
              padding: '12px 26px',
              fontSize: '0.96rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px'
            }}
            onClick={onGetStarted}
          >
            <span>Get Started</span>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ArrowRight size={14} />
            </div>
          </button>
        </div>
      </div>

      {/* 3D Doctor Hero Section with Pedestal matching Blueprint Screen 1 */}
      <div style={{
        position: 'relative',
        height: '260px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        margin: '10px 0 10px 0'
      }}>
        {/* Cylinder Pedestal Base */}
        <div style={{
          position: 'absolute',
          bottom: '0',
          width: '230px',
          height: '50px',
          borderRadius: '50%',
          background: 'linear-gradient(180deg, #d1fae5 0%, #a7f3d0 100%)',
          boxShadow: '0 16px 32px rgba(13, 148, 136, 0.22), inset 0 2px 4px rgba(255, 255, 255, 0.8)'
        }} />

        {/* 3D Doctor Character SVG Vector */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          width: '210px',
          height: '230px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg viewBox="0 0 180 200" width="210" height="230">
            <circle cx="90" cy="55" r="28" fill="#fbcfe8" />
            <path d="M64 50 Q90 22 116 50 Q118 36 90 32 Q64 36 64 50 Z" fill="#1e293b" />
            <circle cx="81" cy="55" r="2.5" fill="#1e293b" />
            <circle cx="99" cy="55" r="2.5" fill="#1e293b" />
            <path d="M84 64 Q90 70 96 64" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
            <rect x="85" y="80" width="10" height="15" fill="#fbcfe8" />
            <polygon points="90,85 86,115 90,125 94,115" fill="#0d9488" />
            <path d="M52 95 Q90 85 128 95 L138 185 Q90 190 42 185 Z" fill="#ffffff" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.06))" />
            <polygon points="90,85 78,110 90,110" fill="#e0f2fe" />
            <polygon points="90,85 102,110 90,110" fill="#e0f2fe" />
            <path d="M72 96 Q70 140 90 148 Q110 140 108 96" fill="none" stroke="#0f766e" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="90" cy="154" r="6" fill="#38bdf8" stroke="#0f766e" strokeWidth="2" />
            <path d="M48 115 Q90 135 132 115 Q135 145 90 152 Q45 145 48 115 Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
          </svg>
        </div>

        {/* Floating "Trusted by 2M+ Users" Card matching Blueprint Screen 1 */}
        <div className="card" style={{
          position: 'absolute',
          bottom: '16px',
          right: '8px',
          zIndex: 4,
          padding: '10px 14px',
          borderRadius: '18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          boxShadow: '0 10px 25px rgba(15, 118, 110, 0.16)'
        }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Trusted by</span>
          <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 800 }}>2M+ Users</strong>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '2px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#38bdf8', color: '#fff', fontSize: '0.64rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid #fff' }}>S</div>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#10b981', color: '#fff', fontSize: '0.64rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid #fff', marginLeft: '-6px' }}>M</div>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#f59e0b', color: '#fff', fontSize: '0.64rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid #fff', marginLeft: '-6px' }}>A</div>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#0d9488', color: '#fff', fontSize: '0.7rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid #fff', marginLeft: '-6px' }}>
              <Plus size={12} />
            </div>
          </div>
        </div>
      </div>

      {/* 3 Rounded Feature Action Cards matching Blueprint Screen 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        <button 
          className="card" 
          style={{ padding: '16px 8px', textAlign: 'center', cursor: 'pointer', borderRadius: '22px' }}
          onClick={onGetStarted}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'rgba(13, 148, 136, 0.12)',
            color: '#0d9488',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 8px auto'
          }}>
            <Stethoscope size={20} />
          </div>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block' }}>
            Find Doctors
          </span>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>AI Specialist Triage</span>
        </button>

        <button 
          className="card" 
          style={{ padding: '16px 8px', textAlign: 'center', cursor: 'pointer', borderRadius: '22px' }}
          onClick={onGetStarted}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'rgba(6, 182, 212, 0.12)',
            color: '#06b6d4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 8px auto'
          }}>
            <Calendar size={20} />
          </div>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block' }}>
            Book Appt
          </span>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Smart Time Slots</span>
        </button>

        <button 
          className="card" 
          style={{ padding: '16px 8px', textAlign: 'center', cursor: 'pointer', borderRadius: '22px' }}
          onClick={onLogin}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'rgba(244, 63, 94, 0.12)',
            color: '#f43f5e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 8px auto'
          }}>
            <Headphones size={20} />
          </div>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block' }}>
            24/7 Support
          </span>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Emergency &amp; Care</span>
        </button>
      </div>

      {/* Role Sandbox Pills for Fast Review */}
      <div className="card" style={{ padding: '14px 18px', borderRadius: '20px' }}>
        <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Interactive Role Sandbox
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
          <button 
            className="btn btn-sm btn-outline" 
            onClick={() => onRoleSwitch('PATIENT')}
            style={{ fontSize: '0.78rem' }}
          >
            👤 Patient (Alex)
          </button>
          <button 
            className="btn btn-sm btn-outline" 
            onClick={() => onRoleSwitch('DOCTOR', 'DOC-01')}
            style={{ fontSize: '0.78rem' }}
          >
            🩺 Doctor (Dr. Rahul Mehta)
          </button>
          <button 
            className="btn btn-sm btn-outline" 
            onClick={() => onRoleSwitch('RECEPTIONIST')}
            style={{ fontSize: '0.78rem' }}
          >
            📋 Receptionist
          </button>
          <button 
            className="btn btn-sm btn-outline" 
            onClick={() => onRoleSwitch('ADMIN')}
            style={{ fontSize: '0.78rem' }}
          >
            ⚡ Hospital Admin
          </button>
        </div>
      </div>
    </div>
  );
};
