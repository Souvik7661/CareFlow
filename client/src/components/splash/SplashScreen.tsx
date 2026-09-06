import React, { useEffect, useState, useRef } from 'react';
import { Calendar, Users, Brain, Heart, ShieldCheck } from 'lucide-react';
import './splash.css';

interface SplashScreenProps {
  onFinish: () => void;
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  vx: number;
  vy: number;
  alpha: number;
  maxAlpha: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [fadeOut, setFadeOut] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Calibrating Intelligent Clinical Engine...');
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);
  const particleAnimRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const hasFinishedRef = useRef(false);

  // Smooth exit transition
  const finishSplash = () => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    setFadeOut(true);
    setTimeout(() => {
      onFinish();
    }, 350);
  };

  // 1. High-Performance Bio-Luminescent Particle Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Particle[] = [];
    const colors = [
      'rgba(45, 212, 191, ',  // Bright mint
      'rgba(6, 182, 212, ',   // Vibrant cyan
      'rgba(56, 189, 248, ',  // Sky blue
      'rgba(255, 255, 255, '  // Pristine white bokeh
    ];

    const count = window.innerWidth < 768 ? 24 : 45;
    for (let i = 0; i < count; i++) {
      const baseAlpha = Math.random() * 0.5 + 0.2;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.35,
        vy: -(Math.random() * 0.65 + 0.25), // Drift gently upwards
        alpha: baseAlpha,
        maxAlpha: baseAlpha
      });
    }

    const renderParticles = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.shadowBlur = p.radius * 4;
        ctx.shadowColor = p.color === 'rgba(255, 255, 255, ' ? '#ffffff' : '#2dd4bf';
        ctx.fill();
      }

      particleAnimRef.current = requestAnimationFrame(renderParticles);
    };

    particleAnimRef.current = requestAnimationFrame(renderParticles);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (particleAnimRef.current) cancelAnimationFrame(particleAnimRef.current);
    };
  }, []);

  // 2. Exact 2-Second Mathematical Interpolation with Clinical Sequence
  useEffect(() => {
    const TOTAL_DURATION = 1750; // 1.75s active progress + 0.25s finish = 2 seconds total

    const updateProgress = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      
      // Smooth cubic ease-out progression
      const t = Math.min(1, elapsed / TOTAL_DURATION);
      const easedT = 1 - Math.pow(1 - t, 2.2);
      const currentProgress = Math.min(100, easedT * 100);

      if (currentProgress < 42) {
        setStatusMessage('Calibrating Intelligent Clinical Engine...');
      } else if (currentProgress < 82) {
        setStatusMessage('Synchronizing Doctor Matrix & AI Triage...');
      } else {
        setStatusMessage('Clinical Portal Ready • Entering CareFlow AI');
      }

      if (elapsed < TOTAL_DURATION) {
        animRef.current = requestAnimationFrame(updateProgress);
      } else {
        // Start smooth cinematic exit at 1.8s
        setTimeout(() => {
          finishSplash();
        }, 120);
      }
    };

    animRef.current = requestAnimationFrame(updateProgress);

    // Fallback safety timer to ensure finish at 2.1s max
    const safetyTimer = setTimeout(() => {
      finishSplash();
    }, 2100);

    // Keyboard navigation (Esc / Space / Enter to enter instantly)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        finishSplash();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      clearTimeout(safetyTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div 
      className={`splash-container ${fadeOut ? 'splash-fade-out' : ''}`}
      role="banner"
      aria-label="CareFlow AI 4K Entering Screen"
    >
      {/* 1. Ultra-HD 4K Twilight Hospital Backdrop */}
      <div className="splash-backdrop" />

      {/* 3. Interactive Floating Bio-Luminescent Particle Field */}
      <canvas ref={canvasRef} className="splash-particles-canvas" />

      {/* 4. Atmospheric Vignette & Contrast Depth Layer */}
      <div className="splash-overlay" />

      {/* 5. Orbiting Telemetry Arcs & Satellite Beacon */}
      <div className="splash-orbital-arcs">
        <div className="splash-arc splash-arc-1" />
        <div className="splash-arc splash-arc-2">
          <div className="splash-arc-satellite" />
        </div>
      </div>

      {/* 6. Top Header Bar */}
      <header className="splash-top-bar">
        <div className="splash-top-left">
          <div className="splash-accent-bar" />
          <div className="splash-stacked-title">
            <span>SMARTER</span>
            <span>HEALTHCARE</span>
            <span>FOR A BRIGHTER</span>
            <span>TOMORROW</span>
          </div>
        </div>

        <div className="splash-top-right">
          <div className="splash-tr-brand-row">
            <span className="splash-tr-brand">CareFlow</span>
            <span className="splash-ai-chip">AI 2.0</span>
          </div>

          <span className="splash-tr-tags">
            PREDICT <span className="splash-pipe">|</span> SCHEDULE <span className="splash-pipe">|</span> SERVE <span className="splash-pipe">|</span> CARE
          </span>
        </div>
      </header>

      {/* 7. Center Brand & Action Hub */}
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

        {/* Live Clinical Telemetry Status Caption */}
        <div className="splash-status-wrapper">
          <div className="splash-status-dot" />
          <p className="splash-status-message">{statusMessage}</p>
        </div>

        {/* 8. 4 Glassmorphic Feature Highlights */}
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

      {/* 9. Bottom Footer Bar */}
      <footer className="splash-bottom-bar">
        <div className="splash-bottom-left">
          <div className="splash-accent-bar-sm" />
          <div className="splash-quote-text">"People Care First"</div>
          <div className="splash-quote-author">- CareFlow</div>
        </div>

        <div className="splash-bottom-right">
          <div className="splash-security-pill">
            <ShieldCheck size={18} strokeWidth={2.5} className="splash-shield-anim" />
            <span>Secure. Reliable. Always with You.</span>
          </div>
        </div>
      </footer>

      {/* Subtle Skip Indicator */}
      <button 
        type="button" 
        onClick={finishSplash} 
        className="splash-skip-tip" 
        style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
        title="Press Esc or click to enter immediately"
      >
        Press Esc or Click Here to Skip
      </button>
    </div>
  );
};

export default SplashScreen;
