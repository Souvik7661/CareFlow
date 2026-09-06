import React, { useState, useEffect } from 'react';
import { User, Doctor, PrescriptionMedicine } from '../../types';
import { api } from '../../services/api';
import { 
  Stethoscope, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  Check, 
  UserX, 
  BellRing, 
  Plus, 
  Trash2, 
  FileText, 
  RefreshCw,
  MapPin,
  Sparkles
} from 'lucide-react';

interface DoctorDashboardProps {
  user: User;
  onDoctorSwitch?: (doctorId: string) => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  user,
  onDoctorSwitch
}) => {
  const [activeDoctorId, setActiveDoctorId] = useState<string>(user.doctorId || 'DOC-CARD-01');
  const [doctorsList, setDoctorsList] = useState<Doctor[]>([]);
  const [dashboardData, setDashboardData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Complete Consultation Modal State
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [observations, setObservations] = useState('');
  const [assessment, setAssessment] = useState('');
  const [followUp, setFollowUp] = useState('Review in 2 weeks or if symptoms persist');
  const [medicines, setMedicines] = useState<PrescriptionMedicine[]>([
    { medicine_name: 'Amlodipine', dosage: '5 mg', frequency: 'Once daily (Morning)', duration: '15 days', instructions: 'After breakfast' }
  ]);

  const fetchDashboard = (docId: string) => {
    setLoading(true);
    api.getDoctorDashboard(docId)
      .then(res => setDashboardData(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    api.getDoctorsList().then(res => {
      setDoctorsList(res.doctors || []);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    fetchDashboard(activeDoctorId);

    // Listen to real-time SSE updates
    const eventSource = new EventSource('/api/queue/events');
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.payload?.doctorId === activeDoctorId || data.event === 'QUEUE_OPTIMIZED') {
          fetchDashboard(activeDoctorId);
        }
      } catch (err) {}
    };

    return () => eventSource.close();
  }, [activeDoctorId]);

  const handleDoctorChange = (newDocId: string) => {
    setActiveDoctorId(newDocId);
    if (onDoctorSwitch) onDoctorSwitch(newDocId);
  };

  const handleCallNext = async () => {
    setActionLoading(true);
    try {
      await api.callNextPatient(activeDoctorId);
      fetchDashboard(activeDoctorId);
    } catch (err: any) {
      alert(err.message || 'No patients waiting to call.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartConsultation = async (aptId: string) => {
    setActionLoading(true);
    try {
      await api.startConsultation(aptId, activeDoctorId);
      fetchDashboard(activeDoctorId);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkDelay = async (mins: number) => {
    setActionLoading(true);
    try {
      await api.markDoctorDelay(activeDoctorId, mins);
      alert(`Delay of ${mins} mins added. AI dynamic queue recalculated.`);
      fetchDashboard(activeDoctorId);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkNoShow = async (aptId: string) => {
    if (window.confirm('Mark this patient as No-Show?')) {
      setActionLoading(true);
      try {
        await api.markNoShow(aptId, activeDoctorId);
        fetchDashboard(activeDoctorId);
      } catch (err: any) {
        alert(err.message);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleAddMedicine = () => {
    setMedicines([
      ...medicines,
      { medicine_name: '', dosage: '1 tab', frequency: 'Twice daily', duration: '5 days', instructions: 'After meals' }
    ]);
  };

  const handleRemoveMedicine = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index: number, field: keyof PrescriptionMedicine, value: string) => {
    const updated = [...medicines];
    updated[index] = { ...updated[index], [field]: value };
    setMedicines(updated);
  };

  const handleCompleteConsultationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dashboardData?.currentPatient) return;

    setActionLoading(true);
    try {
      await api.completeConsultation({
        appointmentId: dashboardData.currentPatient.appointment_id,
        doctorId: activeDoctorId,
        patientId: dashboardData.currentPatient.patient_id,
        notes: clinicalNotes || 'Standard consultation completed.',
        observations: observations || 'Vitals checked and found stable.',
        assessment: assessment || 'Attending physician verified diagnosis.',
        followUp,
        medicines: medicines.filter(m => m.medicine_name.trim() !== '')
      });

      setShowConsultModal(false);
      fetchDashboard(activeDoctorId);
      alert('Consultation completed and prescription saved successfully.');
    } catch (err: any) {
      alert(err.message || 'Failed to complete consultation.');
    } finally {
      setActionLoading(false);
    }
  };

  const doctor = dashboardData?.doctor;
  const currentPatient = dashboardData?.currentPatient;
  const nextPatient = dashboardData?.nextPatient;
  const metrics = dashboardData?.metrics;
  const activeQueue = dashboardData?.activeQueue || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header & Doctor Profile Selector */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid var(--primary-border)'
          }}>
            <Stethoscope size={26} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-primary">Doctor Consultation Room</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Room {doctor?.room_no || '204'}</span>
            </div>
            <h1 style={{ fontSize: '1.6rem', marginTop: '2px' }}>
              Good Day, {doctor?.name || 'Doctor'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
              {doctor?.specialization} &bull; {doctor?.qualification}
            </p>
          </div>
        </div>

        {/* Doctor Switcher Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Switch Doctor:
          </label>
          <select 
            className="form-select"
            style={{ width: 'auto', minWidth: '240px', fontWeight: 600 }}
            value={activeDoctorId}
            onChange={e => handleDoctorChange(e.target.value)}
          >
            {doctorsList.map(doc => (
              <option key={doc.doctor_id} value={doc.doctor_id}>
                {doc.name} ({doc.specialization} - {doc.room_no})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Metrics Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="card" style={{ padding: '18px 22px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            Today's Appointments
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', marginTop: '4px' }}>
            {metrics?.totalToday || 0}
          </div>
        </div>

        <div className="card" style={{ padding: '18px 22px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            Completed Consultations
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--success)', marginTop: '4px' }}>
            {metrics?.completedToday || 0}
          </div>
        </div>

        <div className="card" style={{ padding: '18px 22px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            Patients Waiting
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--secondary)', marginTop: '4px' }}>
            {metrics?.waitingCount || 0}
          </div>
        </div>

        <div className="card" style={{ padding: '18px 22px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            Target Duration / Patient
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--primary)', marginTop: '4px' }}>
            {metrics?.avgConsultationTime || 15}m
          </div>
        </div>
      </div>

      {/* Main Two-Column Workflow Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '24px' }}>
        {/* Active Patient Card */}
        <div className="card" style={{ border: '2px solid var(--primary-border)', background: 'linear-gradient(135deg, #ffffff 0%, var(--primary-light) 100%)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span className="badge badge-primary" style={{ fontSize: '0.82rem' }}>
              {currentPatient ? (currentPatient.status === 'IN_CONSULTATION' ? 'In Consultation' : 'Called to Room') : 'Room Ready'}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Room {doctor?.room_no}</span>
          </div>

          {currentPatient ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                <div>
                  <h2 style={{ fontSize: '1.6rem', marginBottom: '2px' }}>
                    {currentPatient.full_name}
                  </h2>
                  <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                    {currentPatient.age} yrs &bull; {currentPatient.gender} &bull; Blood: {currentPatient.blood_group} &bull; ID: {currentPatient.patient_id}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Active Token</span>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
                    {currentPatient.token_number}
                  </div>
                </div>
              </div>

              {/* Patient Submitted Problem & AI Category */}
              <div style={{ background: 'var(--bg-muted)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '16px', margin: '18px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <Sparkles size={15} color="var(--primary)" />
                  <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--primary)' }}>
                    AI Clinical Category: {currentPatient.probable_category || 'General Consultation'}
                  </span>
                </div>

                <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
                  <strong>Submitted Problem:</strong> {currentPatient.submitted_symptoms || currentPatient.reason || 'Routine checkup'}
                </div>

                {currentPatient.submitted_duration && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Duration: {currentPatient.submitted_duration} &bull; Severity: {currentPatient.submitted_severity || 'Moderate'}
                  </div>
                )}

                {currentPatient.allergies && currentPatient.allergies !== 'None' && (
                  <div style={{ marginTop: '8px', fontSize: '0.82rem', color: 'var(--danger)', fontWeight: 600 }}>
                    Known Allergies: {currentPatient.allergies}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {currentPatient.status === 'CALLED' && (
                  <button 
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                    onClick={() => handleStartConsultation(currentPatient.appointment_id)}
                    disabled={actionLoading}
                  >
                    <Play size={16} />
                    <span>Start Consultation</span>
                  </button>
                )}

                {currentPatient.status === 'IN_CONSULTATION' && (
                  <button 
                    className="btn btn-primary"
                    style={{ flex: 1, background: 'var(--success)' }}
                    onClick={() => setShowConsultModal(true)}
                    disabled={actionLoading}
                  >
                    <Check size={16} />
                    <span>Complete Consultation &amp; Rx</span>
                  </button>
                )}

                <button 
                  className="btn btn-outline"
                  onClick={() => handleMarkNoShow(currentPatient.appointment_id)}
                  disabled={actionLoading}
                  style={{ color: 'var(--danger)' }}
                  title="Patient not present"
                >
                  <UserX size={16} />
                  <span>No Show</span>
                </button>
              </div>
            </div>
          ) : (
            <div style={{ padding: '36px 12px', textAlign: 'center' }}>
              <Users size={40} color="var(--text-light)" style={{ marginBottom: '12px' }} />
              <h3>No patient currently in room</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
                {nextPatient ? `Next patient in line: ${nextPatient.full_name} (${nextPatient.token_number})` : 'Queue is currently empty.'}
              </p>

              {nextPatient && (
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={handleCallNext}
                  disabled={actionLoading}
                >
                  <BellRing size={18} />
                  <span>Call Next Patient ({nextPatient.token_number})</span>
                </button>
              )}
            </div>
          )}

          {/* Doctor Delay Bar */}
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(13, 148, 136, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Adjust Doctor Delay:
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button className="btn btn-outline btn-sm" onClick={() => handleMarkDelay(10)} disabled={actionLoading}>
                +10 min delay
              </button>
              <button className="btn btn-outline btn-sm" onClick={() => handleMarkDelay(15)} disabled={actionLoading}>
                +15 min delay
              </button>
            </div>
          </div>
        </div>

        {/* Live Queue Table */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '1.2rem' }}>Doctor's Active Queue</h3>
            </div>

            <button 
              className="btn btn-outline btn-sm" 
              onClick={handleCallNext}
              disabled={actionLoading || !nextPatient}
            >
              <BellRing size={14} />
              <span>Call Next</span>
            </button>
          </div>

          {activeQueue.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No patients waiting in queue right now.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid var(--border-color)', textAlign: 'left' }}>
                    <th style={{ padding: '8px', color: 'var(--text-muted)' }}>Token</th>
                    <th style={{ padding: '8px', color: 'var(--text-muted)' }}>Patient</th>
                    <th style={{ padding: '8px', color: 'var(--text-muted)' }}>Est. Wait</th>
                    <th style={{ padding: '8px', color: 'var(--text-muted)' }}>Priority</th>
                    <th style={{ padding: '8px', color: 'var(--text-muted)' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activeQueue.map((item: any) => (
                    <tr key={item.queue_id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '10px 8px', fontWeight: 800, color: 'var(--primary)' }}>
                        {item.token_number}
                      </td>
                      <td style={{ padding: '10px 8px' }}>
                        <strong>{item.full_name}</strong>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>
                          {item.age}y &bull; {item.gender}
                        </span>
                      </td>
                      <td style={{ padding: '10px 8px' }}>
                        {item.status === 'IN_CONSULTATION' ? 'In Room' : `~${item.estimated_wait_time}m`}
                      </td>
                      <td style={{ padding: '10px 8px' }}>
                        <span className={`badge ${item.triage_priority === 'URGENT' ? 'badge-warning' : (item.triage_priority === 'EMERGENCY' ? 'badge-danger' : 'badge-neutral')}`}>
                          {item.triage_priority}
                        </span>
                      </td>
                      <td style={{ padding: '10px 8px' }}>
                        <span className={`badge ${item.status === 'IN_CONSULTATION' ? 'badge-success' : (item.status === 'CALLED' ? 'badge-info' : 'badge-neutral')}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Complete Consultation & Digital Prescription Modal */}
      {showConsultModal && (
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
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)',
            maxWidth: '740px',
            width: '100%',
            maxHeight: '92vh',
            overflowY: 'auto',
            padding: '32px',
            boxShadow: 'var(--shadow-xl)'
          }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>
              Complete Consultation &amp; Issue Prescription
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '20px' }}>
              Patient: <strong>{currentPatient?.full_name}</strong> &bull; Token: <strong>{currentPatient?.token_number}</strong>
            </p>

            <form onSubmit={handleCompleteConsultationSubmit}>
              <div className="form-group">
                <label className="form-label">Clinical Observations &amp; Examination</label>
                <textarea 
                  className="form-textarea" 
                  rows={2}
                  placeholder="e.g. Blood Pressure: 125/82 mmHg, Pulse: 72 bpm, Normal heart sounds."
                  value={observations}
                  onChange={e => setObservations(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Doctor's Assessment &amp; Clinical Diagnosis</label>
                <textarea 
                  className="form-textarea" 
                  rows={2}
                  placeholder="e.g. Mild sinus tachycardia, stress-related. Advised lifestyle modifications."
                  value={assessment}
                  onChange={e => setAssessment(e.target.value)}
                  required
                />
              </div>

              {/* Digital Prescription Medicines */}
              <div style={{ margin: '20px 0', padding: '16px', background: 'var(--bg-main)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.95rem' }}>
                    <FileText size={16} color="var(--primary)" />
                    <span>Digital Prescription Pad</span>
                  </div>

                  <button 
                    type="button" 
                    className="btn btn-outline-primary btn-sm"
                    onClick={handleAddMedicine}
                  >
                    <Plus size={14} />
                    <span>Add Medicine</span>
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {medicines.map((med, index) => (
                    <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr 1fr 1.5fr auto', gap: '8px', alignItems: 'center' }}>
                      <input 
                        type="text" 
                        className="form-input"
                        placeholder="Medicine Name"
                        value={med.medicine_name}
                        onChange={e => handleMedicineChange(index, 'medicine_name', e.target.value)}
                        required
                      />
                      <input 
                        type="text" 
                        className="form-input"
                        placeholder="Dosage (e.g. 5mg)"
                        value={med.dosage}
                        onChange={e => handleMedicineChange(index, 'dosage', e.target.value)}
                      />
                      <input 
                        type="text" 
                        className="form-input"
                        placeholder="Frequency"
                        value={med.frequency}
                        onChange={e => handleMedicineChange(index, 'frequency', e.target.value)}
                      />
                      <input 
                        type="text" 
                        className="form-input"
                        placeholder="Duration"
                        value={med.duration}
                        onChange={e => handleMedicineChange(index, 'duration', e.target.value)}
                      />
                      <input 
                        type="text" 
                        className="form-input"
                        placeholder="Instructions"
                        value={med.instructions}
                        onChange={e => handleMedicineChange(index, 'instructions', e.target.value)}
                      />
                      <button 
                        type="button" 
                        onClick={() => handleRemoveMedicine(index)}
                        style={{ color: 'var(--danger)', padding: '6px' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Follow-Up Instructions</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={followUp}
                  onChange={e => setFollowUp(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={() => setShowConsultModal(false)}
                >
                  Cancel
                </button>

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={actionLoading}
                >
                  <CheckCircle2 size={16} />
                  <span>Finalize &amp; Advance Queue</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
