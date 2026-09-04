import React, { useState, useEffect, useRef } from 'react';
import { AmbulanceInfo, Hospital } from '../../types';
import { api } from '../../services/api';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Ambulance,
  HeartPulse,
  Navigation,
  Activity,
  X
} from 'lucide-react';

interface AmbulanceServiceScreenProps {
  onBack: () => void;
  defaultHospitalId?: string;
}

export const AmbulanceServiceScreen: React.FC<AmbulanceServiceScreenProps> = ({
  onBack,
  defaultHospitalId = 'HOSP-01'
}) => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [ambulanceType, setAmbulanceType] = useState<'Basic' | 'Advanced' | 'ICU'>('Basic');
  const [pickupAddress, setPickupAddress] = useState('MG Road, Your City');
  const [activeAmbulance, setActiveAmbulance] = useState<AmbulanceInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(8 * 60); // 8 minutes countdown

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Default patient coordinates (Central Kolkata)
  const pickupLat = 22.5680;
  const pickupLng = 88.3610;

  useEffect(() => {
    // Check if active ambulance exists
    api.getActiveAmbulance().then(res => {
      if (res.active && res.ambulance) {
        setActiveAmbulance(res.ambulance);
      }
    });

    api.getHospitals().then(res => {
      setHospitals(res.hospitals || []);
      const matched = (res.hospitals || []).find((h: Hospital) => h.hospital_id === defaultHospitalId);
      setSelectedHospital(matched || (res.hospitals || [])[0] || null);
    });
  }, [defaultHospitalId]);

  // Countdown timer when ambulance is dispatched
  useEffect(() => {
    if (!activeAmbulance) return;
    const interval = setInterval(() => {
      setCountdownSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeAmbulance]);

  // Leaflet map setup showing pickup, hospital, and connecting route
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const hospLat = selectedHospital?.latitude || 22.5726;
    const hospLng = selectedHospital?.longitude || 88.3639;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [(pickupLat + hospLat) / 2, (pickupLng + hospLng) / 2],
        zoom: 14,
        zoomControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear old layers
    map.eachLayer(layer => {
      if (!(layer instanceof L.TileLayer)) {
        map.removeLayer(layer);
      }
    });

    // 1. Pickup Marker (Green)
    const pickupIcon = L.divIcon({
      className: 'custom-pickup-marker',
      html: `<div style="background:#10b981; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#fff; font-weight:bold; border:2px solid #fff; box-shadow:0 2px 6px rgba(0,0,0,0.3);">📍</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });
    L.marker([pickupLat, pickupLng], { icon: pickupIcon })
      .addTo(map)
      .bindPopup('<strong>Your Pickup Location</strong><br>MG Road');

    // 2. Hospital Marker (Red Cross)
    const hospIcon = L.divIcon({
      className: 'custom-hosp-marker',
      html: `<div style="background:#dc2626; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#fff; font-weight:800; font-size:16px; border:2px solid #fff; box-shadow:0 2px 6px rgba(0,0,0,0.4);">🏥</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
    L.marker([hospLat, hospLng], { icon: hospIcon })
      .addTo(map)
      .bindPopup(`<strong>${selectedHospital?.name || 'City Hospital'}</strong>`);

    // 3. Route Polyline
    const routePoints: [number, number][] = [
      [pickupLat, pickupLng],
      [pickupLat + 0.002, pickupLng + 0.001],
      [hospLat - 0.001, hospLng - 0.002],
      [hospLat, hospLng]
    ];
    const polyline = L.polyline(routePoints, {
      color: '#0284c7',
      weight: 5,
      opacity: 0.8,
      dashArray: activeAmbulance ? '10, 10' : undefined
    }).addTo(map);

    // 4. If active, place moving ambulance icon
    if (activeAmbulance) {
      const midLat = (pickupLat + hospLat) / 2;
      const midLng = (pickupLng + hospLng) / 2;
      const ambIcon = L.divIcon({
        className: 'custom-ambulance-marker',
        html: `<div style="background:#ef4444; width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:18px; border:3px solid #fff; box-shadow:0 0 12px rgba(239,68,68,0.8); animation:pulse 1.5s infinite;">🚑</div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });
      L.marker([midLat, midLng], { icon: ambIcon })
        .addTo(map)
        .bindPopup(`<strong>Ambulance En Route</strong><br>Driver: ${activeAmbulance.driverName}`);
    }

    map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
  }, [selectedHospital, activeAmbulance]);

  const handleRequestAmbulance = async () => {
    setLoading(true);
    try {
      const res = await api.requestAmbulance({
        hospitalId: selectedHospital?.hospital_id || 'HOSP-01',
        pickupAddress,
        ambulanceType
      });
      setActiveAmbulance(res.ambulance);
      setCountdownSeconds(8 * 60);
    } catch (err: any) {
      alert('Failed to dispatch ambulance.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!activeAmbulance) return;
    if (confirm('Are you sure you want to cancel the emergency ambulance request?')) {
      await api.cancelAmbulance(activeAmbulance.requestId);
      setActiveAmbulance(null);
    }
  };

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header matching Screen 7 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button 
          className="btn btn-outline btn-sm"
          onClick={onBack}
          style={{ width: '36px', height: '36px', padding: 0, borderRadius: '50%' }}
        >
          <ArrowLeft size={18} />
        </button>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Ambulance Service</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Fast Ambulance at Your Location</span>
        </div>
        <div style={{ width: '36px' }} />
      </div>

      {/* Location Box matching Screen 7 */}
      <div className="card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            Your Location
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
            <MapPin size={16} color="#10b981" />
            <input 
              type="text" 
              className="form-input"
              value={pickupAddress}
              onChange={e => setPickupAddress(e.target.value)}
              style={{ fontSize: '0.9rem', fontWeight: 600, padding: '6px 10px' }}
            />
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            Destination Hospital
          </span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HeartPulse size={16} color="#dc2626" />
              <strong style={{ fontSize: '0.95rem' }}>{selectedHospital?.name || 'City Hospital'}</strong>
            </div>
            <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              {selectedHospital?.distance_km || 2.4} km
            </span>
          </div>
        </div>
      </div>

      {/* Estimated Arrival Banner matching Screen 7 */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            Estimated Arrival
          </span>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            via Fastest Route
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0d9488', fontFamily: 'var(--font-heading)' }}>
            {activeAmbulance ? formatCountdown(countdownSeconds) : '8 mins'}
          </div>
        </div>
      </div>

      {/* Live Route Map matching Screen 7 */}
      <div 
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: '200px',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-md)',
          zIndex: 1
        }}
      />

      {/* Ambulance Type Selector matching Screen 7 */}
      <div>
        <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
          Ambulance Type
        </span>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '8px' }}>
          {(['Basic', 'Advanced', 'ICU'] as const).map(type => {
            const isSelected = ambulanceType === type;
            return (
              <button
                key={type}
                onClick={() => setAmbulanceType(type)}
                style={{
                  padding: '12px 10px',
                  borderRadius: 'var(--radius-md)',
                  border: isSelected ? '1.5px solid #0d9488' : '1px solid var(--border-color)',
                  background: isSelected ? 'rgba(13, 148, 136, 0.08)' : '#ffffff',
                  color: isSelected ? '#0d9488' : 'var(--text-primary)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.2s'
                }}
              >
                <Ambulance size={20} />
                <span>{type}</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                  {type === 'Basic' ? 'Oxygen support' : type === 'Advanced' ? 'Paramedic ready' : 'Critical ventilator'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Free Service Badge matching Screen 7 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 14px',
        background: 'rgba(16, 185, 129, 0.08)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        fontSize: '0.82rem',
        color: '#065f46'
      }}>
        <CheckCircle2 size={16} color="#10b981" />
        <div>
          <strong>Free Service</strong> &bull; Emergency dispatch covered by hospital community care network.
        </div>
      </div>

      {/* Active Dispatch Card if Dispatched */}
      {activeAmbulance ? (
        <div className="card" style={{ padding: '20px', border: '2px solid #ef4444', background: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="pulse-indicator" style={{ background: '#ef4444' }} />
              <strong style={{ color: '#dc2626', fontSize: '1rem' }}>AMBULANCE DISPATCHED</strong>
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              {activeAmbulance.vehicleNumber}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px', fontSize: '0.88rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.76rem' }}>Assigned Driver</span>
              <div style={{ fontWeight: 700 }}>{activeAmbulance.driverName}</div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.76rem' }}>ETA to Pickup</span>
              <div style={{ fontWeight: 800, color: '#dc2626' }}>{formatCountdown(countdownSeconds)}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <a 
              href={`tel:${activeAmbulance.driverPhone}`}
              className="btn btn-primary"
              style={{ flex: 1, background: '#10b981', gap: '6px' }}
            >
              <Phone size={15} />
              <span>Call Driver ({activeAmbulance.driverPhone})</span>
            </a>

            <button 
              className="btn btn-outline"
              onClick={handleCancel}
              style={{ color: '#ef4444', borderColor: '#ef4444' }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        /* Request Ambulance CTA Button matching Screen 7 */
        <button 
          className="btn"
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '1rem',
            fontWeight: 800,
            background: '#0d9488',
            color: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          disabled={loading}
          onClick={handleRequestAmbulance}
        >
          <Ambulance size={18} />
          <span>{loading ? 'Connecting with Dispatch...' : 'Request Ambulance'}</span>
        </button>
      )}
    </div>
  );
};
