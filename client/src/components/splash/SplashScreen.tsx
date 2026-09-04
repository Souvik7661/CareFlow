import React, { useEffect, useState } from 'react';
import { FashionLogo } from '../common/FashionLogo';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade out at 1.7s, finish at 2.0s
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 1700);

    const finishTimer = setTimeout(() => {
      onFinish();
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'radial-gradient(circle at 50% 45%, var(--bg-card) 0%, var(--bg-main) 60%, var(--primary-light) 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      opacity: fadeOut ? 0 : 1,
      transform: fadeOut ? 'scale(1.04)' : 'scale(1)',
      transition: 'opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
      pointerEvents: fadeOut ? 'none' : 'auto'
    }}>
      {/* Animated Logo Container */}
      <div style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        animation: 'splash-pop 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Glowing Aura Ring */}
        <div style={{
          position: 'absolute',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(20, 184, 166, 0.35) 0%, rgba(6, 182, 212, 0.12) 50%, transparent 75%)',
          animation: 'splash-pulse 2s infinite ease-in-out',
          zIndex: 1
        }} />

        {/* Official Animated Brand Logo */}
        <div style={{ position: 'relative', zIndex: 2, transform: 'scale(1.05)', marginBottom: '16px' }}>
          <FashionLogo size="xl" animated={true} />
        </div>

        <p style={{
          fontSize: '0.92rem',
          color: 'var(--text-secondary)',
          marginTop: '10px',
          fontWeight: 500,
          letterSpacing: '0.01em',
          position: 'relative',
          zIndex: 2
        }}>
          Intelligent Clinical Queue &amp; Care Optimization
        </p>

        {/* 2-Second Progress Bar */}
        <div style={{
          marginTop: '28px',
          width: '200px',
          height: '4px',
          background: 'var(--border-color)',
          borderRadius: '9999px',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 2
        }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, #14b8a6, #06b6d4)',
            animation: 'splash-progress 2s linear forwards'
          }} />
        </div>

        <span style={{
          marginTop: '12px',
          fontSize: '0.78rem',
          fontWeight: 700,
          color: 'var(--primary)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          position: 'relative',
          zIndex: 2
        }}>
          Initializing Autonomous Clinical Engine...
        </span>
      </div>
    </div>
  );
};
