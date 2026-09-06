import React, { useState, useEffect } from 'react';
import { User, Appointment } from '../../types';
import { api } from '../../services/api';
import { 
  ArrowLeft, 
  Ticket, 
  UserCheck, 
  Stethoscope, 
  Clock, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  Printer, 
  Phone, 
  Calendar, 
  Activity, 
  History,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface PatientTokenWindowProps {
  user: User;
  appointment?: any | null;
  onBack: () => void;
  onGoToLiveQueue?: () => void;
  onBookNew?: () => void;
}

export const PatientTokenWindow: React.FC<PatientTokenWindowProps> = ({
  user,
  appointment,
  onBack,
  onGoToLiveQueue,
  onBookNew
}) => {
  const [activeApt, setActiveApt] = useState<Appointment | any | null>(null);
  const [historyApts, setHistoryApts] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Direct appointment passed via props
    if (appointment) {
      const normalized: any = {
        appointment_id: appointment.appointment_id || appointment.appointmentId || 'APT-2026-88129',
        patient_id: appointment.patient_id || appointment.patientId || user.patientId || 'PAT-2026-38372',
        doctor_id: appointment.doctor_id || appointment.doctorId || '',
        department_id: appointment.department_id || appointment.departmentId || '',
        appointment_date: appointment.appointment_date || appointment.appointmentDate || new Date().toISOString().split('T')[0],
        appointment_time: appointment.appointment_time || appointment.appointmentTime || '10:00 AM',
        status: appointment.status || 'BOOKED',
        token_number: appointment.token_number || appointment.tokenNumber || '#CF-201',
        queue_position: appointment.queue_position || appointment.queuePosition || 1,
        estimated_wait_time: appointment.estimated_wait_time || appointment.estimatedWaitTime || 8,
        room_no: appointment.room_no || appointment.roomNo || 'Room 204',
        reason: appointment.reason || appointment.reasonForVisit || 'Routine health consultation & checkup',
        doctor_name: appointment.doctor_name || appointment.doctorName || 'Assigned Specialist',
        department_name: appointment.department_name || appointment.departmentName || 'Specialty Care',
        specialization: appointment.specialization || (appointment.department_name || appointment.departmentName ? `${appointment.department_name || appointment.departmentName} Specialist` : 'Specialist Doctor'),
        patient_name: appointment.patient_name || appointment.patientName || user.fullName || 'Valued Patient'
      };
      setActiveApt(normalized);
      setLoading(false);
      return;
    }

    // 2. Check URL hash for direct deep-link from smartphone QR scan
    const hash = window.location.hash || '';
    if (hash.includes('id=') && (hash.includes('#digital-pass') || hash.includes('#pass'))) {
      try {
        const queryPart = hash.split('?')[1] || '';
        const params = new URLSearchParams(queryPart);
        const scannedAppt: any = {
          appointment_id: params.get('id') || 'APT-2026-88129',
          patient_id: params.get('patId') || user.patientId || 'PAT-2026-38372',
          doctor_id: '',
          department_id: '',
          appointment_date: params.get('date') || new Date().toISOString().split('T')[0],
          appointment_time: params.get('time') || '10:00 AM',
          status: 'BOOKED',
          token_number: params.get('token') || '#CF-201',
          queue_position: 1,
          estimated_wait_time: 8,
          room_no: params.get('room') || 'Room 204',
          reason: params.get('reason') || 'Routine health consultation & checkup',
          doctor_name: params.get('doc') || 'Assigned Specialist',
          department_name: params.get('dept') || 'Specialty Care',
          specialization: `${params.get('dept') || 'Medical'} Specialist`,
          patient_name: params.get('pat') || user.fullName || 'Valued Patient'
        };
        setActiveApt(scannedAppt);
        setLoading(false);
        return;
      } catch (e) {
        console.warn('Error parsing deep-link hash:', e);
      }
    }

    // 3. Fallback: Fetch user appointments from API
    if (user.patientId) {
      api.getMyAppointments(user.patientId)
        .then(res => {
          const apts: Appointment[] = res.appointments || [];
          // Active appointment: status in BOOKED, CHECKED_IN, IN_QUEUE, IN_CONSULTATION
          const active = apts.find(a => 
            a.status === 'IN_QUEUE' || 
            a.status === 'CHECKED_IN' || 
            a.status === 'BOOKED' || 
            a.status === 'IN_CONSULTATION'
          );

          if (active) {
            setActiveApt(active);
            const history = apts.filter(a => a.appointment_id !== active.appointment_id);
            setHistoryApts(history);
          } else if (apts.length > 0) {
            setActiveApt(apts[0]);
            setHistoryApts(apts.slice(1));
          } else {
            setActiveApt(null);
            setHistoryApts([]);
          }
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user.patientId, appointment]);

  return (
    <div style={{
      maxWidth: '700px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      padding: '10px 16px 40px 16px',
      animation: 'welcome-fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="apple-circle-action-btn" onClick={onBack} title="Back">
          <ArrowLeft size={16} />
        </button>

        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', animation: 'cf-pulse-glow 2s infinite' }} />
            <span>Official Patient Digital Pass</span>
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '2px 0 0 0', color: 'var(--text-primary)' }}>
            Active Token &amp; Assigned Doctor
          </h2>
        </div>

        <button 
          className="apple-circle-action-btn"
          onClick={() => window.print()}
          title="Print Token Pass"
        >
          <Printer size={16} />
        </button>
      </div>

      {loading ? (
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <div className="loading-spinner" style={{ margin: '0 auto 16px auto' }} />
          <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Loading active consultation pass...</p>
        </div>
      ) : activeApt ? (
        <>
          {/* Main Glowing Token Pass Hero */}
          <div className="card" style={{
            padding: '28px 24px',
            textAlign: 'center',
            borderRadius: '28px',
            background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--primary-light) 100%)',
            border: '1.5px solid var(--primary-border)',
            boxShadow: 'var(--shadow-xl)'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              border: '1px solid var(--primary-border)',
              padding: '4px 14px',
              borderRadius: '9999px',
              fontSize: '0.76rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '10px'
            }}>
              <Ticket size={13} />
              <span>Active Queue Token</span>
            </div>

            {/* Token Number Display */}
            <div style={{
              fontSize: '3.8rem',
              fontWeight: 900,
              lineHeight: 1,
              fontFamily: 'var(--font-heading)',
              background: 'linear-gradient(135deg, var(--primary) 0%, #06b6d4 50%, var(--secondary) 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 4px 10px rgba(20, 184, 166, 0.25))'
            }}>
              {activeApt.token_number ? (activeApt.token_number.startsWith('#') ? activeApt.token_number : `#${activeApt.token_number}`) : '#1'}
            </div>

            <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginTop: '8px' }}>
              Present this verified digital pass when called at your assigned OPD room
            </span>

            {/* 3 Status Metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              marginTop: '22px',
              paddingTop: '20px',
              borderTop: '1px solid var(--border-color)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Position</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                  #{activeApt.queue_position || 1} in line
                </div>
              </div>

              <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Est. Wait</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', marginTop: '2px' }}>
                  ~{activeApt.estimated_wait_time || 15} mins
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Clinic Room</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {activeApt.room_no || 'OPD-1'}
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Doctor Details Card */}
          <div className="card" style={{ padding: '20px', borderRadius: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Stethoscope size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Assigned Specialist Doctor
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
                  color: '#ffffff',
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 6px 16px rgba(20, 184, 166, 0.3)',
                  flexShrink: 0
                }}>
                  {(activeApt.doctor_name || 'Dr. Specialist').replace('Dr. ', '').charAt(0)}
                </div>

                <div>
                  <h4 style={{ fontSize: '1.12rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    {activeApt.doctor_name || 'Assigned Specialist'}
                  </h4>
                  <span style={{ fontSize: '0.84rem', color: 'var(--primary)', fontWeight: 700 }}>
                    {activeApt.specialization || (activeApt.department_name ? `${activeApt.department_name} Specialist` : 'Medical Specialist')}
                  </span>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                    Hospital Main Wing &bull; {activeApt.room_no || 'Room 204'} (Verified Slot)
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button 
                  className="apple-circle-action-btn active-teal"
                  style={{ width: '38px', height: '38px' }}
                  title="Call Clinic Desk"
                  onClick={() => alert(`Calling OPD clinic desk for ${activeApt.doctor_name}...`)}
                >
                  <Phone size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Patient Schedule & Reason Card */}
          <div className="card" style={{ padding: '20px', borderRadius: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <UserCheck size={18} color="var(--secondary)" />
              <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Patient Consultation Pass Details
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 18px', fontSize: '0.86rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem', fontWeight: 600, display: 'block' }}>Patient Name</span>
                <strong style={{ color: 'var(--text-primary)', fontSize: '0.96rem' }}>
                  {(activeApt as any).patient_name || (activeApt as any).patientName || user.fullName || 'Valued Patient'}
                </strong>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem', fontWeight: 600, display: 'block' }}>Patient ID</span>
                <strong style={{ color: 'var(--text-primary)', fontSize: '0.96rem' }}>
                  {(activeApt as any).patient_id || (activeApt as any).patientId || user.patientId || 'PAT-2026-38372'}
                </strong>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem', fontWeight: 600, display: 'block' }}>Appointment Date</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{activeApt.appointment_date}</span>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem', fontWeight: 600, display: 'block' }}>Scheduled Slot</span>
                <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{activeApt.appointment_time}</span>
              </div>

              <div style={{ gridColumn: 'span 2', background: 'var(--bg-muted)', padding: '12px 14px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>Presenting Health Problem</span>
                <p style={{ color: 'var(--text-primary)', fontSize: '0.84rem', margin: '3px 0 0 0', fontWeight: 500 }}>
                  {activeApt.reason || 'Clinical examination and doctor evaluation'}
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Empty State: No Doctor Assigned Yet */
        <div className="card" style={{ padding: '36px 24px', textAlign: 'center', borderRadius: '24px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto'
          }}>
            <Stethoscope size={32} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
            No Active Doctor Consultation Yet
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 20px auto', lineHeight: 1.5 }}>
            Describe your symptoms to our Clinical AI or choose an OPD time slot to assign your doctor and generate your live queue token.
          </p>
          {onBookNew && (
            <button className="btn btn-primary" onClick={onBookNew} style={{ padding: '10px 24px' }}>
              <Sparkles size={16} />
              <span>Consult AI &amp; Book Doctor</span>
            </button>
          )}
        </div>
      )}

      {/* Previous Consultations / Rebooking History */}
      {historyApts.length > 0 && (
        <div className="card" style={{ padding: '20px', borderRadius: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <History size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Previous Consultations &amp; Rebooking History
              </h3>
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {historyApts.length} Archived Session{historyApts.length > 1 ? 's' : ''}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {historyApts.map((hApt) => (
              <div 
                key={hApt.appointment_id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: '16px',
                  background: 'var(--bg-muted)',
                  border: '1px solid var(--border-color)',
                  transition: 'transform 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.82rem'
                  }}>
                    {hApt.token_number || '#'}
                  </div>
                  <div>
                    <h5 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                      {hApt.doctor_name}
                    </h5>
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                      {hApt.department_name} &bull; {hApt.appointment_date} at {hApt.appointment_time}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge badge-outline" style={{ fontSize: '0.72rem', textTransform: 'capitalize' }}>
                    {hApt.status.toLowerCase().replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div style={{ display: 'flex', gap: '12px' }}>
        {activeApt && (
          <button
            className="btn btn-primary btn-lg"
            style={{ flex: 1, padding: '14px' }}
            onClick={() => {
              if (onGoToLiveQueue) onGoToLiveQueue();
              else onBack();
            }}
          >
            <Activity size={18} />
            <span>Track Live Queue Turn</span>
          </button>
        )}

        <button
          className="btn btn-outline btn-lg"
          style={{ flex: activeApt ? undefined : 1, padding: '14px 20px' }}
          onClick={onBack}
        >
          <span>Back to Home</span>
        </button>
      </div>
    </div>
  );
};
