import React, { useState, useEffect } from 'react';
import { User, MedicalVisitRecord } from '../../types';
import { api } from '../../services/api';
import { 
  ArrowLeft, 
  MoreHorizontal, 
  Edit3, 
  FileText, 
  FlaskConical, 
  Scan, 
  Syringe, 
  Heart, 
  ChevronRight, 
  Plus, 
  Printer, 
  Pill, 
  Calendar 
} from 'lucide-react';

interface MedicalHistoryProps {
  user: User;
  onBack?: () => void;
}

export const MedicalHistory: React.FC<MedicalHistoryProps> = ({ user, onBack }) => {
  const [timeline, setTimeline] = useState<MedicalVisitRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    if (user.patientId) {
      setLoading(true);
      api.getPatientHistory(user.patientId)
        .then(res => {
          setTimeline(res.timeline || []);
        })
        .catch(err => console.error('Failed to load medical history:', err))
        .finally(() => setLoading(false));
    }
  }, [user.patientId]);

  const records = [
    {
      id: 'prescription',
      title: 'Prescription',
      updated: timeline.length > 0 ? `Updated ${timeline[0].appointment_date}` : 'Updated 20 May 2024',
      icon: <FileText size={18} />,
      bg: 'rgba(59, 130, 246, 0.12)',
      color: '#3b82f6',
      badge: `${timeline.length} Recorded`
    },
    {
      id: 'lab-reports',
      title: 'Lab Reports',
      updated: 'Updated 18 May 2024',
      icon: <FlaskConical size={18} />,
      bg: 'rgba(168, 85, 247, 0.12)',
      color: '#a855f7',
      badge: '2 Verified'
    },
    {
      id: 'xray-reports',
      title: 'X-Ray Reports',
      updated: 'Updated 15 May 2024',
      icon: <Scan size={18} />,
      bg: 'rgba(14, 165, 233, 0.12)',
      color: '#0ea5e9',
      badge: '1 Scan'
    },
    {
      id: 'vaccination',
      title: 'Vaccination',
      updated: 'Updated 10 May 2024',
      icon: <Syringe size={18} />,
      bg: 'rgba(13, 148, 136, 0.12)',
      color: '#0d9488',
      badge: 'Up to date'
    },
    {
      id: 'health-summary',
      title: 'Health Summary',
      updated: 'Updated 05 May 2024',
      icon: <Heart size={18} />,
      bg: 'rgba(244, 63, 94, 0.12)',
      color: '#f43f5e',
      badge: 'Healthy'
    }
  ];

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header matching Blueprint Screen 6 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="apple-circle-action-btn" onClick={onBack}>
          <ArrowLeft size={16} />
        </button>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
            Medical Records
          </h2>
          <span style={{ fontSize: '0.76rem', color: '#64748b' }}>
            Permanent Health Vault
          </span>
        </div>

        <button className="apple-circle-action-btn">
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Patient Profile Header Card matching Blueprint Screen 6 */}
      <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #38bdf8, #0284c7)',
            color: '#fff',
            fontSize: '1.3rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 14px rgba(2, 132, 199, 0.25)',
            flexShrink: 0
          }}>
            {user.fullName ? user.fullName.charAt(0) : 'A'}
          </div>

          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
              {user.fullName || 'Alex Johnson'}
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
              ID: {user.patientId || 'ALEX12345'} &bull; Blood: O+
            </span>
          </div>
        </div>

        <button className="apple-circle-action-btn" style={{ width: '34px', height: '34px' }}>
          <Edit3 size={15} color="#64748b" />
        </button>
      </div>

      {/* 5 Medical Record Category Items matching Blueprint Screen 6 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {records.map(rec => (
          <div 
            key={rec.id}
            className="card"
            style={{
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              borderRadius: '20px',
              border: activeCategory === rec.id ? '1.5px solid #0d9488' : '1px solid rgba(255,255,255,0.95)'
            }}
            onClick={() => setActiveCategory(activeCategory === rec.id ? null : rec.id)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '14px',
                background: rec.bg,
                color: rec.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {rec.icon}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h4 style={{ fontSize: '0.94rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                    {rec.title}
                  </h4>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#0d9488', background: 'rgba(13,148,136,0.1)', padding: '2px 8px', borderRadius: '9999px' }}>
                    {rec.badge}
                  </span>
                </div>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginTop: '2px' }}>
                  {rec.updated}
                </span>
              </div>
            </div>

            <ChevronRight size={18} color="#94a3b8" />
          </div>
        ))}
      </div>

      {/* Expanded Prescription Vault if selected */}
      {activeCategory === 'prescription' && (
        <div className="card" style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.95)', borderRadius: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>
              Doctor Prescriptions &amp; Notes
            </span>
            <button 
              className="btn btn-outline btn-sm"
              onClick={() => window.print()}
              style={{ fontSize: '0.74rem', padding: '4px 10px' }}
            >
              <Printer size={12} />
              <span>Print Rx</span>
            </button>
          </div>

          {timeline.length === 0 ? (
            <p style={{ fontSize: '0.84rem', color: '#64748b' }}>No clinical prescriptions on file yet.</p>
          ) : (
            timeline.map(item => (
              <div key={item.appointment_id} style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700 }}>
                  <span style={{ color: '#0d9488' }}>{item.doctor_name} ({item.specialization})</span>
                  <span style={{ color: '#64748b' }}>{item.appointment_date}</span>
                </div>
                {item.assessment && (
                  <p style={{ fontSize: '0.8rem', color: '#334155', marginTop: '4px', fontStyle: 'italic' }}>
                    &ldquo;{item.assessment}&rdquo;
                  </p>
                )}
                {item.medicines && item.medicines.length > 0 && (
                  <div style={{ marginTop: '6px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {item.medicines.map((m, idx) => (
                      <span key={idx} style={{ fontSize: '0.72rem', background: '#f0fdfa', color: '#0f766e', padding: '3px 8px', borderRadius: '8px', border: '1px solid #ccfbf1' }}>
                        💊 {m.medicine_name} ({m.dosage}) - {m.frequency}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Add New Record CTA Button matching Blueprint Screen 6 */}
      <div style={{ marginTop: '8px' }}>
        <button
          type="button"
          className="btn btn-primary btn-lg"
          style={{
            width: '100%',
            padding: '15px',
            fontSize: '0.96rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onClick={() => alert('Secure file upload dialog opened for adding lab report / vaccination record.')}
        >
          <span>Add New Record</span>
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Plus size={14} />
          </div>
        </button>
      </div>
    </div>
  );
};
