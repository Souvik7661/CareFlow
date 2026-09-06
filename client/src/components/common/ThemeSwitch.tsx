import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ThemeSwitch.css';

interface ThemeSwitchProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ThemeSwitch: React.FC<ThemeSwitchProps> = ({
  theme,
  onToggle,
  size = 'md',
  className = ''
}) => {
  const isDark = theme === 'dark';

  const dimensions = {
    sm: { trackW: 66, trackH: 34, knobSize: 28, pad: 3, slideDist: 32, iconSize: 15 },
    md: { trackW: 78, trackH: 40, knobSize: 34, pad: 3, slideDist: 38, iconSize: 18 },
    lg: { trackW: 96, trackH: 50, knobSize: 44, pad: 3, slideDist: 46, iconSize: 23 },
  };

  const dim = dimensions[size];

  return (
    <button
      type="button"
      className={`theme-switch-container ${isDark ? 'is-dark' : 'is-light'} ${className}`}
      onClick={onToggle}
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      style={{
        width: dim.trackW + dim.pad * 2,
        height: dim.trackH + dim.pad * 2
      }}
    >
      {/* Outer Metallic Beveled Frame */}
      <div 
        className="theme-switch-frame"
        style={{
          width: dim.trackW + dim.pad * 2,
          height: dim.trackH + dim.pad * 2
        }}
      >
        {/* Inner Recessed Matte Track */}
        <div 
          className="theme-switch-track"
          style={{
            width: dim.trackW,
            height: dim.trackH
          }}
        >
          {/* Ambient Left Neon Perimeter Arc (Golden Orange) */}
          <div 
            className="theme-switch-glow-left" 
            style={{ opacity: isDark ? 0.45 : 0.85 }} 
          />

          {/* Ambient Right Neon Perimeter Arc (Electric Cyan) */}
          <div 
            className="theme-switch-glow-right" 
            style={{ opacity: isDark ? 0.95 : 0.4 }} 
          />

          {/* Stationary Left Sun Station */}
          <div 
            className="theme-station-sun"
            style={{
              width: dim.knobSize,
              height: dim.knobSize,
              left: dim.pad,
              opacity: isDark ? 0.9 : 0.15
            }}
          >
            <SunIcon size={dim.iconSize} glow={isDark} />
          </div>

          {/* Stationary Right Moon Station */}
          <div 
            className="theme-station-moon"
            style={{
              width: dim.knobSize,
              height: dim.knobSize,
              right: dim.pad,
              opacity: isDark ? 0.15 : 0.85
            }}
          >
            <MoonIcon size={dim.iconSize} glow={!isDark} />
          </div>

          {/* Smooth Sliding Metallic Beveled Knob with Framer Motion */}
          <motion.div
            className="theme-switch-knob"
            style={{
              width: dim.knobSize,
              height: dim.knobSize,
              top: dim.pad,
              left: dim.pad
            }}
            animate={{
              x: isDark ? dim.slideDist : 0
            }}
            transition={{
              type: 'spring',
              stiffness: 460,
              damping: 30,
              mass: 0.85
            }}
            whileTap={{ scale: 0.94 }}
          >
            {/* Beveled Specular Outer Rim */}
            <div className="theme-knob-rim" />

            {/* Inner Inset Face with Active Glowing Icon */}
            <div className="theme-knob-inner-face">
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div
                    key="active-moon"
                    initial={{ opacity: 0, scale: 0.5, rotate: -40 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.5, rotate: 40 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <MoonIcon size={dim.iconSize + 2} glow={true} active={true} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="active-sun"
                    initial={{ opacity: 0, scale: 0.5, rotate: 40 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.5, rotate: -40 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <SunIcon size={dim.iconSize + 2} glow={true} active={true} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </button>
  );
};

/* Radiant Golden Sun Component */
interface IconProps {
  size: number;
  glow?: boolean;
  active?: boolean;
}

const SunIcon: React.FC<IconProps> = ({ size, glow = false, active = false }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      style={{
        overflow: 'visible',
        filter: glow 
          ? 'drop-shadow(0 0 5px rgba(251, 191, 36, 0.95)) drop-shadow(0 0 10px rgba(245, 158, 11, 0.6))' 
          : 'none'
      }}
    >
      {/* 8 Sun Rays */}
      <g className={active ? 'theme-sun-rays' : ''}>
        {/* Vertical & Horizontal Rays */}
        <line x1="12" y1="2" x2="12" y2="4.5" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        <line x1="12" y1="19.5" x2="12" y2="22" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        <line x1="2" y1="12" x2="4.5" y2="12" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        <line x1="19.5" y1="12" x2="22" y2="12" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />

        {/* Diagonal Rays */}
        <line x1="4.93" y1="4.93" x2="6.7" y2="6.7" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
        <line x1="17.3" y1="17.3" x2="19.07" y2="19.07" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
        <line x1="4.93" y1="19.07" x2="6.7" y2="17.3" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
        <line x1="17.3" y1="6.7" x2="19.07" y2="4.93" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Center Golden Circle */}
      <circle 
        cx="12" 
        cy="12" 
        r="4.8" 
        fill="url(#sun-gradient)" 
        stroke="#f59e0b" 
        strokeWidth="1.2" 
      />

      <defs>
        <linearGradient id="sun-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="40%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
    </svg>
  );
};

/* Glowing Cyan Crescent Moon & Twinkling Stars Component */
const MoonIcon: React.FC<IconProps> = ({ size, glow = false, active = false }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none"
      style={{
        overflow: 'visible',
        filter: glow 
          ? 'drop-shadow(0 0 6px rgba(0, 229, 255, 0.95)) drop-shadow(0 0 12px rgba(6, 182, 212, 0.7))' 
          : 'none'
      }}
    >
      {/* Crescent Moon */}
      <path 
        d="M14.5 3C9.253 3 5 7.253 5 12.5C5 17.747 9.253 22 14.5 22C16.88 22 19.06 21.125 20.73 19.676C15.82 19.26 12 15.176 12 10.2C12 7.15 13.56 4.45 15.93 2.87C15.47 2.95 15.0 3 14.5 3Z" 
        fill="url(#moon-gradient)" 
        stroke="#00e5ff"
        strokeWidth="0.8"
      />

      {/* Twinkling 4-Point Diamond Star 1 */}
      <g className={active ? 'theme-twinkle-star' : ''}>
        <path 
          d="M17.5 7.5L18.2 9.2L19.9 9.9L18.2 10.6L17.5 12.3L16.8 10.6L15.1 9.9L16.8 9.2L17.5 7.5Z" 
          fill="#ffffff"
          filter="drop-shadow(0 0 4px #00e5ff)"
        />
      </g>

      {/* Tiny Sparkle Dot 2 */}
      <circle 
        cx="19.5" 
        cy="14" 
        r="0.85" 
        fill="#bbf2fc" 
        className={active ? 'theme-twinkle-star-2' : ''}
        filter="drop-shadow(0 0 3px #00e5ff)" 
      />

      <defs>
        <linearGradient id="moon-gradient" x1="20%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#cffafe" />
          <stop offset="70%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#00e5ff" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default ThemeSwitch;
