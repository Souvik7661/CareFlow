import React from 'react';
import { motion } from 'framer-motion';
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
    sm: { trackW: 56, trackH: 30, knobSize: 24, pad: 3, slideDist: 26 },
    md: { trackW: 72, trackH: 38, knobSize: 32, pad: 3, slideDist: 34 },
    lg: { trackW: 88, trackH: 46, knobSize: 38, pad: 4, slideDist: 42 },
  };

  const dim = dimensions[size];

  return (
    <button
      type="button"
      className={`clay-switch-container ${isDark ? 'is-dark' : 'is-light'} ${className}`}
      onClick={onToggle}
      role="switch"
      aria-checked={isDark}
      aria-label={`Toggle Theme: Currently ${isDark ? 'Dark' : 'Light'} Mode`}
      title={`Toggle Theme (${isDark ? 'Dark' : 'Light'} Mode)`}
      style={{
        width: dim.trackW + dim.pad * 2,
        height: dim.trackH + dim.pad * 2
      }}
    >
      {/* 3D Dual-Contour Outer Frame */}
      <div 
        className="clay-switch-frame"
        style={{
          width: dim.trackW + dim.pad * 2,
          height: dim.trackH + dim.pad * 2
        }}
      >
        {/* Recessed Sunken Capsule Track */}
        <div 
          className="clay-switch-track"
          style={{
            width: dim.trackW,
            height: dim.trackH
          }}
        >
          {/* Concentric 2-Tier 3D Sliding Knob (Exact Match to User Image 1) */}
          <motion.div
            className="clay-switch-knob"
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
              stiffness: 500,
              damping: 32,
              mass: 0.8
            }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Tier 1: Outer Raised Base Flange with Ambient Drop Shadow */}
            <div className="clay-knob-base" />

            {/* Tier 2: Inner Convex Dome Cap (Pure Satin Clay Finish) */}
            <div className="clay-knob-cap" />
          </motion.div>
        </div>
      </div>
    </button>
  );
};

export default ThemeSwitch;
