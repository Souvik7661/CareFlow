import { Router } from 'express';
import { queryAll, queryOne, execute, transaction } from '../db/database.ts';
import { optimizeDoctorQueue } from '../ai/aiQueueOptimizer.ts';

const router = Router();

// 1. Reception Overview
router.get('/overview', (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const stats = {
      totalToday: queryOne("SELECT COUNT(*) as c FROM appointments WHERE appointment_date = ?", [today])?.c || 0,
      checkedIn: queryOne("SELECT COUNT(*) as c FROM appointments WHERE appointment_date = ? AND status = 'CHECKED_IN'", [today])?.c || 0,
      inConsultation: queryOne("SELECT COUNT(*) as c FROM appointments WHERE appointment_date = ? AND status = 'IN_CONSULTATION'", [today])?.c || 0,
      waiting: queryOne("SELECT COUNT(*) as c FROM queue WHERE status = 'WAITING'")?.c || 0,
      completed: queryOne("SELECT COUNT(*) as c FROM appointments WHERE appointment_date = ? AND status = 'COMPLETED'", [today])?.c || 0,
      cancelled: queryOne("SELECT COUNT(*) as c FROM appointments WHERE appointment_date = ? AND status = 'CANCELLED'", [today])?.c || 0
    };

    const appointments = queryAll(`
      SELECT a.*, 
             p.full_name as patient_name, p.phone as patient_phone, p.age, p.gender,
             d.name as doctor_name, d.specialization, d.room_no,
             dep.name as department_name,
             c.token_number, c.checkin_time,
             q.queue_position, q.estimated_wait_time, q.status as queue_status, q.triage_priority
      FROM appointments a
      JOIN patients p ON a.patient_id = p.patient_id
      JOIN doctors d ON a.doctor_id = d.doctor_id
      JOIN departments dep ON a.department_id = dep.department_id
      LEFT JOIN check_ins c ON a.appointment_id = c.appointment_id
      LEFT JOIN queue q ON a.appointment_id = q.appointment_id
      WHERE a.appointment_date = ?
      ORDER BY 
        CASE a.status 
          WHEN 'IN_CONSULTATION' THEN 1 
          WHEN 'CHECKED_IN' THEN 2 
          WHEN 'BOOKED' THEN 3 
          WHEN 'COMPLETED' THEN 4 
          ELSE 5 
        END,
        a.appointment_time ASC
    `, [today]);

    return res.json({ stats, appointments });
  } catch (err: any) {
    console.error('[RECEPTION] Overview error:', err);
    return res.status(500).json({ error: 'Failed to fetch reception overview.' });
  }
});

// 2. Register Walk-In Patient & Issue Instant Token
router.post('/walk-in', (req, res) => {
  try {
    const {
      fullName,
      age,
      gender,
      phone,
      doctorId,
      triagePriority, // 'ROUTINE' | 'URGENT' | 'EMERGENCY'
      reason
    } = req.body;

    if (!fullName || !phone || !doctorId) {
      return res.status(400).json({ error: 'Full name, phone, and doctor are required.' });
    }

    const doctor = queryOne('SELECT * FROM doctors WHERE doctor_id = ?', [doctorId]);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found.' });
    }

    const today = new Date().toISOString().split('T')[0];
    const patientId = `PAT-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const appointmentId = `APT-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const checkinId = `CHK-${Date.now()}`;
    const queueId = `QUE-${Date.now()}`;
    const countRow = queryOne(`
      SELECT COUNT(*) as count 
      FROM appointments 
      WHERE doctor_id = ? AND appointment_date = ? AND status NOT IN ('CANCELLED')
    `, [doctorId, today]);
    const tokenSequence = (countRow?.count || 0) + 1;
    const tokenNumber = `#${tokenSequence}`;

    transaction(() => {
      // 1. Insert patient
      execute(`
        INSERT INTO patients (patient_id, full_name, age, gender, phone, address, blood_group, allergies, medical_history)
        VALUES (?, ?, ?, ?, ?, 'Walk-in Desk Registration', 'Unknown', 'None', 'Walk-in evaluation')
      `, [patientId, fullName, parseInt(age || '30', 10), gender || 'Other', phone]);

      // 2. Insert appointment
      execute(`
        INSERT INTO appointments (appointment_id, patient_id, doctor_id, department_id, appointment_date, appointment_time, status, reason)
        VALUES (?, ?, ?, ?, ?, 'Walk-In Now', 'CHECKED_IN', ?)
      `, [appointmentId, patientId, doctorId, doctor.department_id, today, reason || 'Walk-in consultation']);

      // 3. Insert check-in
      execute(`
        INSERT INTO check_ins (checkin_id, appointment_id, patient_id, token_number, queue_status)
        VALUES (?, ?, ?, ?, 'Waiting')
      `, [checkinId, appointmentId, patientId, tokenNumber]);

      // 4. Insert queue
      execute(`
        INSERT INTO queue (
          queue_id, appointment_id, doctor_id, patient_id,
          token_number, queue_position, estimated_wait_time,
          estimated_consultation_time, triage_priority, status
        ) VALUES (?, ?, ?, ?, ?, 99, 15, 'Calculating...', ?, 'WAITING')
      `, [queueId, appointmentId, doctorId, patientId, tokenNumber, triagePriority || 'ROUTINE']);

      optimizeDoctorQueue(doctorId);
    });

    return res.status(201).json({
      message: 'Walk-in patient registered and queued successfully.',
      tokenNumber,
      patientId,
      appointmentId,
      doctorName: doctor.name,
      roomNo: doctor.room_no
    });
  } catch (err: any) {
    console.error('[RECEPTION] Walk-in error:', err);
    return res.status(500).json({ error: 'Failed to register walk-in patient.' });
  }
});

// 3. Global Staff Search
router.get('/search', (req, res) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      return res.json({ results: [] });
    }
    const query = `%${q.trim()}%`;

    const appointments = queryAll(`
      SELECT a.appointment_id, a.appointment_date, a.appointment_time, a.status,
             p.patient_id, p.full_name as patient_name, p.phone,
             d.name as doctor_name, d.specialization, d.room_no,
             c.token_number
      FROM appointments a
      JOIN patients p ON a.patient_id = p.patient_id
      JOIN doctors d ON a.doctor_id = d.doctor_id
      LEFT JOIN check_ins c ON a.appointment_id = c.appointment_id
      WHERE a.appointment_id LIKE ? 
         OR p.patient_id LIKE ? 
         OR p.full_name LIKE ? 
         OR p.phone LIKE ? 
         OR d.name LIKE ? 
         OR c.token_number LIKE ?
      LIMIT 15
    `, [query, query, query, query, query, query]);

    return res.json({ results: appointments });
  } catch (err: any) {
    return res.status(500).json({ error: 'Search failed.' });
  }
});

export default router;
