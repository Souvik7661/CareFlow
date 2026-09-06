import React, { useState } from 'react';
import { Doctor, User } from '../../types';
import { api } from '../../services/api';
import { 
  ArrowLeft, 
  Heart, 
  Star, 
  Check, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Video 
} from 'lucide-react';

interface DoctorProfileScreenProps {
  doctor: any;
  user: User;
  onBack: () => void;
  onBookSlot: (slot: string) => void;
  onOpenTeleconsult: () => void;
  onOpenHospitalMap: () => void;
}

export const DoctorProfileScreen: React.FC<DoctorProfileScreenProps> = ({
  doctor,
  user,
  onBack,
  onBookSlot,
  onOpenTeleconsult,
  onOpenHospitalMap
}) => {
  const [selectedDay, setSelectedDay] = useState('28');
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [isFavorite, setIsFavorite] = useState(true);
  const [isBooked, setIsBooked] = useState(false);

  const dates = [
    { day: 'Mon', date: '27' },
    { day: 'Tue', date: '28' },
    { day: 'Wed', date: '29' },
    { day: 'Thu', date: '30' },
    { day: 'Fri', date: '31' }
  ];

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM', '07:00 PM'
  ];

  const handleConfirm = () => {
    setIsBooked(true);
    setTimeout(() => {
      onBookSlot(selectedTime);
    }, 900);
  };

  const docName = doctor?.name || 'Dr. Sarah Johnson';
  const docSpec = doctor?.specialization || 'Cardiologist';
  const docRating = doctor?.rating ? Number(doctor.rating).toFixed(1) : '4.9';
  const docReviews = doctor?.reviews_count || 320;
  const hospName = doctor?.hospital_name || 'City Hospital';
  const hospDistance = doctor?.hospital_distance || 2.4;

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Header matching Blueprint Screen 4 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="apple-circle-action-btn" onClick={onBack}>
          <ArrowLeft size={16} />
        </button>

        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
          Book Appointment
        </h2>

        <button 
          className="apple-circle-action-btn"
          onClick={() => setIsFavorite(!isFavorite)}
        >
          <Heart size={16} fill={isFavorite ? '#f43f5e' : 'none'} color={isFavorite ? '#f43f5e' : 'var(--text-secondary)'} />
        </button>
      </div>

      {/* Doctor Summary Card matching Blueprint Screen 4 */}
      <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
            color: '#ffffff',
            fontSize: '1.3rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 14px rgba(20, 184, 166, 0.3)',
            flexShrink: 0
          }}>
            {docName.replace('Dr. ', '').charAt(0)}
          </div>

          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              {docName}
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              {docSpec} &bull; {hospName} ({hospDistance} km)
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', color: '#f59e0b', fontSize: '0.76rem', fontWeight: 700 }}>
              <Star size={12} fill="#f59e0b" />
              <span>{docRating}</span>
              <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({docReviews} reviews)</span>
            </div>
          </div>
        </div>

        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'rgba(244, 63, 94, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Heart size={18} fill="#f43f5e" color="#f43f5e" />
        </div>
      </div>

      {/* Select Date Section matching Blueprint Screen 4 */}
      <div>
        <h3 style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 10px 0' }}>
          Select Date
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
          {dates.map(d => {
            const isSelected = selectedDay === d.date;
            return (
              <button
                key={d.date}
                type="button"
                style={{
                  padding: '12px 6px',
                  borderRadius: '18px',
                  border: isSelected ? 'none' : '1px solid var(--border-color)',
                  background: isSelected ? 'var(--primary)' : 'var(--bg-card)',
                  color: isSelected ? '#ffffff' : 'var(--text-primary)',
                  boxShadow: isSelected ? '0 8px 18px rgba(20, 184, 166, 0.35)' : 'var(--shadow-sm)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  transition: 'all 0.2s'
                }}
                onClick={() => setSelectedDay(d.date)}
              >
                <span style={{ fontSize: '0.72rem', opacity: isSelected ? 0.9 : 0.6, fontWeight: 600 }}>{d.day}</span>
                <strong style={{ fontSize: '1.1rem', fontWeight: 800 }}>{d.date}</strong>
              </button>
            );
          })}
        </div>
      </div>

      {/* Select Time Section matching Blueprint Screen 4 */}
      <div>
        <h3 style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 10px 0' }}>
          Select Time
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {timeSlots.map(t => {
            const isSelected = selectedTime === t;
            return (
              <button
                key={t}
                type="button"
                style={{
                  padding: '10px 6px',
                  borderRadius: '16px',
                  border: isSelected ? 'none' : '1px solid var(--border-color)',
                  background: isSelected ? 'var(--primary)' : 'var(--bg-card)',
                  color: isSelected ? '#ffffff' : 'var(--text-primary)',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 6px 14px rgba(20, 184, 166, 0.35)' : 'var(--shadow-sm)',
                  transition: 'all 0.2s'
                }}
                onClick={() => setSelectedTime(t)}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Appointment Summary Card matching Blueprint Screen 4 */}
      <div className="card" style={{ padding: '16px 20px', background: 'var(--primary-light)', border: '1px solid var(--primary-border)', borderRadius: '22px' }}>
        <span style={{ fontSize: '0.74rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 800 }}>
          Appointment Summary
        </span>

        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 16px', marginTop: '10px', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Doctor:</span>
          <strong style={{ color: 'var(--text-primary)' }}>{docName}</strong>

          <span style={{ color: 'var(--text-secondary)' }}>Specialization:</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{docSpec} &bull; Room {doctor?.room_no || '101'}</span>

          <span style={{ color: 'var(--text-secondary)' }}>Date &amp; Time:</span>
          <strong style={{ color: 'var(--primary)' }}>{selectedDay} May 2024, {selectedTime}</strong>

          <span style={{ color: 'var(--text-secondary)' }}>Hospital:</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{hospName}</span>
        </div>
      </div>

      {/* Big Confirm Booking Pill CTA matching Blueprint Screen 4 */}
      <div style={{ marginTop: '6px' }}>
        <button
          type="button"
          className="btn btn-primary btn-lg"
          style={{
            width: '100%',
            padding: '16px',
            fontSize: '1rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onClick={handleConfirm}
        >
          {isBooked ? (
            <>
              <Check size={20} />
              <span>Appointment Confirmed!</span>
            </>
          ) : (
            <span>Confirm Booking</span>
          )}
        </button>
      </div>
    </div>
  );
};
