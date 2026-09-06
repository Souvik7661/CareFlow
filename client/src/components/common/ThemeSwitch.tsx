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
    sm: { trackW: 52, trackH: 28, knobSize: 22, pad: 3, slideDist: 24, iconSize: 11 },
    md: { trackW: 66, trackH: 34, knobSize: 28, pad: 3, slideDist: 32, iconSize: 13 },
    lg: { trackW: 82, trackH: 42, knobSize: 34, pad: 4, slideDist: 40, iconSize: 16 },
  };

  const dim = dimensions[size];

  return (
    <button
      type="button"
      className={`clay-switch-container ${isDark ? 'is-dark' : 'is-light'} ${className}`}
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
      {/* 3D Beveled Outer Pill Frame (Matching Image 1 Dual-Contour Rim) */}
      <div 
        className="clay-switch-frame"
        style={{
          width: dim.trackW + dim.pad * 2,
          height: dim.trackH + dim.pad * 2
        }}
      >
        {/* Recessed Sunken Track */}
        <div 
          className="clay-switch-track"
          style={{
            width: dim.trackW,
            height: dim.trackH,
            padding: dim.pad
          }}
        >
          {/* Concentric 2-Tier 3D Sliding Knob with Framer Motion */}
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
              stiffness: 480,
              damping: 32,
              mass: 0.85
            }}
            whileTap={{ scale: 0.94 }}
          >
            {/* Outer Tier / Lower Elevation Flange */}
            <div className="clay-knob-base" />

            {/* Inner Tier / Raised Convex Dome Cap with Bevel */}
            <div className="clay-knob-cap">
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div
                    key="clay-moon"
                    initial={{ opacity: 0, scale: 0.6, rotate: -25 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.6, rotate: 25 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <svg
                      width={dim.iconSize}
                      height={dim.iconSize}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ filter: 'drop-shadow(0 0 4px rgba(56, 189, 248, 0.6))' }}
                    >
                      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" fill="rgba(56, 189, 248, 0.2)" />
                    </svg>
                  </motion.div>
                ) : (
                  <motion.div
                    key="clay-sun"
                    initial={{ opacity: 0, scale: 0.6, rotate: 25 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.6, rotate: -25 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <svg
                      width={dim.iconSize}
                      height={dim.iconSize}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#d97706"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ filter: 'drop-shadow(0 0 3px rgba(245, 158, 11, 0.5))' }}
                    >
                      <circle cx="12" cy="12" r="4" fill="rgba(245, 158, 11, 0.25)" />
                      <path d="M12 2v2" />
                      <path d="M12 20v2" />
                      <path d="m4.93 4.93 1.41 1.41" />
                      <path d="m17.66 17.66 1.41 1.41" />
                      <path d="M2 12h2" />
                      <path d="M20 12h2" />
                      <path d="m6.34 17.66-1.41 1.41" />
                      <path d="m19.07 4.93-1.41 1.41" />
                    </svg>
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

export default ThemeSwitch;
