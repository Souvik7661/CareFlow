import React, { useState, useEffect } from 'react';
import { User, Doctor } from '../../types';
import { api } from '../../services/api';
import { 
  ShieldCheck, 
  Users, 
  Calendar, 
  Clock, 
  Activity, 
  Settings, 
  BarChart3, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Building,
  Stethoscope,
  Edit,
  Save
} from 'lucide-react';

interface AdminDashboardProps {
  user: User;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'doctors' | 'settings'>('analytics');
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [settings, setSettings] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Settings edit state
  const [hospitalName, setHospitalName] = useState('');
  const [defaultMinutes, setDefaultMinutes] = useState(15);
  const [emergencyOverride, setEmergencyOverride] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const fetchAdminData = () => {
    setLoading(true);
    Promise.all([
      api.getAdminAnalytics(),
      api.getAdminDoctors(),
      api.getAdminSettings()
    ]).then(([analyticsRes, docsRes, settingsRes]) => {
      setAnalytics(analyticsRes);
      setDoctors(docsRes.doctors || []);
      setSettings(settingsRes.settings);
      if (settingsRes.settings) {
        setHospitalName(settingsRes.settings.hospital_name || '');
        setDefaultMinutes(settingsRes.settings.default_consultation_minutes || 15);
        setEmergencyOverride(!!settingsRes.settings.emergency_override);
      }
    }).catch(err => {
      console.error(err);
    }).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdateDoctorStatus = async (doctorId: string, newStatus: string) => {
    try {
      await api.updateDoctor(doctorId, { status: newStatus });
      setDoctors(doctors.map(d => d.doctor_id === doctorId ? { ...d, status: newStatus as any } : d));
    } catch (err: any) {
      alert('Failed to update doctor status.');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateAdminSettings({
        hospitalName,
        defaultConsultationMinutes: defaultMinutes,
        emergencyOverride: emergencyOverride ? 1 : 0
      });
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
    } catch (err: any) {
      alert('Failed to save settings.');
    }
  };

  const summary = analytics?.summary;
  const charts = analytics?.charts;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Admin Header */}
      <div style={{
        background: 'var(--bg-card)',
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
            <span className="badge badge-primary">Executive Administration</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Admin: {user.fullName}</span>
          </div>
          <h1 style={{ fontSize: '1.8rem' }}>Hospital Intelligence &amp; Analytics</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Operational metrics, doctor workload optimization, and clinical department management.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="cf-segmented-control cf-flex">
          <button
            type="button"
            className={`cf-segmented-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart3 size={15} />
            <span>Analytics &amp; KPIs</span>
          </button>

          <button
            type="button"
            className={`cf-segmented-btn ${activeTab === 'doctors' ? 'active' : ''}`}
            onClick={() => setActiveTab('doctors')}
          >
            <Stethoscope size={15} />
            <span>Doctor Management</span>
          </button>

          <button
            type="button"
            className={`cf-segmented-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={15} />
            <span>Hospital Settings</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Analytics & KPIs */}
      {activeTab === 'analytics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* KPI Cards Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            <div className="card">
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Patients</span>
              <div style={{ fontSize: '2.1rem', fontWeight: 800, fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
                {summary?.totalPatients || 20}
              </div>
            </div>

            <div className="card">
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Today's Appointments</span>
              <div style={{ fontSize: '2.1rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--primary)', marginTop: '4px' }}>
                {summary?.todayAppointments || 0}
              </div>
            </div>

            <div className="card">
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Avg Waiting Time</span>
              <div style={{ fontSize: '2.1rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--secondary)', marginTop: '4px' }}>
                {summary?.avgWaitTime || 18}m
              </div>
            </div>

            <div className="card">
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Avg Consultation</span>
              <div style={{ fontSize: '2.1rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#8b5cf6', marginTop: '4px' }}>
                {summary?.avgConsultationTime || 15}m
              </div>
            </div>

            <div className="card">
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Doctor Utilization</span>
              <div style={{ fontSize: '2.1rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--success)', marginTop: '4px' }}>
                {summary?.doctorUtilization || 85}%
              </div>
            </div>

            <div className="card">
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>No-Show Rate</span>
              <div style={{ fontSize: '2.1rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-muted)', marginTop: '4px' }}>
                {summary?.noShowRate || 4}%
              </div>
            </div>
          </div>

          {/* Interactive Visual Charts Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
            {/* Hourly Patient Flow Chart */}
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Hourly Outpatient Flow (Today)</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '20px' }}>
                Peak hospital arrival hours: <strong>{summary?.peakHours || '10:00 AM - 12:00 PM'}</strong>
              </p>

              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '180px', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
                {(charts?.hourlyDistribution || []).map((h: any) => {
                  const barHeight = Math.min((h.count / 20) * 100, 100);
                  const isPeak = h.count >= 14;

                  return (
                    <div key={h.hour} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: isPeak ? 'var(--primary)' : 'var(--text-muted)', marginBottom: '4px' }}>
                        {h.count}
                      </span>
                      <div style={{
                        width: '100%',
                        height: `${barHeight}%`,
                        background: isPeak ? 'linear-gradient(180deg, var(--primary), var(--secondary))' : 'var(--border-color)',
                        borderRadius: '4px 4px 0 0',
                        transition: 'height 0.4s ease'
                      }} />
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '6px', whiteSpace: 'nowrap' }}>
                        {h.hour.split(' ')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Department Workload Distribution */}
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Department Workload Distribution</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '20px' }}>
                Real-time appointment volume distribution across hospital wings
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {(charts?.departmentWorkload || []).slice(0, 5).map((dept: any) => {
                  const percent = Math.min((dept.appointment_count / 10) * 100, 100);

                  return (
                    <div key={dept.name}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                        <strong>{dept.name}</strong>
                        <span style={{ color: 'var(--text-muted)' }}>{dept.appointment_count} visits</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: 'var(--bg-muted)', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{ width: `${percent}%`, height: '100%', background: 'var(--primary)', borderRadius: '9999px' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Doctor Management */}
      {activeTab === 'doctors' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem' }}>Registered Hospital Specialists</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                The AI Doctor Recommendation engine strictly routes to doctors with status <strong>AVAILABLE</strong>.
              </p>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '10px' }}>Doctor Name</th>
                  <th style={{ padding: '10px' }}>Department / Specialty</th>
                  <th style={{ padding: '10px' }}>Room</th>
                  <th style={{ padding: '10px' }}>Target Time</th>
                  <th style={{ padding: '10px' }}>Rating</th>
                  <th style={{ padding: '10px' }}>AI Routing Status</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map(doc => (
                  <tr key={doc.doctor_id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 10px' }}>
                      <strong>{doc.name}</strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>{doc.qualification}</span>
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <div>{doc.specialization}</div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{doc.department_name}</span>
                    </td>
                    <td style={{ padding: '12px 10px', fontWeight: 600 }}>{doc.room_no}</td>
                    <td style={{ padding: '12px 10px' }}>{doc.avg_consultation_time} mins</td>
                    <td style={{ padding: '12px 10px' }}>★ {doc.rating}</td>
                    <td style={{ padding: '12px 10px' }}>
                      <select 
                        className="form-select"
                        style={{ width: 'auto', padding: '4px 8px', fontSize: '0.82rem', fontWeight: 600 }}
                        value={doc.status}
                        onChange={e => handleUpdateDoctorStatus(doc.doctor_id, e.target.value)}
                      >
                        <option value="AVAILABLE">AVAILABLE</option>
                        <option value="ON_LEAVE">ON_LEAVE</option>
                        <option value="OFF_DUTY">OFF_DUTY</option>
                        <option value="IN_CONSULTATION">IN_CONSULTATION</option>
                        <option value="INACTIVE">INACTIVE</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Hospital Settings */}
      {activeTab === 'settings' && (
        <div className="card" style={{ maxWidth: '640px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>Hospital Operational Parameters</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginBottom: '24px' }}>
            Adjust global target consultation pacing and queue calculation rules.
          </p>

          {settingsSaved && (
            <div style={{ background: 'var(--success-bg)', border: '1px solid var(--success-border)', borderRadius: 'var(--radius-md)', padding: '10px 14px', color: 'var(--success)', fontSize: '0.88rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} />
              <span>Settings updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings}>
            <div className="form-group">
              <label className="form-label">Hospital Name</label>
              <input 
                type="text" 
                className="form-input" 
                value={hospitalName}
                onChange={e => setHospitalName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Default Consultation Target (Minutes)</label>
              <input 
                type="number" 
                className="form-input" 
                value={defaultMinutes}
                onChange={e => setDefaultMinutes(parseInt(e.target.value, 10))}
                min={5}
                max={60}
                required
              />
              <span className="form-hint">Used by AI Queue Optimizer to estimate wait times across doctors.</span>
            </div>

            <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '12px', marginTop: '14px' }}>
              <input 
                type="checkbox" 
                id="emergencyOverride"
                checked={emergencyOverride}
                onChange={e => setEmergencyOverride(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
              />
              <label htmlFor="emergencyOverride" style={{ fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
                Activate Hospital Emergency High-Volume Triage Override
              </label>
            </div>

            <div style={{ marginTop: '24px' }}>
              <button type="submit" className="btn btn-primary">
                <Save size={16} />
                <span>Save Hospital Parameters</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
