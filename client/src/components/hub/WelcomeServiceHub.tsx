import React, { useState } from 'react';
import { User } from '../../types';
import { 
  Stethoscope, 
  Calendar, 
  Headphones, 
  ArrowRight, 
  Sparkles, 
  MessageSquare, 
  Heart, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';
import { FashionLogo } from '../common/FashionLogo';

interface WelcomeServiceHubProps {
  user: User;
  onSelectService: (service: 'doctors' | 'book-appointment' | 'support') => void;
  onOpenTokenWindow: () => void;
}

export const WelcomeServiceHub: React.FC<WelcomeServiceHubProps> = ({
  user,
  onSelectService,
  onOpenTokenWindow
}) => {
  const [hoveredService, setHoveredService] = useState<'doctors' | 'book-appointment' | 'support' | null>(null);
  const [robotGreeting, setRobotGreeting] = useState<string | null>(null);
  const [isSaluting, setIsSaluting] = useState(false);

  const patientFirstName = user.fullName ? user.fullName.split(' ')[0] : 'Patient';

  const speeches = {
    idle: `Hello ${patientFirstName}! 👋 I am Dr. AI, your clinical companion. Hover over any service below and I'll guide you through our hospital care services!`,
    doctors: `🩺 Describe your symptoms in plain words, and our Clinical AI will analyze probable conditions and recommend the best specialist doctor across our hospital network!`,
    'book-appointment': `📅 Directly browse all specialist doctors, view available morning and evening OPD consultation slots, and book your verified appointment!`,
    support: `🚨 Need immediate emergency medical care? Dispatch an ambulance with real-time GPS tracking, contact our 24/7 helpdesk, or find nearest open emergency rooms!`
  };

  const handleDoctorClick = () => {
    setIsSaluting(true);
    setRobotGreeting(`"Greetings, ${patientFirstName}! Dr. AI is fully online and ready. How may I optimize your hospital visit today?"`);
    setTimeout(() => {
      setIsSaluting(false);
    }, 1000);
    setTimeout(() => {
      setRobotGreeting(null);
    }, 4500);
  };

  const currentSpeech = robotGreeting || (hoveredService ? speeches[hoveredService] : speeches.idle);

  return (
    <div style={{
      maxWidth: '720px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '24px',
      animation: 'welcome-fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
      padding: '10px 16px 40px 16px'
    }}>
      {/* Welcome Greeting Header with Animated Fashionable Brand */}
      <div style={{ textAlign: 'center', maxWidth: '560px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ marginBottom: '8px' }}>
          <FashionLogo size="lg" animated={true} />
        </div>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          padding: '5px 16px',
          borderRadius: '9999px',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '10px'
        }}>
          <Sparkles size={14} color="#14b8a6" />
          <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Autonomous Healthcare Portal
          </span>
        </div>

        <h1 style={{
          fontSize: '2.3rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          margin: 0,
          fontFamily: 'var(--font-heading)',
          letterSpacing: '-0.02em',
          lineHeight: 1.2
        }}>
          Welcome, {user.fullName || 'Valued Patient'} 👋
        </h1>

        <p style={{
          fontSize: '1.02rem',
          fontWeight: 600,
          color: 'var(--text-secondary)',
          marginTop: '6px'
        }}>
          What service do you require today?
        </p>
      </div>

      {/* AI Animated Doctor Assistant with Holographic Stethoscope Core & Speech Bubble */}
      <div style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '560px',
        margin: '4px 0 10px 0'
      }}>
        {/* Dynamic Interactive Speech Bubble */}
        <div style={{
          background: 'var(--bg-card)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1.5px solid var(--primary-border)',
          borderRadius: '24px',
          padding: '16px 20px',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative',
          marginBottom: '20px',
          width: '100%',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #14b8a6, #06b6d4)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: '2px',
            boxShadow: '0 4px 10px rgba(20, 184, 166, 0.35)'
          }}>
            <MessageSquare size={16} />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                CareFlow AI Intelligent Concierge
              </span>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', animation: 'cf-pulse-glow 2s infinite' }} />
            </div>
            <p style={{
              fontSize: '0.92rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              lineHeight: 1.5,
              margin: 0,
              transition: 'all 0.25s ease'
            }}>
              {currentSpeech}
            </p>
          </div>

          {/* Speech Bubble Pointer Arrow */}
          <div style={{
            position: 'absolute',
            bottom: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: '10px solid var(--bg-card)'
          }} />
        </div>

        {/* Realistic 3D AI Robot Doctor Stage with Life-Like Animations */}
        <div className="cf-robot-doctor-stage">
          {/* Ambient Ground Pedestal Glow */}
          <div className="cf-robot-pedestal-glow" />

          {/* Synchronized Breathing Ground Shadow */}
          <div className="cf-robot-ground-shadow" />

          {/* Rotating Holographic Telemetry Floor Ring */}
          <div className="cf-robot-hologram-ring" />

          {/* 3D Lifelike Robot Doctor Body */}
          <div 
            className={`cf-robot-doctor-body ${isSaluting ? 'saluting' : ''}`}
            onClick={handleDoctorClick}
            title="Click Dr. AI for interactive clinical guidance!"
            style={{ 
              cursor: 'pointer',
              position: 'relative',
              width: '200px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            {/* Holographic scanner sheen passing across clipboard */}
            <div className="cf-robot-sheen-overlay">
              <div className="cf-robot-sheen-beam" />
            </div>

            {/* Glowing Heartbeat LED on D.9 badge */}
            <div className="cf-robot-chest-heartbeat" />

            {/* High-Resolution 3D Transparent Robot Doctor */}
            <img 
              src="/assets/ai_robot_doctor_transparent.png" 
              alt="AI Robot Doctor"
              style={{
                width: '190px',
                height: 'auto',
                display: 'block',
                filter: 'drop-shadow(0 12px 24px rgba(13, 148, 136, 0.35))',
                transform: hoveredService === 'doctors' 
                  ? 'rotate(-2.5deg) scale(1.04)' 
                  : hoveredService === 'book-appointment'
                  ? 'rotate(2.5deg) scale(1.04)'
                  : hoveredService === 'support'
                  ? 'scale(1.06)'
                  : 'none',
                transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src.indexOf('ai_robot_doctor.png') === -1) {
                  target.src = '/assets/ai_robot_doctor.png';
                }
              }}
            />
          </div>

          {/* Autonomous Medical AI Status Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            marginTop: '10px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            padding: '4px 14px',
            borderRadius: '9999px',
            boxShadow: 'var(--shadow-sm)',
            zIndex: 4
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', animation: 'cf-pulse-glow 2s infinite' }} />
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Dr. AI Clinical Concierge Online
            </span>
          </div>
        </div>
      </div>

      {/* The 3 Core Options */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        width: '100%'
      }}>
        {/* Option 1: DOCTORS */}
        <div 
          className="card"
          style={{
            padding: '22px 16px',
            textAlign: 'center',
            cursor: 'pointer',
            borderRadius: '26px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: hoveredService === 'doctors' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
            transform: hoveredService === 'doctors' ? 'translateY(-6px) scale(1.02)' : 'translateY(0)',
            boxShadow: hoveredService === 'doctors' ? '0 20px 35px -8px rgba(20, 184, 166, 0.35)' : 'var(--shadow-md)',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onMouseEnter={() => setHoveredService('doctors')}
          onMouseLeave={() => setHoveredService(null)}
          onClick={() => onSelectService('doctors')}
        >
          <div style={{
            width: '58px',
            height: '58px',
            borderRadius: '50%',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '14px',
            boxShadow: '0 6px 14px rgba(20, 184, 166, 0.2)'
          }}>
            <Stethoscope size={28} />
          </div>

          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
              Doctors
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
              AI Clinical Diagnosis &amp; Specialist Recommendation
            </p>
          </div>

          <div style={{
            marginTop: '16px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: 'var(--primary)'
          }}>
            <span>Find Specialist</span>
            <ArrowRight size={14} />
          </div>
        </div>

        {/* Option 2: BOOK APPOINTMENT */}
        <div 
          className="card"
          style={{
            padding: '22px 16px',
            textAlign: 'center',
            cursor: 'pointer',
            borderRadius: '26px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: hoveredService === 'book-appointment' ? '2px solid var(--secondary)' : '1px solid var(--border-color)',
            transform: hoveredService === 'book-appointment' ? 'translateY(-6px) scale(1.02)' : 'translateY(0)',
            boxShadow: hoveredService === 'book-appointment' ? '0 20px 35px -8px rgba(56, 189, 248, 0.35)' : 'var(--shadow-md)',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onMouseEnter={() => setHoveredService('book-appointment')}
          onMouseLeave={() => setHoveredService(null)}
          onClick={() => onSelectService('book-appointment')}
        >
          <div style={{
            width: '58px',
            height: '58px',
            borderRadius: '50%',
            background: 'var(--secondary-light)',
            color: 'var(--secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '14px',
            boxShadow: '0 6px 14px rgba(56, 189, 248, 0.2)'
          }}>
            <Calendar size={28} />
          </div>

          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
              Book Appt
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
              Doctor OPD Schedules &amp; Immediate Time Slots
            </p>
          </div>

          <div style={{
            marginTop: '16px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: 'var(--secondary)'
          }}>
            <span>Choose Slot</span>
            <ArrowRight size={14} />
          </div>
        </div>

        {/* Option 3: 24/7 CUSTOMER SERVICE */}
        <div 
          className="card"
          style={{
            padding: '22px 16px',
            textAlign: 'center',
            cursor: 'pointer',
            borderRadius: '26px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: hoveredService === 'support' ? '2px solid var(--danger)' : '1px solid var(--border-color)',
            transform: hoveredService === 'support' ? 'translateY(-6px) scale(1.02)' : 'translateY(0)',
            boxShadow: hoveredService === 'support' ? '0 20px 35px -8px rgba(244, 63, 94, 0.35)' : 'var(--shadow-md)',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onMouseEnter={() => setHoveredService('support')}
          onMouseLeave={() => setHoveredService(null)}
          onClick={() => onSelectService('support')}
        >
          <div style={{
            width: '58px',
            height: '58px',
            borderRadius: '50%',
            background: 'var(--danger-bg)',
            color: 'var(--danger)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '14px',
            boxShadow: '0 6px 14px rgba(244, 63, 94, 0.2)'
          }}>
            <Headphones size={28} />
          </div>

          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
              24/7 Support
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
              Emergency Ambulance, Hotline &amp; Hospital Care
            </p>
          </div>

          <div style={{
            marginTop: '16px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: 'var(--danger)'
          }}>
            <span>Emergency Care</span>
            <ArrowRight size={14} />
          </div>
        </div>
      </div>

      {/* Quick Access to Active Token Banner */}
      <div 
        className="card"
        style={{
          width: '100%',
          padding: '14px 20px',
          borderRadius: '20px',
          background: 'var(--primary-light)',
          border: '1px solid var(--primary-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer'
        }}
        onClick={onOpenTokenWindow}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--primary)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.86rem'
          }}>
            #
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase' }}>
              Active Token &amp; Assigned Doctor
            </span>
            <span style={{ fontSize: '0.86rem', color: 'var(--text-primary)', fontWeight: 700, display: 'block' }}>
              Click here or tap the CareFlow logo anytime to view your live token
            </span>
          </div>
        </div>

        <span className="badge badge-primary" style={{ padding: '6px 14px', fontSize: '0.78rem' }}>
          View Token &rarr;
        </span>
      </div>
    </div>
  );
};
