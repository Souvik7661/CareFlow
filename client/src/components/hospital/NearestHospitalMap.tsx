import React, { useState, useEffect } from 'react';
import { Hospital } from '../../types';
import { api } from '../../services/api';
import { GoogleMapEngine, GoogleMapMarker } from '../maps/GoogleMapEngine';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  ExternalLink, 
  Star, 
  Clock, 
  Navigation, 
  Ambulance, 
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
  Stethoscope
} from 'lucide-react';

interface NearestHospitalMapProps {
  onBack: () => void;
  onSelectHospital?: (hospital: Hospital) => void;
  onOpenAmbulance: (hospitalId: string) => void;
  onBookDoctor?: (doctor: any) => void;
}

export const NearestHospitalMap: React.FC<NearestHospitalMapProps> = ({
  onBack,
  onSelectHospital,
  onOpenAmbulance,
  onBookDoctor
}) => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [hospitalDoctors, setHospitalDoctors] = useState<any[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loading, setLoading] = useState(true);

  // Default patient coordinates (Central Kolkata: MG Road area)
  const userLat = 22.5680;
  const userLng = 88.3610;

  useEffect(() => {
    setLoading(true);
    api.getHospitals()
      .then(res => {
        setHospitals(res.hospitals || []);
        if (res.hospitals && res.hospitals.length > 0) {
          setSelectedHospital(res.hospitals[0]);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedHospital) {
      setLoadingDoctors(true);
      api.getHospitalById(selectedHospital.hospital_id)
        .then(res => {
          setHospitalDoctors(res.doctors || []);
        })
        .catch(() => {
          setHospitalDoctors([]);
        })
        .finally(() => setLoadingDoctors(false));
    } else {
      setHospitalDoctors([]);
    }
  }, [selectedHospital?.hospital_id]);

  const handleSelect = (h: Hospital) => {
    setSelectedHospital(h);
    if (onSelectHospital) {
      onSelectHospital(h);
    }
  };

  const mapMarkers: GoogleMapMarker[] = [
    {
      id: 'user-current-location',
      lat: userLat,
      lng: userLng,
      title: 'Your Current Location',
      type: 'user',
      info: 'Central Station / MG Road'
    },
    ...hospitals.map(h => ({
      id: h.hospital_id,
      lat: h.latitude,
      lng: h.longitude,
      title: h.name,
      type: 'hospital' as const,
      info: `${h.address} • ${h.distance_km} km`,
      rating: h.rating,
      distanceKm: h.distance_km,
      isSelected: selectedHospital?.hospital_id === h.hospital_id,
      onClick: () => handleSelect(h)
    }))
  ];

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header matching Screen 6 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button 
          className="btn btn-outline btn-sm"
          onClick={onBack}
          style={{ width: '36px', height: '36px', padding: 0, borderRadius: '50%' }}
        >
          <ArrowLeft size={18} />
        </button>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Find Nearest Hospital</h2>
        <button 
          className="btn btn-sm"
          onClick={() => onOpenAmbulance(selectedHospital?.hospital_id || 'HOSP-01')}
          style={{ background: '#ef4444', color: '#fff', fontSize: '0.78rem', gap: '4px' }}
        >
          <Ambulance size={13} />
          <span>Ambulance</span>
        </button>
      </div>

      {/* Subtitle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
          Hospitals Near You (Google Maps GPS)
        </span>
        <span style={{ fontSize: '0.78rem', color: '#0d9488', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} />
          Live Google Traffic &amp; Navigation Ready
        </span>
      </div>

      {/* Google Maps Interactive View with Live Traffic Layer & Turn-by-Turn Navigation */}
      <GoogleMapEngine
        center={selectedHospital ? { lat: selectedHospital.latitude, lng: selectedHospital.longitude } : { lat: userLat, lng: userLng }}
        zoom={13}
        markers={mapMarkers}
        height="260px"
        showTrafficToggle={true}
        showNavigationButton={true}
        title="Nearest Hospital Google Maps"
        route={selectedHospital ? {
          origin: { lat: userLat, lng: userLng, label: 'Your Location' },
          destination: { lat: selectedHospital.latitude, lng: selectedHospital.longitude, label: selectedHospital.name }
        } : undefined}
        onSelectMarker={(id) => {
          const found = hospitals.find(h => h.hospital_id === id);
          if (found) handleSelect(found);
        }}
      />

      {/* Selected Hospital Highlight Card */}
      {selectedHospital && (
        <div className="card" style={{ padding: '18px', border: '1.5px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{selectedHospital.name}</h3>
                <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>24/7 Open</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', marginTop: '3px' }}>
                {selectedHospital.address}
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>
                {selectedHospital.distance_km} km
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#eab308', fontSize: '0.82rem', fontWeight: 700 }}>
                <Star size={12} fill="#eab308" />
                <span>{selectedHospital.rating}</span>
                <span style={{ color: 'var(--text-muted)' }}>({selectedHospital.total_reviews})</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
            <a 
              href={selectedHospital.google_maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
              style={{ flex: 1, gap: '6px', fontSize: '0.82rem' }}
            >
              <ExternalLink size={14} />
              <span>Directions on Google Maps</span>
            </a>

            <a 
              href={`tel:${selectedHospital.emergency_phone}`}
              className="btn btn-outline btn-sm"
              style={{ flex: 1, gap: '6px', fontSize: '0.82rem', color: '#0d9488', borderColor: '#0d9488' }}
            >
              <Phone size={14} />
              <span>Emergency: {selectedHospital.emergency_phone}</span>
            </a>

            <button
              className="btn btn-sm"
              style={{ background: '#ef4444', color: '#ffffff', gap: '6px', fontSize: '0.82rem' }}
              onClick={() => onOpenAmbulance(selectedHospital.hospital_id)}
            >
              <Ambulance size={14} />
              <span>Dispatch Ambulance</span>
            </button>
          </div>

          {/* Specialist Doctors Available at Selected Hospital */}
          <div style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Stethoscope size={16} color="var(--primary)" />
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Specialist Doctors at this Hospital ({hospitalDoctors.length})
                </span>
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                OPD Consultations
              </span>
            </div>

            {loadingDoctors ? (
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', padding: '10px 0', textAlign: 'center' }}>
                Loading specialists...
              </div>
            ) : hospitalDoctors.length === 0 ? (
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', padding: '10px 0', textAlign: 'center' }}>
                No doctors listed for this hospital.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {hospitalDoctors.map(doc => (
                  <div
                    key={doc.doctor_id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'var(--bg-card)',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      gap: '10px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: 'var(--primary-light)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        flexShrink: 0
                      }}>
                        Dr
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {doc.name}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '2px' }}>
                          <span className="badge badge-primary" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                            {doc.specialization}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {doc.room_no || 'OPD Room'} &bull; ₹{doc.consultation_fee || 500}
                          </span>
                        </div>
                      </div>
                    </div>

                    {onBookDoctor && (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        style={{ padding: '6px 14px', fontSize: '0.76rem', flexShrink: 0, borderRadius: '9999px' }}
                        onClick={() => onBookDoctor({
                          ...doc,
                          hospital_name: selectedHospital.name,
                          hospital_distance: selectedHospital.distance_km,
                          hospitalDistance: selectedHospital.distance_km
                        })}
                      >
                        Book
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hospital Cards List matching Screen 6 in image */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {hospitals.map(h => {
          const isSelected = selectedHospital?.hospital_id === h.hospital_id;

          return (
            <div
              key={h.hospital_id}
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: 'var(--radius-lg)',
                border: isSelected ? '1.5px solid #0d9488' : '1px solid var(--border-color)',
                cursor: 'pointer',
                background: isSelected ? 'rgba(13, 148, 136, 0.04)' : '#ffffff',
                transition: 'all 0.2s'
              }}
              onClick={() => handleSelect(h)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: isSelected ? '#0d9488' : 'var(--bg-muted)',
                  color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <MapPin size={20} />
                </div>

                <div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 800 }}>{h.name}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    <span style={{ color: '#eab308', fontWeight: 700 }}>★ {h.rating}</span>
                    <span>&bull;</span>
                    <span style={{ color: 'var(--success)', fontWeight: 600 }}>24/7 Open</span>
                    {(h as any).doctor_count !== undefined && (
                      <>
                        <span>&bull;</span>
                        <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{(h as any).doctor_count} Specialists</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  {h.distance_km} km
                </span>
                <ChevronRight size={18} color="var(--text-muted)" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
