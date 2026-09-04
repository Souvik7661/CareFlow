import React, { useState } from 'react';
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  Download, 
  User as UserIcon, 
  FileText, 
  ArrowRight,
  Sparkles,
  QrCode
} from 'lucide-react';

interface AppointmentConfirmationProps {
  appointment: any;
  onGoToCheckIn: () => void;
  onGoToMyAppointments: () => void;
  onGoToDashboard: () => void;
}

export const AppointmentConfirmation: React.FC<AppointmentConfirmationProps> = ({
  appointment,
  onGoToCheckIn,
  onGoToMyAppointments,
  onGoToDashboard
}) => {
  const [calendarDownloaded, setCalendarDownloaded] = useState(false);

  // Generate standard iCalendar (.ics) content
  const handleDownloadCalendar = () => {
    const title = `Hospital Appointment: ${appointment.doctorName} (${appointment.departmentName})`;
    const description = `CareFlow AI Appointment ID: ${appointment.appointmentId}. Please check in upon arrival at ${appointment.roomNo}.`;
    const location = `CareFlow Apex Hospital - ${appointment.roomNo}, ${appointment.wing || 'Block A'}`;
    
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CareFlow AI//Hospital Appointment//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      `DTSTART:${appointment.appointmentDate.replace(/-/g, '')}T090000Z`,
      `DTEND:${appointment.appointmentDate.replace(/-/g, '')}T093000Z`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${appointment.appointmentId}_CareFlow.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setCalendarDownloaded(true);
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      {/* Success Card */}
      <div className="card" style={{ textAlign: 'center', padding: '40px 32px' }}>
        {/* Animated Check icon */}
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--success-bg)',
          color: 'var(--success)',
          border: '2px solid var(--success-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto',
          boxShadow: '0 0 25px rgba(5, 150, 105, 0.2)'
        }}>
          <CheckCircle size={38} />
        </div>

        <h1 style={{ fontSize: '2.2rem', marginBottom: '6px', color: 'var(--text-primary)' }}>
          Appointment Confirmed
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '28px' }}>
          Your consultation has been successfully scheduled in the hospital database.
        </p>

        {/* Voucher Pass Card */}
        <div style={{
          background: 'var(--bg-main)',
          border: '1.5px dashed var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          textAlign: 'left',
          marginBottom: '28px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px', marginBottom: '16px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Appointment Reference ID
              </span>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.04em' }}>
                {appointment.appointmentId}
              </div>
            </div>

            <div style={{
              background: '#ffffff',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--text-secondary)'
            }}>
              <QrCode size={18} color="var(--primary)" />
              <span>Digital Pass</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Patient Name</span>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{appointment.patientName}</div>
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Attending Specialist</span>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{appointment.doctorName}</div>
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Department</span>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{appointment.departmentName}</div>
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Consultation Room</span>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--primary)' }}>
                {appointment.roomNo} ({appointment.wing || 'Main Wing'})
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Scheduled Date</span>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={15} color="var(--text-muted)" />
                <span>{appointment.appointmentDate}</span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Slot Time</span>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={15} color="var(--text-muted)" />
                <span>{appointment.appointmentTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Arrival Check-In Callout */}
        <div style={{
          background: 'var(--primary-light)',
          border: '1px solid var(--primary-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          marginBottom: '28px',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '4px' }}>
            Please check in when you arrive at the hospital
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 16px auto' }}>
            Check-in assigns your real-time queue token (e.g. C-027) and begins dynamic wait-time optimization.
          </p>

          <button 
            className="btn btn-primary"
            style={{ padding: '12px 24px' }}
            onClick={onGoToCheckIn}
          >
            <span>Proceed to Hospital Check-In</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Calendar & Navigation Options */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-outline"
            onClick={handleDownloadCalendar}
          >
            <Download size={16} />
            <span>{calendarDownloaded ? 'Downloaded (.ics)' : 'Add to Calendar'}</span>
          </button>

          <button 
            className="btn btn-outline"
            onClick={onGoToMyAppointments}
          >
            <Calendar size={16} />
            <span>View All Appointments</span>
          </button>

          <button 
            className="btn btn-outline"
            onClick={onGoToDashboard}
          >
            <span>Return to Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
