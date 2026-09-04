import React, { useState, useEffect } from 'react';
import { User, LiveQueueStatus } from '../../types';
import { api } from '../../services/api';
import { 
  Activity, 
  Clock, 
  Users, 
  MapPin, 
  CheckCircle, 
  AlertCircle, 
  BellRing, 
  Sparkles,
  RefreshCw,
  Stethoscope
} from 'lucide-react';

interface LiveQueueScreenProps {
  user: User;
  onGoToCheckIn: () => void;
}

export const LiveQueueScreen: React.FC<LiveQueueScreenProps> = ({
  user,
  onGoToCheckIn
}) => {
  const [queueStatus, setQueueStatus] = useState<LiveQueueStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [pulseHighlight, setPulseHighlight] = useState(false);

  const fetchQueue = () => {
    if (user.patientId) {
      api.getPatientQueueStatus(user.patientId).then(res => {
        setQueueStatus(res);
        setLastUpdated(new Date());
        setPulseHighlight(true);
        setTimeout(() => setPulseHighlight(false), 1200);
      }).catch(err => {
        console.error('Failed to fetch queue:', err);
      }).finally(() => {
        setLoading(false);
      });
    }
  };

  useEffect(() => {
    fetchQueue();

    // Connect to Server-Sent Events (SSE) for real-time queue recalculations
    const eventSource = new EventSource('/api/queue/events');

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event === 'QUEUE_OPTIMIZED' || data.event === 'PATIENT_CALLED' || data.event === 'DOCTOR_DELAY') {
          fetchQueue();
        }
      } catch (err) {
        console.error('SSE parse error:', err);
      }
    };

    // Periodic fallback poll every 8 seconds
    const interval = setInterval(fetchQueue, 8000);

    return () => {
      eventSource.close();
      clearInterval(interval);
    };
  }, [user.patientId]);

  if (loading) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <Activity size={32} className="pulse-indicator" style={{ marginBottom: '12px' }} />
        <div>Connecting to AI Queue Optimization Engine...</div>
      </div>
    );
  }

  if (!queueStatus?.hasActiveQueue) {
    return (
      <div className="card" style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center', padding: '40px' }}>
        <Clock size={48} color="var(--text-light)" style={{ marginBottom: '16px' }} />
        <h2 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>No Active Queue Entry Found</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px' }}>
          You are currently not checked into the hospital queue. If you have an appointment today, please check in to receive your queue token.
        </p>
        <button className="btn btn-primary" onClick={onGoToCheckIn}>
          Go to Hospital Check-In
        </button>
      </div>
    );
  }

  const isCalled = queueStatus.status === 'CALLED';
  const isInConsultation = queueStatus.status === 'IN_CONSULTATION';
  const isAlmostThere = queueStatus.patientsAhead === 1;

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Dynamic Proximity Alert Callout */}
      {isCalled && (
        <div style={{
          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          color: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          padding: '20px 24px',
          boxShadow: '0 8px 25px rgba(2, 132, 199, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          animation: 'call-pulse 1.5s infinite'
        }}>
          <BellRing size={32} />
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.01em' }}>
              YOUR TOKEN IS CALLED!
            </div>
            <div style={{ fontSize: '0.95rem', opacity: 0.95 }}>
              Please proceed immediately to <strong>{queueStatus.roomNo}</strong>. Dr. {queueStatus.doctorName} is ready for your consultation.
            </div>
          </div>
        </div>
      )}

      {isInConsultation && (
        <div style={{
          background: 'var(--success-bg)',
          border: '2px solid var(--success-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '18px 22px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          color: 'var(--success)'
        }}>
          <CheckCircle size={26} />
          <div>
            <strong style={{ fontSize: '1.05rem', display: 'block' }}>Consultation in Progress</strong>
            <span style={{ fontSize: '0.88rem', color: '#065f46' }}>You are currently with the attending doctor in {queueStatus.roomNo}.</span>
          </div>
        </div>
      )}

      {!isCalled && !isInConsultation && isAlmostThere && (
        <div style={{
          background: 'var(--warning-bg)',
          border: '1.5px solid var(--warning-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: 'var(--warning)'
        }}>
          <AlertCircle size={22} />
          <div>
            <strong style={{ fontSize: '0.95rem', display: 'block' }}>You're almost next!</strong>
            <span style={{ fontSize: '0.86rem', color: '#92400e' }}>Only 1 patient ahead. Please remain seated near {queueStatus.roomNo}.</span>
          </div>
        </div>
      )}

      {/* Main Radar Card */}
      <div className={`queue-hero-card ${pulseHighlight ? 'card-pulse' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="pulse-indicator" />
            <span style={{ color: '#38bdf8', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Live AI Queue Stream
            </span>
          </div>

          <button 
            onClick={fetchQueue} 
            style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
            title="Refresh now"
          >
            <RefreshCw size={12} />
            <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
          </button>
        </div>

        <div style={{ marginTop: '16px' }}>
          <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Your Assigned Token</span>
          <div className="queue-token-display">
            {queueStatus.tokenNumber}
          </div>
        </div>

        {/* 4-Column Live Metric Matrix */}
        <div className="queue-stats-row">
          <div className="queue-stat-item">
            <span className="queue-stat-label">Now Serving</span>
            <span className="queue-stat-value" style={{ color: '#f59e0b' }}>
              {queueStatus.nowServingToken || 'None'}
            </span>
          </div>

          <div className="queue-stat-item">
            <span className="queue-stat-label">Patients Ahead</span>
            <span className="queue-stat-value">{queueStatus.patientsAhead}</span>
          </div>

          <div className="queue-stat-item">
            <span className="queue-stat-label">Est. Waiting Time</span>
            <span className="queue-stat-value" style={{ color: '#38bdf8' }}>
              {queueStatus.status === 'IN_CONSULTATION' ? '0 min' : `~${queueStatus.estimatedWaitTime} mins`}
            </span>
          </div>

          <div className="queue-stat-item">
            <span className="queue-stat-label">Est. Consultation</span>
            <span className="queue-stat-value" style={{ fontSize: '1.25rem' }}>
              {queueStatus.estimatedConsultationTime || 'Calculating...'}
            </span>
          </div>
        </div>
      </div>

      {/* Consultation Details Card */}
      <div className="card">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '14px', color: 'var(--text-primary)' }}>
          Consultation Location &amp; Specialist
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Stethoscope size={20} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Attending Doctor</span>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{queueStatus.doctorName}</div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{queueStatus.specialization}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--info-bg)', color: 'var(--info)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={20} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Clinic Room &amp; Wing</span>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary)' }}>{queueStatus.roomNo}</div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{queueStatus.departmentName}</span>
            </div>
          </div>
        </div>

        {/* AI Optimization Notice */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <Sparkles size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
            <strong>AI Optimization Active:</strong> Waiting times adjust automatically in real-time as the attending doctor progresses through consultations, handles delays, or calls subsequent patients.
          </p>
        </div>
      </div>
    </div>
  );
};
