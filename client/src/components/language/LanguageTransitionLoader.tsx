import React from 'react';
import { Calendar, Users, Brain, Heart, ShieldCheck, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import '../splash/splash.css';

export const LanguageTransitionLoader: React.FC = () => {
  const { isTransitioning, transitionProgress, targetLanguage } = useLanguage();

  if (!isTransitioning) return null;

  const getStatusMessage = () => {
    const langName = targetLanguage ? `${targetLanguage.name} (${targetLanguage.nativeName})` : 'Selected Language';
    if (transitionProgress < 35) {
      return `Loading Neural Linguistic Engine & Lexicon for ${langName}...`;
    } else if (transitionProgress < 75) {
      return `Translating Dr. AI Companion, Clinical Triage & Hospital Queues...`;
    } else {
      return `Localized Clinical Portal Ready • Entering CareFlow AI`;
    }
  };

  return (
    <div 
      className="splash-container"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999999,
        cursor: 'default'
      }}
      role="alert"
      aria-live="assertive"
      aria-label="CareFlow AI Language Loading Screen"
    >
      {/* 1. Ultra-HD 4K Twilight Hospital Backdrop */}
      <div className="splash-backdrop" />

      {/* 2. Optical Medical AI Laser Sweep Beam */}
      <div className="splash-laser-sweep" />

      {/* 3. Atmospheric Vignette & Contrast Depth Layer */}
      <div className="splash-overlay" />

      {/* 4. Orbiting Telemetry Arcs */}
      <div className="splash-orbital-arcs">
        <div className="splash-arc splash-arc-1" />
        <div className="splash-arc splash-arc-2">
          <div className="splash-arc-satellite" />
        </div>
      </div>

      {/* 5. Top Telemetry Header Bar */}
      <header className="splash-top-bar">
        <div className="splash-top-left">
          <div className="splash-accent-bar" />
          <div className="splash-stacked-title">
            <span>MULTILINGUAL</span>
            <span>CLINICAL AI</span>
            <span>GLOBAL ACCESS</span>
            <span>FOR ALL</span>
          </div>
        </div>

        <div className="splash-top-right">
          <div className="splash-tr-brand-row">
            <span className="splash-tr-brand">CareFlow</span>
            <span className="splash-ai-chip">AI 2.0</span>
          </div>

          <span className="splash-tr-tags">
            LOCALIZE <span className="splash-pipe">|</span> TRIAGE <span className="splash-pipe">|</span> EMPOWER <span className="splash-pipe">|</span> CARE
          </span>

          {/* Animated Clinical EKG Pulse Line */}
          <div className="splash-ekg-wrapper">
            <svg className="splash-ekg-svg" viewBox="0 0 200 30" preserveAspectRatio="none">
              <path className="splash-ekg-track" d="M0,15 L60,15 L68,5 L76,25 L84,8 L92,20 L100,15 L200,15" />
              <path className="splash-ekg-pulse" d="M0,15 L60,15 L68,5 L76,25 L84,8 L92,20 L100,15 L200,15" />
            </svg>
          </div>
        </div>
      </header>

      {/* 6. Center Brand & Action Hub */}
      <main className="splash-center-hub">
        {/* Animated 4K Brand Logo with Gyro Ring & Luminous Aura */}
        <div className="splash-logo-wrapper">
          <div className="splash-glow-aura" />
          <div className="splash-logo-gyro">
            <div className="splash-gyro-node" />
          </div>

          <img 
            src="/assets/splash_center_logo_4k.png" 
            alt="CareFlow - Smarter Appointments. Healthier Tomorrows." 
            className="splash-logo-img"
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src.indexOf('splash_center_logo.png') === -1) {
                target.src = '/assets/splash_center_logo.png';
              }
            }}
          />
        </div>

        {/* Selected Language Badge with Shimmer & Flag */}
        {targetLanguage && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 22px',
              borderRadius: '9999px',
              background: 'rgba(4, 18, 28, 0.75)',
              border: '1.5px solid rgba(45, 212, 191, 0.55)',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7), 0 0 24px rgba(45, 212, 191, 0.35)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              color: '#ffffff',
              fontSize: '1rem',
              fontWeight: 700,
              letterSpacing: '0.01em',
              marginBottom: '4px'
            }}
          >
            <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{targetLanguage.flag}</span>
            <span style={{ color: '#ffffff' }}>{targetLanguage.name}</span>
            <span style={{ color: '#2dd4bf', fontWeight: 800 }}>({targetLanguage.nativeName})</span>
            <span 
              style={{ 
                fontSize: '0.72rem', 
                padding: '2px 8px', 
                borderRadius: '9999px', 
                background: 'rgba(45, 212, 191, 0.2)', 
                color: '#2dd4bf',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Sparkles size={11} /> 1.5s Switch
            </span>
          </div>
        )}

        {/* Dynamic 4K Progress Bar with Leading Hotspot Spark */}
        <div className="splash-progress-container">
          <div className="splash-progress-track">
            <div 
              className="splash-progress-fill" 
              style={{ width: `${transitionProgress}%` }}
            >
              <div className="splash-progress-shimmer" />
              <div className="splash-progress-spark" />
            </div>
          </div>
          <span className="splash-progress-percent">{Math.round(transitionProgress)}%</span>
        </div>

        {/* Live Clinical Telemetry Status Caption */}
        <div className="splash-status-wrapper">
          <div className="splash-status-dot" />
          <p className="splash-status-message">{getStatusMessage()}</p>
        </div>

        {/* 7. 4 Glassmorphic Feature Highlights */}
        <div className="splash-features-row">
          {/* 1: Smart Appointments */}
          <div className="splash-feature-box" title="AI Auto-Scheduling & Instant Token Allocation">
            <div className="splash-icon-glass icon-cal">
              <Calendar size={24} strokeWidth={2.2} />
            </div>
            <span className="splash-feature-label">Smart<br />Appointments</span>
          </div>

          <div className="splash-features-divider" />

          {/* 2: Connected Care */}
          <div className="splash-feature-box" title="Real-Time Doctor & Patient Queue Sync">
            <div className="splash-icon-glass icon-users">
              <Users size={24} strokeWidth={2.2} />
            </div>
            <span className="splash-feature-label">Connected<br />Care</span>
          </div>

          <div className="splash-features-divider" />

          {/* 3: AI Powered Insights */}
          <div className="splash-feature-box" title="Predictive Clinical Triage & Department Matching">
            <div className="splash-icon-glass icon-brain">
              <Brain size={24} strokeWidth={2.2} className="splash-brain-anim" />
            </div>
            <span className="splash-feature-label">AI Powered<br />Insights</span>
          </div>

          <div className="splash-features-divider" />

          {/* 4: Healthier Tomorrows */}
          <div className="splash-feature-box" title="Continuous Health Records & Long-Term Vital Tracking">
            <div className="splash-icon-glass icon-heart">
              <Heart size={24} strokeWidth={2.2} className="splash-heart-anim" />
            </div>
            <span className="splash-feature-label">Healthier<br />Tomorrows</span>
          </div>
        </div>
      </main>

      {/* 8. Bottom Footer Bar */}
      <footer className="splash-bottom-bar">
        <div className="splash-bottom-left">
          <div className="splash-accent-bar-sm" />
          <div className="splash-quote-text">"Healthcare in Your Mother Tongue"</div>
          <div className="splash-quote-author">- CareFlow AI Multilingual Suite</div>
        </div>

        <div className="splash-bottom-right">
          <div className="splash-security-pill">
            <ShieldCheck size={18} strokeWidth={2.5} className="splash-shield-anim" />
            <span>100% End-to-End Secure Clinical AI Translation</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LanguageTransitionLoader;
