import React from 'react';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const LanguageTransitionLoader: React.FC = () => {
  const { isTransitioning, targetLanguage } = useLanguage();

  if (!isTransitioning) return null;

  const langName = targetLanguage ? `${targetLanguage.name} (${targetLanguage.nativeName})` : 'Selected Language';
  const flag = targetLanguage?.flag || '🌐';

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(4, 8, 18, 0.72)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        animation: 'fadeIn 0.2s ease-out'
      }}
      role="status"
      aria-live="polite"
      aria-label="Loading selected language"
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          padding: '32px 40px',
          borderRadius: '24px',
          background: 'rgba(15, 23, 42, 0.88)',
          border: '1px solid rgba(45, 212, 191, 0.35)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.85), 0 0 30px rgba(45, 212, 191, 0.2)',
          textAlign: 'center',
          maxWidth: '380px',
          width: '90%'
        }}
      >
        {/* Animated Icon / Flag */}
        <div 
          style={{
            position: 'relative',
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: 'rgba(45, 212, 191, 0.12)',
            border: '2px solid rgba(45, 212, 191, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(45, 212, 191, 0.3)'
          }}
        >
          <span style={{ fontSize: '2.2rem', lineHeight: 1 }}>{flag}</span>
          
          {/* Subtle spinning circular border */}
          <div
            style={{
              position: 'absolute',
              inset: '-4px',
              borderRadius: '50%',
              border: '2px solid transparent',
              borderTopColor: '#2dd4bf',
              animation: 'spin 0.8s linear infinite'
            }}
          />
        </div>

        {/* Title */}
        <div>
          <h3 
            style={{ 
              margin: '0 0 6px 0', 
              fontSize: '1.15rem', 
              fontWeight: 700, 
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={16} color="#2dd4bf" />
            Applying Language
          </h3>
          <p 
            style={{ 
              margin: 0, 
              fontSize: '0.95rem', 
              color: '#2dd4bf', 
              fontWeight: 700 
            }}
          >
            {langName}
          </p>
        </div>

        {/* Status caption */}
        <span 
          style={{ 
            fontSize: '0.78rem', 
            color: 'rgba(255, 255, 255, 0.65)', 
            fontWeight: 500 
          }}
        >
          Updating clinical interface & AI Companion...
        </span>
      </div>
    </div>
  );
};

export default LanguageTransitionLoader;
