import React, { useState } from 'react';
import { User } from '../../types';
import { api, DEFAULT_DOCTORS } from '../../services/api';
import { sessionManager } from '../../services/session';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Star, 
  CheckCircle2, 
  Stethoscope, 
  Sparkles, 
  Video, 
  Building2,
  ShieldCheck
} from 'lucide-react';

interface DirectBookingScreenProps {
  currentUser: User | null;
  initialDoctorId?: string;
  onBack: () => void;
  onBookingSuccess: (appointment: any) => void;
}

export const DirectBookingScreen: React.FC<DirectBookingScreenProps> = ({
  currentUser,
  initialDoctorId,
  onBack,
  onBookingSuccess
}) => {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(
    initialDoctorId || DEFAULT_DOCTORS[0].doctorId || (DEFAULT_DOCTORS[0] as any).doctor_id
  );
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<string>('10:00 AM');
  const [consultationType, setConsultationType] = useState<'in-person' | 'teleconsult'>('in-person');
  const [reason, setReason] = useState<string>('Routine health consultation & checkup');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const selectedDoctor = DEFAULT_DOCTORS.find(d => d.doctorId === selectedDoctorId || (d as any).doctor_id === selectedDoctorId) || DEFAULT_DOCTORS[0];

  // Next 5 Days Generator
  const upcomingDays = Array.from({ length: 5 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      iso: d.toISOString().split('T')[0],
      dayName: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' })
    };
  });

  const slots = [
    { time: '09:30 AM', period: 'Morning' },
    { time: '10:00 AM', period: 'Morning' },
    { time: '10:30 AM', period: 'Morning' },
    { time: '11:15 AM', period: 'Morning' },
    { time: '02:00 PM', period: 'Afternoon' },
    { time: '02:45 PM', period: 'Afternoon' },
    { time: '03:30 PM', period: 'Afternoon' },
    { time: '04:15 PM', period: 'Afternoon' },
    { time: '05:00 PM', period: 'Evening' },
    { time: '05:45 PM', period: 'Evening' }
  ];

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const patientId = currentUser?.patientId || `PAT-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const patientName = currentUser?.fullName || 'Patient';
      const res = await api.bookAppointment({
        patientId,
        patientName,
        doctorId: selectedDoctor.doctorId,
        departmentId: selectedDoctor.departmentId,
        appointmentDate: selectedDate,
        appointmentTime: selectedSlot,
        reason: `${consultationType === 'teleconsult' ? '[Video Teleconsult] ' : ''}${reason}`
      });

      const fullAppointment = {
        ...res.appointment,
        appointmentId: res.appointment?.appointmentId || res.appointment?.appointment_id || `APT-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        appointment_id: res.appointment?.appointmentId || res.appointment?.appointment_id || `APT-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        patientId,
        patient_id: patientId,
        patientName,
        patient_name: patientName,
        doctorId: selectedDoctor.doctorId,
        doctor_id: selectedDoctor.doctorId,
        doctorName: selectedDoctor.name,
        doctor_name: selectedDoctor.name,
        departmentId: selectedDoctor.departmentId,
        department_id: selectedDoctor.departmentId,
        departmentName: selectedDoctor.departmentName || selectedDoctor.department_name || 'Specialty Care',
        department_name: selectedDoctor.departmentName || selectedDoctor.department_name || 'Specialty Care',
        roomNo: selectedDoctor.roomNo || selectedDoctor.room_no || 'Room 204',
        room_no: selectedDoctor.roomNo || selectedDoctor.room_no || 'Room 204',
        wing: selectedDoctor.room_wing || 'Block A • Wing 1',
        room_wing: selectedDoctor.room_wing || 'Block A • Wing 1',
        appointmentDate: selectedDate,
        appointment_date: selectedDate,
        appointmentTime: selectedSlot,
        appointment_time: selectedSlot,
        tokenNumber: res.appointment?.tokenNumber || res.appointment?.token_number || '#1',
        token_number: res.appointment?.tokenNumber || res.appointment?.token_number || '#1',
        status: 'CONFIRMED',
        estimatedWaitTime: 8,
        queuePosition: 2,
        consultationFee: selectedDoctor.consultation_fee || 700
      };

      try {
        sessionManager.setLatestAppointment(fullAppointment, currentUser?.patientId || currentUser?.userId);
      } catch (e) {}

      onBookingSuccess(fullAppointment);
    } catch (err: any) {
      alert('Booking failed: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button 
          className="btn btn-outline btn-sm" 
          onClick={onBack}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '9999px', padding: '8px 16px' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Hub</span>
        </button>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Book Appointment
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Direct Doctor Reservation &amp; Fast-Track Token
          </span>
        </div>

        <div style={{ width: '40px' }} />
      </div>

      <form onSubmit={handleConfirmBooking} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Step 1: Select Doctor Card */}
        <div className="card" style={{ padding: '20px', borderRadius: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
              <Stethoscope size={18} color="var(--primary)" />
              <span>Step 1: Choose Specialist Doctor</span>
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700 }}>
              10 Specialists Available
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
            {DEFAULT_DOCTORS.map(doc => {
              const isSelected = selectedDoctorId === doc.doctorId;
              return (
                <div
                  key={doc.doctorId}
                  onClick={() => setSelectedDoctorId(doc.doctorId)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '14px',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    background: isSelected ? 'var(--primary-light)' : 'var(--bg-card)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 4px 14px rgba(20, 184, 166, 0.25)' : 'none'
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: isSelected ? 'var(--primary)' : 'var(--bg-muted)',
                    color: isSelected ? '#fff' : 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1rem',
                    flexShrink: 0
                  }}>
                    {doc.name.replace('Dr. ', '').charAt(0)}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {doc.name}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: isSelected ? 'var(--primary)' : 'var(--text-secondary)', fontWeight: 600 }}>
                      {doc.specialization} &bull; {doc.roomNo || 'Room 105'}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      ₹{doc.consultation_fee}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '2px', justifyContent: 'flex-end' }}>
                      <Star size={10} fill="#f59e0b" />
                      <span>{doc.rating}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Choose Consultation Date */}
        <div className="card" style={{ padding: '20px', borderRadius: '22px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
            <Calendar size={18} color="var(--primary)" />
            <span>Step 2: Choose Date</span>
          </h3>

          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px' }}>
            {upcomingDays.map(d => {
              const isSelected = selectedDate === d.iso;
              return (
                <div
                  key={d.iso}
                  onClick={() => setSelectedDate(d.iso)}
                  style={{
                    flex: '1',
                    minWidth: '85px',
                    padding: '12px 10px',
                    borderRadius: '16px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    background: isSelected ? 'var(--primary)' : 'var(--bg-card)',
                    color: isSelected ? '#ffffff' : 'var(--text-primary)',
                    boxShadow: isSelected ? '0 6px 18px rgba(20, 184, 166, 0.35)' : 'var(--shadow-sm)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', opacity: isSelected ? 0.9 : 0.6 }}>
                    {d.dayName}
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, margin: '4px 0' }}>
                    {d.dayNumber}
                  </div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, opacity: isSelected ? 0.9 : 0.6 }}>
                    {d.month}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 3: Choose Time Slot */}
        <div className="card" style={{ padding: '20px', borderRadius: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
              <Clock size={18} color="var(--primary)" />
              <span>Step 3: Select Available Time Slot</span>
            </h3>
            <span style={{ fontSize: '0.76rem', color: 'var(--success)', fontWeight: 700 }}>
              ● Live Queue Ready
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '8px' }}>
            {slots.map(s => {
              const isSelected = selectedSlot === s.time;
              return (
                <button
                  type="button"
                  key={s.time}
                  onClick={() => setSelectedSlot(s.time)}
                  style={{
                    padding: '10px 8px',
                    borderRadius: '12px',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    background: isSelected ? 'var(--primary)' : 'var(--bg-card)',
                    color: isSelected ? '#ffffff' : 'var(--text-primary)',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 4px 12px rgba(20, 184, 166, 0.35)' : 'none',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px'
                  }}
                >
                  <span>{s.time}</span>
                  <span style={{ fontSize: '0.64rem', opacity: isSelected ? 0.85 : 0.5, fontWeight: 500 }}>
                    {s.period}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 4: Visit Mode & Reason */}
        <div className="card" style={{ padding: '20px', borderRadius: '22px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 14px 0', color: 'var(--text-primary)' }}>
            Step 4: Consultation Type &amp; Reason
          </h3>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <button
              type="button"
              onClick={() => setConsultationType('in-person')}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '14px',
                border: consultationType === 'in-person' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                background: consultationType === 'in-person' ? 'var(--primary-light)' : 'var(--bg-card)',
                color: consultationType === 'in-person' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Building2 size={16} />
              <span>In-Person Hospital Visit</span>
            </button>

            <button
              type="button"
              onClick={() => setConsultationType('teleconsult')}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '14px',
                border: consultationType === 'teleconsult' ? '2px solid #0284c7' : '1px solid var(--border-color)',
                background: consultationType === 'teleconsult' ? 'rgba(2, 132, 199, 0.15)' : 'var(--bg-card)',
                color: consultationType === 'teleconsult' ? '#0284c7' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Video size={16} />
              <span>Video Teleconsult</span>
            </button>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Reason for Consultation / Symptoms</label>
            <input
              type="text"
              className="form-input"
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="e.g. Chest tightness, chronic stomach acidity, skin rash..."
              required
            />
          </div>
        </div>

        {/* Summary & Submit */}
        <div className="card" style={{
          padding: '20px',
          borderRadius: '22px',
          border: '1.5px solid var(--primary-border)',
          background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--primary-light) 100%)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--primary)', fontWeight: 800 }}>
                APPOINTMENT SUMMARY
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '2px' }}>
                {selectedDoctor.name} &bull; {selectedDoctor.specialization}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                {selectedDate} at {selectedSlot} &bull; {selectedDoctor.roomNo || 'Room 105'}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>TOTAL FEE</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--primary)' }}>
                ₹{selectedDoctor.consultation_fee}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', borderRadius: '16px', fontSize: '1rem', fontWeight: 800, padding: '15px' }}
          >
            <CheckCircle2 size={20} />
            <span>{isSubmitting ? 'Confirming Appointment...' : 'Confirm & Generate Hospital Token 🎫'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
