import React, { useState, useEffect } from 'react';
import { User, Appointment } from '../../types';
import { api } from '../../services/api';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  X, 
  RefreshCw, 
  Download,
  Stethoscope
} from 'lucide-react';

interface MyAppointmentsProps {
  user: User;
  onBookNew: () => void;
  onGoToCheckIn: (aptId?: string) => void;
  onGoToLiveQueue: () => void;
}

export const MyAppointments: React.FC<MyAppointmentsProps> = ({
  user,
  onBookNew,
  onGoToCheckIn,
  onGoToLiveQueue
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'UPCOMING' | 'COMPLETED'>('ALL');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchAppointments = () => {
    if (user.patientId) {
      setLoading(true);
      api.getMyAppointments(user.patientId)
        .then(res => setAppointments(res.appointments || []))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user.patientId]);

  const handleCancel = async (aptId: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await api.cancelAppointment(aptId);
        setActionMessage('Appointment cancelled successfully.');
        fetchAppointments();
      } catch (err: any) {
        alert(err.message || 'Failed to cancel appointment.');
      }
    }
  };

  const filteredAppointments = appointments.filter(a => {
    if (filter === 'UPCOMING') return a.status === 'BOOKED' || a.status === 'CHECKED_IN';
    if (filter === 'COMPLETED') return a.status === 'COMPLETED';
    return true;
  });

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>My Appointments</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Manage your hospital visits, check in on arrival, or review past consultations.
          </p>
        </div>

        <button className="btn btn-primary" onClick={onBookNew}>
          <Plus size={16} />
          <span>New Appointment</span>
        </button>
      </div>

      {actionMessage && (
        <div style={{
          background: 'var(--success-bg)',
          border: '1px solid var(--success-border)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 14px',
          color: 'var(--success)',
          fontSize: '0.88rem',
          marginBottom: '18px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle size={16} />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {(['ALL', 'UPCOMING', 'COMPLETED'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.84rem',
              fontWeight: 600,
              background: filter === f ? 'var(--primary)' : 'var(--bg-card)',
              color: filter === f ? '#ffffff' : 'var(--text-secondary)',
              border: '1px solid',
              borderColor: filter === f ? 'var(--primary)' : 'var(--border-color)',
              cursor: 'pointer'
            }}
          >
            {f === 'ALL' ? 'All Visits' : (f === 'UPCOMING' ? 'Upcoming / Active' : 'Completed')}
          </button>
        ))}
      </div>

      {/* Appointment Cards List */}
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading appointments...
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <Calendar size={40} color="var(--text-light)" style={{ marginBottom: '12px' }} />
          <h3>No appointments found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>
            You have no appointments under this filter.
          </p>
          <button className="btn btn-primary btn-sm" onClick={onBookNew}>
            Find Doctor &amp; Book
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredAppointments.map(apt => {
            const isToday = apt.appointment_date === new Date().toISOString().split('T')[0];
            const isBooked = apt.status === 'BOOKED';
            const isCheckedIn = apt.status === 'CHECKED_IN';
            const isCompleted = apt.status === 'COMPLETED';

            let statusBadgeClass = 'badge-neutral';
            if (isCompleted) statusBadgeClass = 'badge-success';
            if (isCheckedIn) statusBadgeClass = 'badge-info';
            if (isBooked) statusBadgeClass = 'badge-primary';
            if (apt.status === 'CANCELLED') statusBadgeClass = 'badge-danger';

            return (
              <div key={apt.appointment_id} className="card" style={{ padding: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span className={`badge ${statusBadgeClass}`}>{apt.status}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                        {apt.appointment_id}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', marginTop: '4px' }}>
                      {apt.doctor_name}
                    </h3>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                      {apt.specialization} &bull; {apt.department_name}
                    </p>
                  </div>

                  {/* Token pill if checked in */}
                  {apt.token_number && (
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Queue Token</span>
                      <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
                        {apt.token_number}
                      </span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', margin: '14px 0', padding: '12px 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.86rem' }}>
                    <Calendar size={15} color="var(--primary)" />
                    <span>{apt.appointment_date} {isToday && <strong style={{ color: 'var(--primary)' }}>(Today)</strong>}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.86rem' }}>
                    <Clock size={15} color="var(--primary)" />
                    <span>{apt.appointment_time}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.86rem' }}>
                    <MapPin size={15} color="var(--primary)" />
                    <span>{apt.room_no} ({apt.room_wing || 'Wing A'})</span>
                  </div>
                </div>

                {apt.reason && (
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                    <strong>Reason for visit:</strong> {apt.reason}
                  </div>
                )}

                {/* Actions Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {isBooked && (
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => onGoToCheckIn(apt.appointment_id)}
                      >
                        Check In Now
                      </button>
                    )}

                    {isCheckedIn && (
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={onGoToLiveQueue}
                      >
                        Live Queue Radar
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {isBooked && (
                      <button 
                        className="btn btn-outline btn-sm"
                        style={{ color: 'var(--danger)', borderColor: 'var(--danger-border)' }}
                        onClick={() => handleCancel(apt.appointment_id)}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
