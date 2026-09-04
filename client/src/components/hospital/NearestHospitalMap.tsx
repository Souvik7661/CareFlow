import React, { useState, useEffect, useRef } from 'react';
import { Hospital } from '../../types';
import { api } from '../../services/api';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
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
  CheckCircle2
} from 'lucide-react';

interface NearestHospitalMapProps {
  onBack: () => void;
  onSelectHospital?: (hospital: Hospital) => void;
  onOpenAmbulance: (hospitalId: string) => void;
}

export const NearestHospitalMap: React.FC<NearestHospitalMapProps> = ({
  onBack,
  onSelectHospital,
  onOpenAmbulance
}) => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [loading, setLoading] = useState(true);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

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

  // Initialize and update Leaflet interactive map
  useEffect(() => {
    if (!mapContainerRef.current || hospitals.length === 0) return;

    if (!mapInstanceRef.current) {
      // Create Leaflet Map
      const map = L.map(mapContainerRef.current, {
        center: [userLat, userLng],
        zoom: 13,
        zoomControl: true
      });

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      // User location marker
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `<div style="background:#0284c7; width:16px; height:16px; border-radius:50%; border:3px solid #ffffff; box-shadow:0 0 10px rgba(2,132,199,0.7);"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });
      L.marker([userLat, userLng], { icon: userIcon })
        .addTo(map)
        .bindPopup('<strong>Your Current Location</strong><br>MG Road, Central');

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Hospital pins
    hospitals.forEach(h => {
      const isSelected = selectedHospital?.hospital_id === h.hospital_id;
      const markerHtml = `
        <div style="background:${isSelected ? '#dc2626' : '#0d9488'}; color:#fff; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid #fff; box-shadow:0 2px 6px rgba(0,0,0,0.3); font-weight:800; font-size:14px;">
          +
        </div>
      `;

      const hospIcon = L.divIcon({
        className: 'custom-hosp-marker',
        html: markerHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([h.latitude, h.longitude], { icon: hospIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:sans-serif; padding:4px;">
            <strong style="font-size:14px;">${h.name}</strong><br>
            <span style="color:#64748b; font-size:12px;">${h.address}</span><br>
            <span style="color:#0d9488; font-weight:bold; font-size:12px;">★ ${h.rating} &bull; ${h.distance_km} km</span>
          </div>
        `);

      marker.on('click', () => {
        setSelectedHospital(h);
      });

      markersRef.current.push(marker);
    });

    if (selectedHospital) {
      map.setView([selectedHospital.latitude, selectedHospital.longitude], 14, { animate: true });
    }
  }, [hospitals, selectedHospital]);

  const handleSelect = (h: Hospital) => {
    setSelectedHospital(h);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([h.latitude, h.longitude], 14, { animate: true });
    }
  };

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
          Hospitals Near You (GPS Verified)
        </span>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Live OpenStreetMap &bull; Google Maps Ready
        </span>
      </div>

      {/* Interactive Map View matching Screen 6 */}
      <div 
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: '240px',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-md)',
          zIndex: 1
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
