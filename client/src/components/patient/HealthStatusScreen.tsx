import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MoreHorizontal, 
  Heart, 
  Footprints, 
  Flame, 
  Moon, 
  Activity, 
  Calendar, 
  TrendingUp, 
  Clock 
} from 'lucide-react';

interface HealthStatusScreenProps {
  onBack?: () => void;
  onNavigate?: (view: string) => void;
}

export const HealthStatusScreen: React.FC<HealthStatusScreenProps> = ({ onBack, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('Overview');

  const tabs = ['Overview', 'Heart', 'Activity', 'Sleep'];

  const weeklyBars = [
    { day: 'Mon', height: 42, active: false },
    { day: 'Tue', height: 68, active: false },
    { day: 'Wed', height: 50, active: false },
    { day: 'Thu', height: 75, active: false },
    { day: 'Fri', height: 95, active: true, value: '8,432' },
    { day: 'Sat', height: 58, active: false },
    { day: 'Sun', height: 35, active: false }
  ];

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Header matching Blueprint Screen 5 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="apple-circle-action-btn" onClick={onBack}>
          <ArrowLeft size={16} />
        </button>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
            Health Status
          </h2>
          <span style={{ fontSize: '0.76rem', color: '#64748b' }}>
            Live Vitals &amp; Weekly Rhythm
          </span>
        </div>

        <button className="apple-circle-action-btn">
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Segmented Category Pill Controls matching Blueprint Screen 5 */}
      <div style={{
        display: 'flex',
        gap: '6px',
        background: 'var(--bg-muted)',
        border: '1px solid var(--border-color)',
        padding: '4px',
        borderRadius: '9999px',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.04)'
      }}>
        {tabs.map(tab => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: '9999px',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: isActive ? 'linear-gradient(135deg, rgba(20, 184, 166, 0.95) 0%, rgba(13, 148, 136, 0.88) 100%)' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                boxShadow: isActive ? '0 4px 12px rgba(13, 148, 136, 0.35)' : 'none',
                transition: 'all 0.2s'
              }}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Hero Circular Ring Gauge Card matching Blueprint Screen 5 */}
      <div className="card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '24px' }}>
        {/* Progress Ring with 3D Heart */}
        <div style={{ position: 'relative', width: '104px', height: '104px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 104 104" width="104" height="104" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="52" cy="52" r="44" fill="none" stroke="#e2e8f0" strokeWidth="7" />
            <circle 
              cx="52" 
              cy="52" 
              r="44" 
              fill="none" 
              stroke="url(#healthStatusGradient)" 
              strokeWidth="7" 
              strokeDasharray="276" 
              strokeDashoffset="75" 
              strokeLinecap="round" 
            />
            <defs>
              <linearGradient id="healthStatusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0d9488" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>
            </defs>
          </svg>

          {/* 3D Heart Pulse in Center */}
          <div className="heart-pulse-3d" style={{
            position: 'absolute',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #ff708f, #f43f5e 65%, #be123c)',
            boxShadow: '0 8px 18px rgba(244, 63, 94, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}>
            <Heart size={24} fill="#ffffff" />
          </div>
        </div>

        {/* Right Metrics Text Block */}
        <div>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Heart Rate</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1, marginTop: '2px' }}>
            72 <span style={{ fontSize: '0.88rem', fontWeight: 500, color: '#64748b' }}>bpm</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#10b981' }} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#10b981' }}>Normal &bull; Resting</span>
          </div>
        </div>
      </div>

      {/* 3 Metric Cards matching Blueprint Screen 5: Steps, Calories, Sleep */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        <div className="card" style={{ padding: '14px 10px', textAlign: 'center', borderRadius: '20px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(13, 148, 136, 0.12)', color: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px auto' }}>
            <Footprints size={16} />
          </div>
          <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Steps</span>
          <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
            8,432
          </div>
        </div>

        <div className="card" style={{ padding: '14px 10px', textAlign: 'center', borderRadius: '20px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px auto' }}>
            <Flame size={16} />
          </div>
          <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Calories</span>
          <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
            520 <span style={{ fontSize: '0.68rem', fontWeight: 500, color: '#94a3b8' }}>kcal</span>
          </div>
        </div>

        <div className="card" style={{ padding: '14px 10px', textAlign: 'center', borderRadius: '20px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px auto' }}>
            <Moon size={16} />
          </div>
          <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Sleep</span>
          <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
            7h 30m
          </div>
        </div>
      </div>

      {/* Weekly Activity Bar Chart matching Blueprint Screen 5 */}
      <div className="card" style={{ padding: '18px 20px', borderRadius: '22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Weekly Activity
          </h3>
          <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#0d9488' }}>
            Goal: 10,000 / day
          </span>
        </div>

        {/* Bar Chart Graphics */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          height: '130px',
          padding: '0 8px',
          position: 'relative'
        }}>
          {weeklyBars.map(b => (
            <div key={b.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', position: 'relative' }}>
              {b.active && (
                <div style={{
                  position: 'absolute',
                  top: '-28px',
                  background: '#0d9488',
                  color: '#ffffff',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  boxShadow: '0 4px 10px rgba(13, 148, 136, 0.35)',
                  whiteSpace: 'nowrap'
                }}>
                  {b.value}
                </div>
              )}

              <div style={{
                width: '22px',
                height: `${b.height}px`,
                borderRadius: '9999px',
                background: b.active ? 'linear-gradient(180deg, #14b8a6 0%, #0d9488 100%)' : '#e2e8f0',
                boxShadow: b.active ? '0 6px 16px rgba(13, 148, 136, 0.35)' : 'none',
                transition: 'height 0.3s ease'
              }} />

              <span style={{ fontSize: '0.72rem', color: b.active ? '#0d9488' : '#94a3b8', fontWeight: b.active ? 800 : 500 }}>
                {b.day}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
