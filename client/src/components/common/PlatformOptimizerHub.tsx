import React, { useState, useEffect } from 'react';
import { platform, SupportedOS } from '../../platforms/PlatformDetector';

interface PlatformOptimizerHubProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateService?: (service: 'doctors' | 'book-appointment' | 'support') => void;
}

export const PlatformOptimizerHub: React.FC<PlatformOptimizerHubProps> = ({
  isOpen,
  onClose,
  onNavigateService
}) => {
  const [activeOS, setActiveOS] = useState<SupportedOS>(platform.getActiveOS());
  const [detectedOS] = useState<SupportedOS>(platform.getDetectedOS());
  const [isOverride, setIsOverride] = useState<boolean>(Boolean(localStorage.getItem('careflow_override_os')));
  const [hapticTriggered, setHapticTriggered] = useState<string | null>(null);

  useEffect(() => {
    setActiveOS(platform.getActiveOS());
    setIsOverride(Boolean(localStorage.getItem('careflow_override_os')));
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectOS = (os: SupportedOS | 'auto') => {
    if (os === 'auto') {
      platform.setOSOverride(null);
      setActiveOS(platform.getDetectedOS());
      setIsOverride(false);
    } else {
      platform.setOSOverride(os);
      setActiveOS(os);
      setIsOverride(true);
    }
    platform.triggerHaptic('medium');
    setHapticTriggered(`Switched active profile to ${os.toUpperCase()}`);
    setTimeout(() => setHapticTriggered(null), 2500);
  };

  const handleTestHaptic = () => {
    platform.triggerHaptic('success');
    setHapticTriggered('Haptic pulse sent! Tactile feedback confirmed.');
    setTimeout(() => setHapticTriggered(null), 2000);
  };

  const osInfo = platform.getOSInfo();

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(3, 7, 18, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.25s ease'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '92vh',
          overflowY: 'auto',
          backgroundColor: 'var(--bg-card)',
          borderRadius: '24px',
          border: '1px solid var(--border-color)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.6), 0 0 35px rgba(13, 148, 136, 0.18)',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '28px' }}>⚡</span>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  CareFlow Cross-Platform Optimizer
                </h2>
                <p style={{ fontSize: '13px', margin: '2px 0 0 0', color: 'var(--text-muted)' }}>
                  Native OS adaptation & single-file launchers for Android, iOS, Windows, and macOS
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'var(--bg-muted)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              fontSize: '18px'
            }}
          >
            ✕
          </button>
        </div>

        {/* Live OS Preview Selector */}
        <div
          style={{
            background: 'var(--bg-muted)',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            border: '1px solid var(--border-color)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--primary)' }}>
              Live OS Environment Engine
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Detected Hardware: <strong>{detectedOS.toUpperCase()}</strong>
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
            <button
              onClick={() => handleSelectOS('auto')}
              style={{
                padding: '10px 14px',
                borderRadius: '12px',
                border: !isOverride ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                backgroundColor: !isOverride ? 'var(--primary-light)' : 'var(--bg-card)',
                color: !isOverride ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <span>🧭</span> Auto Detect
            </button>

            <button
              onClick={() => handleSelectOS('android')}
              style={{
                padding: '10px 14px',
                borderRadius: '12px',
                border: activeOS === 'android' && isOverride ? '2px solid #10b981' : '1px solid var(--border-color)',
                backgroundColor: activeOS === 'android' ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-card)',
                color: activeOS === 'android' ? '#10b981' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <span>🤖</span> Android
            </button>

            <button
              onClick={() => handleSelectOS('ios')}
              style={{
                padding: '10px 14px',
                borderRadius: '12px',
                border: activeOS === 'ios' && isOverride ? '2px solid #38bdf8' : '1px solid var(--border-color)',
                backgroundColor: activeOS === 'ios' ? 'rgba(56, 189, 248, 0.12)' : 'var(--bg-card)',
                color: activeOS === 'ios' ? '#0284c7' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <span>📱</span> Apple iOS
            </button>

            <button
              onClick={() => handleSelectOS('windows')}
              style={{
                padding: '10px 14px',
                borderRadius: '12px',
                border: activeOS === 'windows' && isOverride ? '2px solid #0d9488' : '1px solid var(--border-color)',
                backgroundColor: activeOS === 'windows' ? 'rgba(13, 148, 136, 0.12)' : 'var(--bg-card)',
                color: activeOS === 'windows' ? '#0d9488' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <span>🪟</span> Windows 11
            </button>

            <button
              onClick={() => handleSelectOS('mac')}
              style={{
                padding: '10px 14px',
                borderRadius: '12px',
                border: activeOS === 'mac' && isOverride ? '2px solid #8b5cf6' : '1px solid var(--border-color)',
                backgroundColor: activeOS === 'mac' ? 'rgba(139, 92, 246, 0.12)' : 'var(--bg-card)',
                color: activeOS === 'mac' ? '#8b5cf6' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <span>🍎</span> macOS
            </button>
          </div>

          {hapticTriggered && (
            <div
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                backgroundColor: 'var(--success-bg)',
                color: 'var(--success)',
                fontSize: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>✓</span> {hapticTriggered}
            </div>
          )}
        </div>

        {/* Active OS Capabilities Breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div
            style={{
              padding: '18px',
              borderRadius: '16px',
              backgroundColor: 'var(--bg-muted)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '24px' }}>{osInfo.icon}</span>
              <div>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {osInfo.name} Active Features
                </h4>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{osInfo.shortcutLabel}</span>
              </div>
            </div>

            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {osInfo.features.map((feat, idx) => (
                <li key={idx}>{feat}</li>
              ))}
            </ul>

            <button
              onClick={handleTestHaptic}
              style={{
                marginTop: '6px',
                padding: '8px 14px',
                borderRadius: '10px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <span>📳</span> Test Native Haptic Pulse
            </button>
          </div>

          {/* Quick Shortcuts & Navigation */}
          <div
            style={{
              padding: '18px',
              borderRadius: '16px',
              backgroundColor: 'var(--bg-muted)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
              ⌨️ Platform Keyboard & Touch Shortcuts
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: 'var(--bg-card)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Find Doctors / AI Match</span>
                <kbd style={{ background: 'var(--bg-muted)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-color)', fontWeight: 700 }}>
                  {activeOS === 'mac' ? '⌘ + K' : 'Ctrl + K'}
                </kbd>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: 'var(--bg-card)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Direct Appointment Booking</span>
                <kbd style={{ background: 'var(--bg-muted)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-color)', fontWeight: 700 }}>
                  {activeOS === 'mac' ? '⌘ + B' : 'Ctrl + B'}
                </kbd>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: 'var(--bg-card)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>24/7 Emergency Support</span>
                <kbd style={{ background: 'var(--bg-muted)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-color)', fontWeight: 700 }}>
                  {activeOS === 'mac' ? '⌘ + E' : 'Ctrl + E'}
                </kbd>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: 'var(--bg-card)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Android Hardware Back</span>
                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Supported via PopState</span>
              </div>
            </div>
          </div>
        </div>

        {/* Specific Single Files for Each OS */}
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 12px 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📦</span> Specific Single Files for Each Operating System
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            {/* Android File */}
            <a
              href="/careflow-android.html"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: 'none',
                padding: '14px',
                borderRadius: '14px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                transition: 'transform 0.2s ease, border-color 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>🤖</span>
                <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>Android Single File</strong>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                careflow-android.html + PWA manifest
              </span>
              <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 700, marginTop: 'auto' }}>
                Launch / View File →
              </span>
            </a>

            {/* iOS File */}
            <a
              href="/careflow-ios.html"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: 'none',
                padding: '14px',
                borderRadius: '14px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                transition: 'transform 0.2s ease, border-color 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>📱</span>
                <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>iOS Single File</strong>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                careflow-ios.html + WebClip profile
              </span>
              <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 700, marginTop: 'auto' }}>
                Launch / View File →
              </span>
            </a>

            {/* Windows File */}
            <a
              href="/careflow-windows.html"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: 'none',
                padding: '14px',
                borderRadius: '14px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                transition: 'transform 0.2s ease, border-color 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>🪟</span>
                <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>Windows Single File</strong>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                careflow-windows.html + .bat runner
              </span>
              <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 700, marginTop: 'auto' }}>
                Launch / View File →
              </span>
            </a>

            {/* macOS File */}
            <a
              href="/careflow-mac.html"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: 'none',
                padding: '14px',
                borderRadius: '14px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                transition: 'transform 0.2s ease, border-color 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>🍎</span>
                <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>macOS Single File</strong>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                careflow-mac.html + .command script
              </span>
              <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 700, marginTop: 'auto' }}>
                Launch / View File →
              </span>
            </a>
          </div>
        </div>

        {/* Footer actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              borderRadius: '12px',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Apply &amp; Continue
          </button>
        </div>
      </div>
    </div>
  );
};
