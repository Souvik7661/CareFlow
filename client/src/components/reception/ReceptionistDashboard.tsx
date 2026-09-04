import React, { useState, useEffect } from 'react';
import { User, Doctor } from '../../types';
import { api } from '../../services/api';
import { 
  ClipboardList, 
  Search, 
  UserPlus, 
  CheckCircle, 
  Clock, 
  Users, 
  Calendar, 
  RefreshCw, 
  Filter, 
  AlertTriangle,
  MapPin,
  FileText
} from 'lucide-react';

interface ReceptionistDashboardProps {
  user: User;
}

export const ReceptionistDashboard: React.FC<ReceptionistDashboardProps> = ({ user }) => {
  const [overview, setOverview] = useState<any | null>(null);
  const [doctors, setDoctorsList] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  // Walk-In Registration Modal
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [walkInName, setWalkInName] = useState('');
  const [walkInAge, setWalkInAge] = useState('');
  const [walkInGender, setWalkInGender] = useState('Male');
  const [walkInPhone, setWalkInPhone] = useState('');
  const [walkInDoctorId, setWalkInDoctorId] = useState('');
  const [walkInPriority, setWalkInPriority] = useState<'ROUTINE' | 'URGENT' | 'EMERGENCY'>('ROUTINE');
  const [walkInReason, setWalkInReason] = useState('');
  const [walkInSuccess, setWalkInSuccess] = useState<string | null>(null);

  const fetchOverview = () => {
    setLoading(true);
    api.getReceptionOverview()
      .then(res => setOverview(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOverview();
    api.getDoctorsList().then(res => {
      setDoctorsList(res.doctors || []);
      if (res.doctors && res.doctors.length > 0) {
        setWalkInDoctorId(res.doctors[0].doctor_id);
      }
    }).catch(() => {});
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await api.searchStaff(searchQuery);
      setSearchResults(res.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const handleWalkInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.registerWalkIn({
        fullName: walkInName,
        age: walkInAge,
        gender: walkInGender,
        phone: walkInPhone,
        doctorId: walkInDoctorId,
        triagePriority: walkInPriority,
        reason: walkInReason
      });

      setWalkInSuccess(`Walk-in queued! Token: ${res.tokenNumber} in ${res.roomNo} with ${res.doctorName}`);
      setShowWalkInModal(false);
      setWalkInName('');
      setWalkInPhone('');
      fetchOverview();
    } catch (err: any) {
      alert(err.message || 'Failed to register walk-in.');
    }
  };

  const handleQuickCheckIn = async (aptId: string) => {
    try {
      const res = await api.checkIn({ appointmentId: aptId });
      alert(`Check-in successful! Assigned Token: ${res.tokenNumber} (Queue Position: #${res.queuePosition})`);
      fetchOverview();
    } catch (err: any) {
      alert(err.message || 'Check-in failed.');
    }
  };

  const stats = overview?.stats;
  const appointments = overview?.appointments || [];

  const filteredAppointments = appointments.filter((a: any) => {
    if (statusFilter === 'ALL') return true;
    return a.status === statusFilter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Bar */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px 28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
            <span className="badge badge-info">Hospital Reception Desk</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Staff: {user.fullName}</span>
          </div>
          <h1 style={{ fontSize: '1.8rem' }}>Patient Reception &amp; Triage Control</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Assist patient arrivals, issue immediate walk-in tokens, and oversee department flow.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-outline btn-sm" onClick={fetchOverview}>
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>

          <button className="btn btn-primary" onClick={() => setShowWalkInModal(true)}>
            <UserPlus size={16} />
            <span>Register Walk-In Patient</span>
          </button>
        </div>
      </div>

      {walkInSuccess && (
        <div style={{
          background: 'var(--success-bg)',
          border: '1px solid var(--success-border)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          color: 'var(--success)',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle size={18} />
          <span>{walkInSuccess}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
        <div className="card" style={{ padding: '16px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Today</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>{stats?.totalToday || 0}</div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Waiting Queue</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--warning)' }}>{stats?.waiting || 0}</div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>In Consultation</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--secondary)' }}>{stats?.inConsultation || 0}</div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Completed</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--success)' }}>{stats?.completed || 0}</div>
        </div>
      </div>

      {/* Global Staff Search Bar */}
      <div className="card" style={{ padding: '20px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input 
              type="text" 
              className="form-input"
              placeholder="Search across Patient ID, Name, Phone, Appointment ID, Doctor, or Token..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '38px' }}
            />
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          <button type="submit" className="btn btn-primary" disabled={searching}>
            <span>{searching ? 'Searching...' : 'Search Records'}</span>
          </button>
        </form>

        {searchResults.length > 0 && (
          <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '10px' }}>Search Results ({searchResults.length}):</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {searchResults.map((r: any) => (
                <div key={r.appointment_id} style={{ padding: '10px 14px', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{r.patient_name}</strong> ({r.patient_id}) &bull; Apt: <code>{r.appointment_id}</code> &bull; Dr. {r.doctor_name} ({r.room_no})
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {r.token_number && <span className="badge badge-primary">Token: {r.token_number}</span>}
                    <span className="badge badge-neutral">{r.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Today's Full Schedule Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <h3 style={{ fontSize: '1.2rem' }}>Today's Outpatient Appointments &amp; Queue</h3>

          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {(['ALL', 'CHECKED_IN', 'IN_CONSULTATION', 'BOOKED', 'COMPLETED'] as const).map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  background: statusFilter === f ? 'var(--primary)' : 'var(--bg-muted)',
                  color: statusFilter === f ? '#ffffff' : 'var(--text-secondary)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filteredAppointments.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No appointments match the selected filter.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '10px' }}>Token</th>
                  <th style={{ padding: '10px' }}>Patient</th>
                  <th style={{ padding: '10px' }}>Doctor / Dept</th>
                  <th style={{ padding: '10px' }}>Slot</th>
                  <th style={{ padding: '10px' }}>Priority</th>
                  <th style={{ padding: '10px' }}>Status</th>
                  <th style={{ padding: '10px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((apt: any) => (
                  <tr key={apt.appointment_id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 10px', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                      {apt.token_number || '—'}
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <strong>{apt.patient_name}</strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>
                        {apt.patient_phone} &bull; {apt.patient_id}
                      </span>
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <div>{apt.doctor_name}</div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{apt.department_name} ({apt.room_no})</span>
                    </td>
                    <td style={{ padding: '12px 10px', whiteSpace: 'nowrap' }}>
                      {apt.appointment_time}
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <span className={`badge ${apt.triage_priority === 'URGENT' ? 'badge-warning' : (apt.triage_priority === 'EMERGENCY' ? 'badge-danger' : 'badge-neutral')}`}>
                        {apt.triage_priority || 'ROUTINE'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <span className={`badge ${apt.status === 'IN_CONSULTATION' ? 'badge-success' : (apt.status === 'CHECKED_IN' ? 'badge-info' : 'badge-neutral')}`}>
                        {apt.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      {apt.status === 'BOOKED' && (
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => handleQuickCheckIn(apt.appointment_id)}
                        >
                          Check In
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Walk-In Registration Modal */}
      {showWalkInModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '32px',
            boxShadow: 'var(--shadow-xl)'
          }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '6px' }}>
              Register Walk-In Patient &amp; Assign Token
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginBottom: '20px' }}>
              Immediate registration with triage priority weighting for walk-in arrivals.
            </p>

            <form onSubmit={handleWalkInSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={walkInName}
                    onChange={e => setWalkInName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input 
                    type="tel" 
                    className="form-input" 
                    value={walkInPhone}
                    onChange={e => setWalkInPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Age</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={walkInAge}
                    onChange={e => setWalkInAge(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select 
                    className="form-select"
                    value={walkInGender}
                    onChange={e => setWalkInGender(e.target.value)}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Assign Available Doctor *</label>
                <select 
                  className="form-select"
                  value={walkInDoctorId}
                  onChange={e => setWalkInDoctorId(e.target.value)}
                  required
                >
                  {doctors.map(d => (
                    <option key={d.doctor_id} value={d.doctor_id}>
                      {d.name} &bull; {d.specialization} ({d.room_no})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Triage Priority Level</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  {(['ROUTINE', 'URGENT', 'EMERGENCY'] as const).map(p => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setWalkInPriority(p)}
                      style={{
                        padding: '8px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        border: '1.5px solid',
                        borderColor: walkInPriority === p ? (p === 'EMERGENCY' ? 'var(--danger)' : (p === 'URGENT' ? 'var(--warning)' : 'var(--primary)')) : 'var(--border-color)',
                        background: walkInPriority === p ? (p === 'EMERGENCY' ? 'var(--danger-bg)' : (p === 'URGENT' ? 'var(--warning-bg)' : 'var(--primary-light)')) : '#ffffff',
                        color: walkInPriority === p ? (p === 'EMERGENCY' ? 'var(--danger)' : (p === 'URGENT' ? 'var(--warning)' : 'var(--primary)')) : 'var(--text-secondary)'
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Reason for Visit / Problem</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Acute knee pain from sudden slip"
                  value={walkInReason}
                  onChange={e => setWalkInReason(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={() => setShowWalkInModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  Issue Queue Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
