import React, { useState, useEffect } from 'react';
import { Doctor } from '../../types';
import { api, DEFAULT_DOCTORS } from '../../services/api';
import { 
  ArrowLeft, 
  SlidersHorizontal, 
  Search, 
  Star, 
  MessageSquare, 
  Phone
} from 'lucide-react';

interface DoctorListScreenProps {
  onSelectDoctor: (doctor: Doctor) => void;
  onBookDoctor?: (doctor: Doctor) => void;
  onBack: () => void;
}

export const DoctorListScreen: React.FC<DoctorListScreenProps> = ({
  onSelectDoctor,
  onBookDoctor,
  onBack
}) => {
  const [doctors, setDoctors] = useState<any[]>(DEFAULT_DOCTORS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Cardiologist',
    'Gastroenterologist',
    'Dermatologist',
    'Neurologist',
    'Pulmonologist',
    'Orthopedic',
    'Gynecologist',
    'Ophthalmologist',
    'Psychiatrist',
    'Dentist',
    'ENT',
    'General Physician',
    'Pediatrician',
    'Oncologist',
    'Endocrinologist',
    'Nephrologist'
  ];

  useEffect(() => {
    api.getDoctorsList()
      .then(res => {
        if (res && res.doctors && res.doctors.length > 0) {
          setDoctors(res.doctors);
        }
      })
      .catch(() => {
        setDoctors(DEFAULT_DOCTORS);
      });
  }, []);

  const filteredDoctors = doctors.filter(doc => {
    const spec = (doc.specialization || '').toLowerCase();
    const name = (doc.name || '').toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesCat = 
      selectedCategory === 'All' || 
      spec.includes(selectedCategory.toLowerCase()) ||
      (selectedCategory === 'Cardiologist' && spec.includes('cardio')) ||
      (selectedCategory === 'Gastroenterologist' && (spec.includes('gastro') || spec.includes('hepato'))) ||
      (selectedCategory === 'Dermatologist' && spec.includes('derma')) ||
      (selectedCategory === 'Neurologist' && spec.includes('neuro')) ||
      (selectedCategory === 'Pulmonologist' && spec.includes('pulmo')) ||
      (selectedCategory === 'Orthopedic' && spec.includes('ortho')) ||
      (selectedCategory === 'Gynecologist' && (spec.includes('gyne') || spec.includes('obstet'))) ||
      (selectedCategory === 'Ophthalmologist' && (spec.includes('opht') || spec.includes('eye'))) ||
      (selectedCategory === 'Psychiatrist' && (spec.includes('psych') || spec.includes('mental'))) ||
      (selectedCategory === 'Dentist' && (spec.includes('dent') || spec.includes('oral'))) ||
      (selectedCategory === 'ENT' && spec.includes('ent')) ||
      (selectedCategory === 'General Physician' && (spec.includes('general') || spec.includes('physician'))) ||
      (selectedCategory === 'Pediatrician' && spec.includes('pediat')) ||
      (selectedCategory === 'Oncologist' && spec.includes('onco')) ||
      (selectedCategory === 'Endocrinologist' && (spec.includes('endo') || spec.includes('diabet'))) ||
      (selectedCategory === 'Nephrologist' && (spec.includes('nephro') || spec.includes('renal')));

    const matchesQuery = !query || name.includes(query) || spec.includes(query) || (doc.hospital_name || '').toLowerCase().includes(query);

    return matchesCat && matchesQuery;
  });

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header with High-Contrast adaptive title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="apple-circle-action-btn" onClick={onBack}>
          <ArrowLeft size={16} />
        </button>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Find Doctors
          </h2>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            {filteredDoctors.length} Specialists Available Today
          </span>
        </div>

        <button className="apple-circle-action-btn">
          <SlidersHorizontal size={16} />
        </button>
      </div>

      {/* Inset Search Bar */}
      <div className="apple-search-bar">
        <Search size={16} color="#94a3b8" />
        <input 
          type="text" 
          className="apple-search-input" 
          placeholder="Search doctors, specialists, hospitals..." 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Horizontal Category Pills Slider */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '4px',
        scrollbarWidth: 'none'
      }}>
        {categories.map(cat => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              style={{
                padding: '8px 18px',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                border: isActive ? 'none' : '1px solid var(--border-color)',
                background: isActive ? 'var(--primary)' : 'var(--bg-card)',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                boxShadow: isActive ? '0 4px 14px rgba(20, 184, 166, 0.35)' : 'var(--shadow-sm)',
                transition: 'all 0.2s'
              }}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Doctor Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredDoctors.map(doc => {
          const rawHospName = doc.hospital_name || (doc.name.includes('Mehta') ? 'City Hospital' : doc.name.includes('Kapoor') ? 'Sunrise Hospital' : doc.name.includes('Verma') ? 'Medicare Hospital' : 'HealthPlus Hospital');
          const cleanHospName = rawHospName.replace(/\s*\(\d+(\.\d+)?\s*km\)/gi, '').trim();
          const hospDistance = doc.hospital_distance ?? doc.hospitalDistance ?? (doc.name.includes('Mehta') ? 2.4 : doc.name.includes('Kapoor') ? 3.1 : doc.name.includes('Verma') ? 5.0 : 6.2);
          const yearsExp = doc.experience_years || doc.experience ? `${doc.experience_years || doc.experience}+ Years Exp.` : '10+ Years Exp.';
          const docRating = doc.rating ? Number(doc.rating).toFixed(1) : '4.9';
          const reviewCount = doc.total_reviews || doc.reviews_count || 320;
          const roomNumber = doc.room_no || doc.roomNo || (doc.room_wing ? doc.room_wing.split('•')[0].trim() : 'Room 101');

          return (
            <div 
              key={doc.doctor_id || doc.doctorId}
              className="card"
              style={{
                padding: '16px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                borderRadius: '22px'
              }}
              onClick={() => onSelectDoctor(doc)}
            >
              {/* Doctor Details */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary), #0f766e)',
                  color: '#ffffff',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 6px 14px rgba(20, 184, 166, 0.25)',
                  flexShrink: 0
                }}>
                  {doc.name.replace('Dr. ', '').charAt(0)}
                </div>

                <div>
                  <h4 style={{ fontSize: '0.96rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    {doc.name}
                  </h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    {doc.specialization} &bull; {cleanHospName} ({hospDistance} km)
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#f59e0b', fontSize: '0.74rem', fontWeight: 700 }}>
                      <Star size={12} fill="#f59e0b" />
                      <span>{docRating}</span>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({reviewCount} reviews)</span>
                    </div>
                  </div>

                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                    {yearsExp} &bull; {roomNumber}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Message, Call & Direct Book */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button 
                    className="apple-circle-action-btn"
                    style={{ width: '34px', height: '34px' }}
                    title="View Doctor Profile"
                    onClick={() => onSelectDoctor(doc)}
                  >
                    <MessageSquare size={14} color="var(--primary)" />
                  </button>
                  <button 
                    className="apple-circle-action-btn active-teal"
                    style={{ width: '34px', height: '34px' }}
                    title="Call Clinic"
                    onClick={() => alert(`Connecting directly to ${doc.name}'s clinic OPD desk...`)}
                  >
                    <Phone size={14} />
                  </button>
                </div>

                <button
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: '0.74rem', padding: '5px 14px', marginTop: '2px', borderRadius: '9999px', fontWeight: 700 }}
                  onClick={() => {
                    if (onBookDoctor) {
                      onBookDoctor(doc);
                    } else {
                      onSelectDoctor(doc);
                    }
                  }}
                >
                  Book
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
