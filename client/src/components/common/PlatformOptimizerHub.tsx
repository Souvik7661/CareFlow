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

        {/* Native Platform Installers & Extensions */}
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 12px 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📦</span> Official Platform Native Installers &amp; Packages
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {/* Android Package */}
            <a
              href="/downloads/CareFlow.apk"
              download="CareFlow.apk"
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#3DDC84">
                    <path d="M17.523 15.341c-.551 0-1-.448-1-1 0-.551.449-1 1-1 .552 0 1 .449 1 1 0 .552-.448 1-1 1zm-11.046 0c-.551 0-1-.448-1-1 0-.551.449-1 1-1 .552 0 1 .449 1 1 0 .552-.448 1-1 1zm11.405-6.02l1.997-3.46a.416.416 0 00-.152-.567.416.416 0 00-.568.152l-2.023 3.504C15.59 8.358 13.853 8 12 8s-3.59.358-5.136.95L4.841 5.446a.417.417 0 00-.569-.152.416.416 0 00-.151.567l1.997 3.46C2.688 11.286 0 15.338 0 20h24c0-4.662-2.688-8.714-6.118-10.679z" />
                  </svg>
                  <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>Android Package</strong>
                </div>
                <span className="badge badge-primary" style={{ fontSize: '10px', padding: '2px 6px' }}>.APK</span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                CareFlow.apk • Full offline package with haptics
              </span>
              <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 700, marginTop: 'auto' }}>
                Download .APK Package ↓
              </span>
            </a>

            {/* Apple iOS Profile / IPA */}
            <a
              href="/downloads/CareFlow-Apple-iOS.mobileconfig"
              download="CareFlow-Apple-iOS.mobileconfig"
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="20" height="20" viewBox="0 0 170 170" fill="currentColor">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.6-7.83-11.72-14.36-5.83-9.15-10.37-19.46-13.62-29.93-3.25-10.47-4.88-20.48-4.88-30.04 0-14.93 3.65-27.24 10.96-36.93 7.31-9.69 16.7-14.67 28.18-14.94 4.58 0 9.8 1.16 15.65 3.49 5.86 2.33 9.47 3.55 10.85 3.66 1.83-.24 5.63-1.57 11.41-3.99 5.78-2.43 10.74-3.52 14.88-3.29 11.9.84 21.36 5.3 28.38 13.38-10.47 6.33-15.59 15.11-15.35 26.33.24 8.79 3.64 16.14 10.2 22.05 6.56 5.91 14.35 9.46 23.36 10.66-2.12 6.31-4.7 12.83-7.75 19.56zm-36.8-105.74c.03 3.77-1.3 7.57-3.99 11.41-2.69 3.84-6.27 6.78-10.74 8.81-.59-3.73.53-7.64 3.36-11.73 2.83-4.09 6.6-7.07 11.37-8.49z" />
                  </svg>
                  <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>Apple iOS Profile</strong>
                </div>
                <span className="badge badge-secondary" style={{ fontSize: '10px', padding: '2px 6px' }}>.MOBILESYNC</span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                CareFlow-Apple-iOS.mobileconfig • WebClip installer
              </span>
              <span style={{ fontSize: '12px', color: 'var(--secondary)', fontWeight: 700, marginTop: 'auto' }}>
                Download Profile ↓
              </span>
            </a>

            {/* Apple macOS DMG */}
            <a
              href="/downloads/CareFlow-Mac.dmg"
              download="CareFlow-Mac.dmg"
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="20" height="20" viewBox="0 0 170 170" fill="currentColor">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.6-7.83-11.72-14.36-5.83-9.15-10.37-19.46-13.62-29.93-3.25-10.47-4.88-20.48-4.88-30.04 0-14.93 3.65-27.24 10.96-36.93 7.31-9.69 16.7-14.67 28.18-14.94 4.58 0 9.8 1.16 15.65 3.49 5.86 2.33 9.47 3.55 10.85 3.66 1.83-.24 5.63-1.57 11.41-3.99 5.78-2.43 10.74-3.52 14.88-3.29 11.9.84 21.36 5.3 28.38 13.38-10.47 6.33-15.59 15.11-15.35 26.33.24 8.79 3.64 16.14 10.2 22.05 6.56 5.91 14.35 9.46 23.36 10.66-2.12 6.31-4.7 12.83-7.75 19.56zm-36.8-105.74c.03 3.77-1.3 7.57-3.99 11.41-2.69 3.84-6.27 6.78-10.74 8.81-.59-3.73.53-7.64 3.36-11.73 2.83-4.09 6.6-7.07 11.37-8.49z" />
                  </svg>
                  <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>macOS Disk Image</strong>
                </div>
                <span className="badge badge-primary" style={{ fontSize: '10px', padding: '2px 6px' }}>.DMG</span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                CareFlow-Mac.dmg • Universal macOS installer
              </span>
              <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 700, marginTop: 'auto' }}>
                Download .DMG Package ↓
              </span>
            </a>

            {/* Windows EXE */}
            <a
              href="/downloads/CareFlow-Windows.exe"
              download="CareFlow-Windows.exe"
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#0078D4">
                    <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.949-1.8" />
                  </svg>
                  <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>Windows Executable</strong>
                </div>
                <span className="badge badge-primary" style={{ fontSize: '10px', padding: '2px 6px' }}>.EXE</span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                CareFlow-Windows.exe • 64-bit Windows launcher
              </span>
              <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 700, marginTop: 'auto' }}>
                Download .EXE Installer ↓
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
