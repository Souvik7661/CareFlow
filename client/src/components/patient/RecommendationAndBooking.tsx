import React, { useState } from 'react';
import { User, DoctorRecommendation } from '../../types';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Calendar, 
  MapPin, 
  Star, 
  Sparkles, 
  ChevronRight, 
  ArrowLeft,
  Building2,
  Users,
  ShieldAlert,
  Info
} from 'lucide-react';

interface RecommendationAndBookingProps {
  user: User;
  recommendation: any;
  onProceedToProfile: (doctor: any) => void;
  onViewAllDoctors: () => void;
  onBack: () => void;
}

export const RecommendationAndBooking: React.FC<RecommendationAndBookingProps> = ({
  user,
  recommendation,
  onProceedToProfile,
  onViewAllDoctors,
  onBack
}) => {
  const doctor = recommendation.recommendedDoctor;
  const conditionName = recommendation.probableCategory || 'Gastritis / Acid Reflux';
  const specialtyName = recommendation.recommendedSpecialty || 'Gastroenterologist';
  const confidence = recommendation.confidenceScore || 92;

  return (
    <div className="blueprint-flow-container">
      {/* Header matching Blueprint Screen 3 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <button 
          className="btn btn-outline btn-sm"
          onClick={onBack}
          style={{ width: '36px', height: '36px', padding: 0, borderRadius: '50%' }}
        >
          <ArrowLeft size={18} />
        </button>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>AI Recommendation</h2>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Step 3 of 4</span>
        </div>
        <div style={{ width: '36px' }} />
      </div>

      {/* Emergency Red-Flag Warning Banner if detected */}
      {recommendation.emergencyFlag && (
        <div className="emergency-alert-banner" style={{ marginBottom: '16px' }}>
          <ShieldAlert size={28} className="emergency-alert-icon" />
          <div>
            <div className="emergency-alert-title">CRITICAL EMERGENCY NOTICE</div>
            <div className="emergency-alert-desc">
              {recommendation.emergencyWarning || 
               'Your symptoms may indicate a critical emergency. Please call 108 or use the Ambulance Service below immediately.'}
            </div>
          </div>
        </div>
      )}

      {/* Recommendation Intro matching Blueprint Screen 3 */}
      <div style={{ textAlign: 'center', margin: '8px 0 20px 0' }}>
        <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Based on your symptoms, we recommend:
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: '6px 0 4px 0' }}>
          {conditionName}
        </h1>
        <div style={{ fontSize: '0.92rem', color: '#0d9488', fontWeight: 600 }}>
          You should consult a {specialtyName}.
        </div>

        {/* Confidence Meter matching Screen 3 */}
        <div style={{ maxWidth: '280px', margin: '14px auto 0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Confidence</span>
            <span style={{ color: '#0d9488' }}>{confidence}%</span>
          </div>
          <div style={{ width: '100%', height: '7px', background: 'var(--bg-muted)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{ width: `${confidence}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #0d9488)', borderRadius: '9999px' }} />
          </div>
        </div>
      </div>

      {/* Recommended Doctor Card matching Blueprint Screen 3 */}
      <div className="card" style={{ padding: '20px', borderRadius: 'var(--radius-xl)', border: '1.5px solid rgba(13, 148, 136, 0.3)', boxShadow: 'var(--shadow-md)' }}>
        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
          Recommended Doctor
        </span>

        {/* Doctor Identity Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '12px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0d9488, #0f766e)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: 800,
            boxShadow: 'var(--shadow-sm)'
          }}>
            {doctor.name.replace('Dr. ', '').charAt(0)}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{doctor.name}</h3>
              <ChevronRight size={18} color="var(--text-muted)" />
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {doctor.specialization}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#eab308', fontSize: '0.82rem', fontWeight: 700 }}>
                <Star size={12} fill="#eab308" />
                <span>{doctor.rating}</span>
                <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({doctor.totalReviews || 320}+ reviews)</span>
              </div>
              <span style={{ color: 'var(--border-color)' }}>&bull;</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{doctor.experience} yrs exp</span>
            </div>
          </div>
        </div>

        {/* Next Available Pill */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bg-muted)',
          padding: '10px 14px',
          borderRadius: 'var(--radius-md)',
          marginTop: '16px',
          fontSize: '0.84rem'
        }}>
          <span style={{ color: 'var(--text-muted)' }}>Next Available</span>
          <strong style={{ color: '#0d9488' }}>{doctor.nextAvailableSlot || 'Today, 11:30 AM'}</strong>
        </div>

        {/* Why this doctor explanation */}
        <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
            Why this doctor?
          </span>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginTop: '4px', lineHeight: '1.4' }}>
            {doctor.whyThisDoctor || 'Specialized in stomach, liver and digestive disorders.'}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            <Building2 size={13} />
            <span>{doctor.hospitalName || 'City Hospital'}, {doctor.hospitalDistance || '2.4'} km away</span>
          </div>
        </div>

        {/* View All Doctors Button matching Screen 3 */}
        <div style={{ marginTop: '16px' }}>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            style={{ width: '100%', fontSize: '0.85rem', fontWeight: 600 }}
            onClick={onViewAllDoctors}
          >
            View All Doctors
          </button>
        </div>
      </div>

      {/* Primary Next Action Button matching Blueprint Screen 3 */}
      <div style={{ marginTop: '20px' }}>
        <button
          className="btn btn-primary"
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '1rem',
            fontWeight: 800,
            background: '#0d9488',
            borderRadius: 'var(--radius-lg)'
          }}
          onClick={() => onProceedToProfile(doctor)}
        >
          <span>Next</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};
