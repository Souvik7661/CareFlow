import React, { useState, useEffect } from 'react';
import { DiseaseItem } from '../../types';
import { api } from '../../services/api';
import { 
  Search, 
  Filter, 
  Flame, 
  Heart, 
  Brain, 
  Wind, 
  Activity, 
  Thermometer, 
  Sparkles, 
  Bone, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  ShieldAlert,
  Ambulance,
  Stethoscope,
  X,
  PhoneCall
} from 'lucide-react';

interface DiseaseCatalogGridProps {
  onSelectDisease: (disease: DiseaseItem) => void;
  onOpenAmbulance: () => void;
  onOpenHospitalMap: () => void;
}

export const DiseaseCatalogGrid: React.FC<DiseaseCatalogGridProps> = ({
  onSelectDisease,
  onOpenAmbulance,
  onOpenHospitalMap
}) => {
  const [diseases, setDiseases] = useState<DiseaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalDisease, setActiveModalDisease] = useState<DiseaseItem | null>(null);
  const [matchedDoctors, setMatchedDoctors] = useState<any[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  const categories = [
    'All',
    'Respiratory',
    'Cardiology',
    'Gastroenterology',
    'Orthopedics',
    'Dermatology',
    'Neurology',
    'ENT',
    'General',
    'Gynecology',
    'Urology',
    'Dental',
    'Mental Health'
  ];

  useEffect(() => {
    setLoading(true);
    api.getDiseases(selectedCategory, searchQuery)
      .then(res => {
        setDiseases(res.diseases || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedCategory, searchQuery]);

  const handleOpenDetail = (disease: DiseaseItem) => {
    setActiveModalDisease(disease);
    setLoadingDoctors(true);
    api.getDiseaseById(disease.disease_id)
      .then(res => {
        setMatchedDoctors(res.doctors || []);
      })
      .catch(() => {})
      .finally(() => setLoadingDoctors(false));
  };

  const getDiseaseIcon = (iconName?: string, category?: string) => {
    switch (category) {
      case 'Cardiology':
        return <Heart size={26} color="#ef4444" />;
      case 'Gastroenterology':
        return <Flame size={26} color="#f97316" />;
      case 'Neurology':
        return <Brain size={26} color="#8b5cf6" />;
      case 'Respiratory':
        return <Wind size={26} color="#06b6d4" />;
      case 'Orthopedics':
        return <Bone size={26} color="#eab308" />;
      case 'Dermatology':
        return <Sparkles size={26} color="#ec4899" />;
      case 'ENT':
        return <Activity size={26} color="#10b981" />;
      default:
        return <Thermometer size={26} color="#0d9488" />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px 28px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-primary">Comprehensive Visual Clinical Directory</span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>50 Common Diseases &amp; Conditions</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--text-primary)' }}>Select your main problem</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Browse visual condition cards to instantly match with hospital specialists and nearest clinics.
          </p>
        </div>

        {/* Quick Emergency & Maps Launcher */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-outline btn-sm"
            onClick={onOpenHospitalMap}
            style={{ borderColor: 'var(--primary)', color: 'var(--primary)', fontWeight: 600 }}
          >
            <span>View Hospitals Map</span>
          </button>

          <button 
            className="btn btn-sm"
            onClick={onOpenAmbulance}
            style={{ background: '#ef4444', color: '#ffffff', fontWeight: 700, gap: '6px' }}
          >
            <Ambulance size={15} />
            <span>Emergency Ambulance</span>
          </button>
        </div>
      </div>

      {/* Search Bar & Category Filters */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        {/* Search Input matching picture */}
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text"
            className="form-input"
            style={{ paddingLeft: '40px', background: 'var(--bg-muted)', border: '1px solid transparent' }}
            placeholder="Search symptoms or conditions (e.g. Gastritis, Chest Pain, Fever, Migraine)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
          {categories.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`cf-glass-pill ${isSelected ? 'active' : ''}`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Disease Cards Grid matching picture style */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        {diseases.map(d => {
          const isEmergency = d.urgency === 'Emergency' || d.requires_ambulance === 1;

          return (
            <div 
              key={d.disease_id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '16px',
                borderRadius: 'var(--radius-lg)',
                border: isEmergency ? '1.5px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--border-color)',
                background: isEmergency ? 'rgba(254, 242, 242, 0.3)' : '#ffffff',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer'
              }}
              onClick={() => handleOpenDetail(d)}
            >
              <div>
                {/* Visual Icon Illustration Box */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '70px',
                  background: 'var(--bg-muted)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '12px'
                }}>
                  {getDiseaseIcon(d.icon_name, d.category)}
                </div>

                {/* Title & Number */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {d.number}. {d.name}
                  </h3>
                </div>

                {/* Description */}
                <p style={{
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  lineHeight: '1.35',
                  marginBottom: '14px',
                  minHeight: '34px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {d.description}
                </p>
              </div>

              {/* Action Button matching picture */}
              <div>
                {isEmergency && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ef4444', fontSize: '0.72rem', fontWeight: 700, marginBottom: '6px' }}>
                    <ShieldAlert size={12} />
                    <span>CRITICAL / AMBULANCE</span>
                  </div>
                )}

                <button 
                  className="btn btn-sm"
                  style={{
                    width: '100%',
                    background: '#0d9488',
                    color: '#ffffff',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    padding: '6px 12px'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenDetail(d);
                  }}
                >
                  Select
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Disease Detail & Doctor Routing Modal */}
      {activeModalDisease && (
        <div className="modal-backdrop" onClick={() => setActiveModalDisease(null)}>
          <div 
            className="modal-content" 
            style={{ maxWidth: '650px', padding: '28px' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge badge-primary">{activeModalDisease.category}</span>
                  {activeModalDisease.requires_ambulance === 1 && (
                    <span className="badge badge-emergency">Requires Immediate Care</span>
                  )}
                </div>
                <h2 style={{ fontSize: '1.5rem', marginTop: '6px' }}>
                  {activeModalDisease.number}. {activeModalDisease.name}
                </h2>
              </div>
              <button 
                onClick={() => setActiveModalDisease(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '20px' }}>
              {activeModalDisease.description}
            </p>

            {/* Matched Specialist Department */}
            <div style={{
              background: 'var(--bg-muted)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 18px',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Recommended Clinical Specialty
                </span>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>
                  {activeModalDisease.recommended_specialty} Specialist
                </div>
              </div>
              <Stethoscope size={28} color="var(--primary)" />
            </div>

            {/* Emergency Ambulance Prompt if critical */}
            {activeModalDisease.requires_ambulance === 1 && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 'var(--radius-md)',
                padding: '14px 18px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#dc2626', fontSize: '0.9rem' }}>
                    Acute Medical Emergency Warning
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#7f1d1d' }}>
                    {activeModalDisease.name} can be life-threatening. Seek emergency room dispatch immediately.
                  </div>
                </div>
                <button 
                  className="btn btn-sm"
                  style={{ background: '#dc2626', color: '#fff', whiteSpace: 'nowrap' }}
                  onClick={() => {
                    setActiveModalDisease(null);
                    onOpenAmbulance();
                  }}
                >
                  <Ambulance size={14} />
                  <span>Call 108 Ambulance</span>
                </button>
              </div>
            )}

            {/* Available Doctors in Network */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '10px' }}>
                Affiliated Doctors for {activeModalDisease.name}
              </h4>

              {loadingDoctors ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Matching available hospital specialists...
                </div>
              ) : matchedDoctors.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto' }}>
                  {matchedDoctors.slice(0, 3).map(doc => (
                    <div 
                      key={doc.doctor_id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 14px',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-card)'
                      }}
                    >
                      <div>
                        <strong>{doc.name}</strong>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {doc.hospital_name || 'City Hospital'} &bull; {doc.hospital_distance || '2.4'} km away &bull; {doc.room_no}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.82rem', color: '#eab308', fontWeight: 700 }}>★ {doc.rating}</span>
                        <div style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>{doc.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  General Medicine and Emergency triage available for this condition.
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button 
                className="btn btn-outline"
                onClick={() => setActiveModalDisease(null)}
              >
                Close
              </button>

              <button 
                className="btn btn-primary"
                onClick={() => {
                  const diseaseToPass = activeModalDisease;
                  setActiveModalDisease(null);
                  onSelectDisease(diseaseToPass);
                }}
              >
                <span>Proceed with AI Triage &amp; Booking</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
