import React, { useState } from 'react';
import { sessionManager } from '../../services/session';
import { PatientQRCodeModal } from './PatientQRCodeModal';
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  Download, 
  User as UserIcon, 
  ArrowRight,
  Sparkles,
  QrCode,
  Ticket,
  Activity,
  Home
} from 'lucide-react';

interface AppointmentConfirmationProps {
  appointment: any;
  onGoToCheckIn: () => void;
  onGoToMyAppointments: () => void;
  onGoToDashboard: () => void;
  onGoToLiveQueue?: () => void;
  onViewPass?: (appointment: any) => void;
}

export const AppointmentConfirmation: React.FC<AppointmentConfirmationProps> = ({
  appointment,
  onGoToCheckIn,
  onGoToMyAppointments,
  onGoToDashboard,
  onGoToLiveQueue,
  onViewPass
}) => {
  const [calendarDownloaded, setCalendarDownloaded] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  // Resilient Field Fallback Accessors
  let defaultPatName = 'Valued Patient';
  try {
    const savedUser = sessionManager.getUser();
    if (savedUser && savedUser.fullName) {
      defaultPatName = savedUser.fullName;
    }
  } catch (e) {}

  const apptId = appointment?.appointmentId || appointment?.appointment_id || 'APT-2026-88129';
  const patName = appointment?.patientName || appointment?.patient_name || defaultPatName;
  const docName = appointment?.doctorName || appointment?.doctor_name || 'Assigned Specialist Doctor';
  const deptName = appointment?.departmentName || appointment?.department_name || 'Specialty Care';
  const roomNumber = appointment?.roomNo || appointment?.room_no || 'Room 204';
  const roomWing = appointment?.wing || appointment?.room_wing || appointment?.roomWing || 'Block A • OPD Wing';
  const apptDate = appointment?.appointmentDate || appointment?.appointment_date || new Date().toISOString().split('T')[0];
  const apptTime = appointment?.appointmentTime || appointment?.appointment_time || '10:00 AM';
  const rawToken = appointment?.tokenNumber || appointment?.token_number || '#CF-201';
  const displayToken = (rawToken || '').startsWith('#') ? rawToken : `#${rawToken}`;
  const isOfflinePass = !!appointment?.isOffline;

  // Generate standard iCalendar (.ics) content
  const handleDownloadCalendar = () => {
    const title = `Hospital Appointment: ${docName} (${deptName})`;
    const description = `CareFlow AI Appointment ID: ${apptId}. Room: ${roomNumber} (${roomWing}). Token: ${displayToken}. Please check in upon arrival.`;
    const location = `CareFlow Apex Hospital - ${roomNumber}, ${roomWing}`;
    const cleanDate = (apptDate || '').replace(/-/g, '');
    
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CareFlow AI//Hospital Appointment//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      `DTSTART:${cleanDate || '20260904'}T090000Z`,
      `DTEND:${cleanDate || '20260904'}T093000Z`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${apptId}_CareFlow.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setCalendarDownloaded(true);
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Success Card */}
      <div className="card" style={{ textAlign: 'center', padding: '36px 28px', borderRadius: '26px' }}>
        {/* Animated Check icon */}
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'var(--success-bg)',
          color: 'var(--success)',
          border: '2px solid var(--success-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px auto',
          boxShadow: '0 0 25px rgba(5, 150, 105, 0.25)'
        }}>
          <CheckCircle size={38} />
        </div>

        <h1 style={{ fontSize: '2.1rem', marginBottom: '6px', color: 'var(--text-primary)', fontWeight: 800 }}>
          Appointment Confirmed
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', marginBottom: '24px' }}>
          Your consultation has been successfully scheduled and recorded in the hospital database.
        </p>

        {/* Voucher Pass Card */}
        <div style={{
          background: 'var(--bg-main)',
          border: '1.5px dashed var(--border-color)',
          borderRadius: '20px',
          padding: '24px',
          textAlign: 'left',
          marginBottom: '24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {/* Header Strip with Reference ID and Token Badge */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px', marginBottom: '16px' }}>
            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.04em' }}>
                APPOINTMENT REFERENCE ID
              </span>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '0.04em', marginTop: '2px' }}>
                {apptId}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                color: '#ffffff',
                borderRadius: '12px',
                padding: '6px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.88rem',
                fontWeight: 800,
                boxShadow: '0 4px 12px rgba(13, 148, 136, 0.35)'
              }}>
                <Ticket size={16} />
                <span>TOKEN {displayToken}</span>
              </div>

              {isOfflinePass && (
                <div style={{
                  background: 'rgba(245, 158, 11, 0.16)',
                  border: '1px solid #f59e0b',
                  color: '#f59e0b',
                  borderRadius: '10px',
                  padding: '6px 10px',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span>⚡ RURAL OFFLINE PASS</span>
                </div>
              )}

              <button 
                type="button"
                onClick={() => setShowQrModal(true)}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '6px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(20, 184, 166, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.06)';
                }}
                title="Tap to view QR Code & Digital Pass"
              >
                <QrCode size={16} color="var(--primary)" />
                <span>Pass</span>
              </button>
            </div>
          </div>

          {/* Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Patient Name</span>
              <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                {patName}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Attending Specialist</span>
              <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                {docName}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Department</span>
              <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                {deptName}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Consultation Room</span>
              <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--primary)', marginTop: '2px' }}>
                {roomNumber} <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>({roomWing})</span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Scheduled Date</span>
              <div style={{ fontWeight: 800, fontSize: '0.96rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <Calendar size={15} color="var(--primary)" />
                <span>{apptDate}</span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Slot Time</span>
              <div style={{ fontWeight: 800, fontSize: '0.96rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <Clock size={15} color="var(--primary)" />
                <span>{apptTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Arrival Check-In Callout */}
        <div style={{
          background: 'var(--primary-light)',
          border: '1.5px solid var(--primary-border)',
          borderRadius: '20px',
          padding: '22px',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--primary)', fontWeight: 800, marginBottom: '6px' }}>
            Please check in when you arrive at the hospital
          </h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 16px auto', lineHeight: 1.45 }}>
            Check-in activates your real-time queue position with Dr. AI and notifies the attending doctor's room.
          </p>

          <button 
            className="btn btn-primary btn-lg"
            style={{ padding: '12px 28px', borderRadius: '9999px', fontSize: '0.95rem', fontWeight: 800 }}
            onClick={onGoToCheckIn}
          >
            <span>Proceed to Hospital Check-In</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {onViewPass && (
            <button 
              className="btn btn-primary"
              style={{ fontSize: '0.84rem', borderRadius: '9999px', padding: '8px 18px', background: 'linear-gradient(135deg, #0d9488, #0f766e)' }}
              onClick={() => onViewPass(appointment)}
            >
              <Ticket size={15} />
              <span>Official Digital Pass ({displayToken})</span>
            </button>
          )}

          {onGoToLiveQueue && (
            <button 
              className="btn btn-outline"
              style={{ fontSize: '0.84rem', borderRadius: '9999px', padding: '8px 18px' }}
              onClick={onGoToLiveQueue}
            >
              <Activity size={15} />
              <span>View Live Queue Status</span>
            </button>
          )}

          <button 
            className="btn btn-outline"
            style={{ fontSize: '0.84rem', borderRadius: '9999px', padding: '8px 18px' }}
            onClick={handleDownloadCalendar}
          >
            <Download size={15} />
            <span>{calendarDownloaded ? 'Downloaded (.ics)' : 'Add to Calendar'}</span>
          </button>

          <button 
            className="btn btn-outline"
            style={{ fontSize: '0.84rem', borderRadius: '9999px', padding: '8px 18px' }}
            onClick={onGoToMyAppointments}
          >
            <Calendar size={15} />
            <span>View All Appointments</span>
          </button>

          <button 
            className="btn btn-outline"
            style={{ fontSize: '0.84rem', borderRadius: '9999px', padding: '8px 18px' }}
            onClick={onGoToDashboard}
          >
            <Home size={15} />
            <span>Back to Home &amp; Quick Actions</span>
          </button>
        </div>
      </div>

      {/* QR Code Pass Modal */}
      {showQrModal && (
        <PatientQRCodeModal 
          isOpen={showQrModal}
          onClose={() => setShowQrModal(false)}
          appointment={appointment}
          onViewDigitalPass={() => {
            setShowQrModal(false);
            if (onViewPass) {
              onViewPass(appointment);
            }
          }}
        />
      )}
    </div>
  );
};
