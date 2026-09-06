import React from 'react';

interface FashionLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  animated?: boolean;
  useFullLogo?: boolean;
  onClick?: () => void;
  className?: string;
}

export const FashionLogo: React.FC<FashionLogoProps> = ({
  size = 'md',
  showWordmark = true,
  animated = true,
  useFullLogo = false,
  onClick,
  className = ''
}) => {
  const sizeMap = {
    sm: { box: 36, imgSize: 32, font: '1.15rem', badgeFont: '0.6rem', gap: '8px' },
    md: { box: 44, imgSize: 38, font: '1.34rem', badgeFont: '0.66rem', gap: '10px' },
    lg: { box: 64, imgSize: 56, font: '1.9rem', badgeFont: '0.78rem', gap: '14px' },
    xl: { box: 120, imgSize: 104, font: '2.5rem', badgeFont: '0.95rem', gap: '18px' },
  };

  const config = sizeMap[size];

  // For XL or full logo mode, show the full official logo with wordmark & AI subtitle
  if (useFullLogo || size === 'xl') {
    return (
      <div 
        className={`cf-fashion-logo cf-official-logo-container ${className}`} 
        onClick={onClick}
        style={{ 
          display: 'inline-flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          cursor: onClick ? 'pointer' : 'default',
          position: 'relative'
        }}
      >
        {/* Ambient Pulsing Surgical Glow */}
        <div style={{
          position: 'absolute',
          inset: '-16px',
          borderRadius: '32px',
          background: 'radial-gradient(circle, rgba(20, 184, 166, 0.45) 0%, rgba(6, 182, 212, 0.2) 55%, transparent 75%)',
          filter: 'blur(16px)',
          animation: animated ? 'cf-pulse-glow 3s ease-in-out infinite' : 'none',
          zIndex: 0,
          pointerEvents: 'none'
        }} />

        {/* Orbiting Telemetry Ring */}
        <div style={{
          position: 'absolute',
          inset: '-8px',
          borderRadius: '28px',
          border: '1.5px dashed rgba(20, 184, 166, 0.5)',
          animation: animated ? 'cf-spin 20s linear infinite' : 'none',
          zIndex: 1,
          pointerEvents: 'none'
        }} />

        {/* Official CareFlow Logo Showcase Card */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          padding: '16px 20px',
          borderRadius: '24px',
          background: 'rgba(255, 255, 255, 0.98)',
          boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.45), 0 0 25px rgba(20, 184, 166, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(16px)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <img 
            src="/assets/careflow_logo.png" 
            alt="CareFlow Official Logo"
            style={{
              width: size === 'xl' ? '230px' : '160px',
              height: 'auto',
              maxHeight: size === 'xl' ? '230px' : '160px',
              objectFit: 'contain',
              display: 'block'
            }}
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src.indexOf('careflow_official_logo.png') === -1) {
                target.src = '/assets/careflow_official_logo.png';
              }
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`cf-fashion-logo ${className}`} 
      onClick={onClick}
      style={{ display: 'inline-flex', alignItems: 'center', gap: config.gap, cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* Official Circular CareFlow Emblem with Orbital Aura */}
      <div 
        className="cf-logo-mark" 
        style={{ 
          width: `${config.box}px`, 
          height: `${config.box}px`, 
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Ambient Pulsing Glow */}
        <div style={{
          position: 'absolute',
          inset: '-4px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(20, 184, 166, 0.4) 0%, rgba(6, 182, 212, 0.15) 50%, transparent 75%)',
          filter: 'blur(6px)',
          animation: animated ? 'cf-pulse-glow 3s ease-in-out infinite' : 'none',
          zIndex: 0
        }} />

        {/* Orbiting Tech Ring */}
        <svg 
          style={{
            position: 'absolute',
            inset: '-4px',
            width: 'calc(100% + 8px)',
            height: 'calc(100% + 8px)',
            animation: animated ? 'cf-spin 16s linear infinite' : 'none',
            zIndex: 1,
            pointerEvents: 'none'
          }}
          viewBox="0 0 100 100"
        >
          <circle 
            cx="50" 
            cy="50" 
            r="46" 
            fill="none" 
            stroke="url(#cf-ring-gradient)" 
            strokeWidth="2.5" 
            strokeDasharray="18 10 32 10" 
            strokeLinecap="round" 
          />
          <circle cx="82" cy="18" r="3.5" fill="#2dd4bf" filter="drop-shadow(0 0 4px #2dd4bf)" />
          <defs>
            <linearGradient id="cf-ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.95" />
            </linearGradient>
          </defs>
        </svg>

        {/* Official CareFlow Emblem Badge */}
        <div 
          className="cf-crest-shield" 
          style={{
            width: `${config.box}px`,
            height: `${config.box}px`,
            borderRadius: '50%',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.2) 0%, rgba(6, 182, 212, 0.1) 100%)',
            border: '1.5px solid rgba(20, 184, 166, 0.45)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(13, 148, 136, 0.25)',
            zIndex: 2
          }}
        >
          <img 
            src="/assets/careflow_emblem_transparent.png" 
            alt="CareFlow Emblem"
            style={{
              width: `${config.imgSize}px`,
              height: `${config.imgSize}px`,
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 5px rgba(13, 148, 136, 0.35))'
            }}
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src.indexOf('careflow_emblem.png') === -1) {
                target.src = '/assets/careflow_emblem.png';
              }
            }}
          />
        </div>
      </div>

      {/* Brand Name Typography */}
      {showWordmark && (
        <div className="cf-brand-text">
          <span 
            className="cf-brand-title"
            style={{ fontSize: config.font }}
          >
            CareFlow
          </span>
          <span 
            className="cf-ai-badge"
            style={{ fontSize: config.badgeFont }}
          >
            AI
          </span>
        </div>
      )}
    </div>
  );
};
