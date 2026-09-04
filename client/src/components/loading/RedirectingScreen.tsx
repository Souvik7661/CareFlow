import React, { useEffect, useState } from 'react';
import { Stethoscope, Calendar, Headphones, Loader2, Sparkles } from 'lucide-react';

interface RedirectingScreenProps {
  targetService: 'doctors' | 'book-appointment' | 'support';
  onComplete: () => void;
}

export const RedirectingScreen: React.FC<RedirectingScreenProps> = ({
  targetService,
  onComplete
}) => {
  const [fadingOut, setFadingOut] = useState(false);

  const meta = {
    'doctors': {
      title: 'Doctors & AI Recommendation',
      subtext: 'Loading AI Clinical Analysis & Specialist Recommendation Engine...',
      icon: <Stethoscope size={32} color="#0d9488" />
    },
    'book-appointment': {
      title: 'Book Appointment',
      subtext: 'Fetching Real-Time Specialist Availability & Available Time Slots...',
      icon: <Calendar size={32} color="#0284c7" />
    },
    'support': {
      title: '24/7 Customer Service',
      subtext: 'Connecting to 24/7 Emergency Dispatch, Live Ambulance & Support Hotline...',
      icon: <Headphones size={32} color="#f43f5e" />
    }
  }[targetService];

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFadingOut(true);
    }, 1700);

    const finishTimer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(244, 251, 249, 0.88)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9000,
      opacity: fadingOut ? 0 : 1,
      transition: 'opacity 0.3s ease',
      padding: '24px'
    }}>
      <div className="card" style={{
        maxWidth: '460px',
        width: '100%',
        padding: '36px 28px',
        textAlign: 'center',
        borderRadius: '28px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0 25px 60px -15px rgba(13, 148, 136, 0.25)',
        animation: 'splash-pop 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Animated Service Icon Ring */}
        <div style={{
          width: '76px',
          height: '76px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.95)',
          boxShadow: '0 8px 25px rgba(13, 148, 136, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          marginBottom: '20px'
        }}>
          {meta.icon}

          <div style={{
            position: 'absolute',
            inset: '-6px',
            borderRadius: '50%',
            border: '2px dashed #0d9488',
            animation: 'spin 4s linear infinite'
          }} />
        </div>

        {/* Primary Redirect Text */}
        <span style={{
          fontSize: '0.84rem',
          fontWeight: 800,
          color: '#0d9488',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: '6px'
        }}>
          Redirecting to your requirement
        </span>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0' }}>
          {meta.title}
        </h2>

        <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
          {meta.subtext}
        </p>

        {/* 2-Second Progress Line */}
        <div style={{
          marginTop: '28px',
          width: '100%',
          height: '6px',
          background: '#f1f5f9',
          borderRadius: '9999px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, #14b8a6, #0d9488)',
            animation: 'splash-progress 2s linear forwards'
          }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', color: '#94a3b8', fontSize: '0.78rem' }}>
          <Loader2 size={14} className="spin-slow" />
          <span>Please wait 2 seconds...</span>
        </div>
      </div>
    </div>
  );
};
