import { Router } from 'express';
import { queryAll, queryOne, execute } from '../db/database.ts';

const router = Router();

// 1. Get Patient Profile
router.get('/profile/:patientId', (req, res) => {
  try {
    const { patientId } = req.params;
    const patient = queryOne('SELECT * FROM patients WHERE patient_id = ?', [patientId]);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found.' });
    }
    return res.json({ patient });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch patient profile.' });
  }
});

// 2. Get Comprehensive Medical History & Prescriptions Timeline
router.get('/history/:patientId', (req, res) => {
  try {
    const { patientId } = req.params;

    // Fetch all consultations/appointments for this patient
    const pastVisits = queryAll(`
      SELECT a.appointment_id, a.appointment_date, a.appointment_time, a.reason,
             d.name as doctor_name, d.specialization, d.room_no,
             dep.name as department_name,
             c.consultation_id, c.notes as clinical_notes, c.observations, c.assessment, c.follow_up,
             p.prescription_id, p.notes as prescription_notes
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.doctor_id
      JOIN departments dep ON a.department_id = dep.department_id
      LEFT JOIN consultations c ON a.appointment_id = c.appointment_id
      LEFT JOIN prescriptions p ON a.appointment_id = p.appointment_id
      WHERE a.patient_id = ? AND a.status = 'COMPLETED'
      ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `, [patientId]);

    // For each visit that has a prescription, fetch medicines
    const timeline = pastVisits.map((visit: any) => {
      let medicines: any[] = [];
      if (visit.prescription_id) {
        medicines = queryAll(`
          SELECT * FROM prescription_medicines WHERE prescription_id = ?
        `, [visit.prescription_id]);
      }
      return {
        ...visit,
        medicines
      };
    });

    return res.json({ timeline });
  } catch (err: any) {
    console.error('[PATIENT] History fetch error:', err);
    return res.status(500).json({ error: 'Failed to fetch medical history.' });
  }
});

// 3. Get Notifications
router.get('/notifications/:patientId', (req, res) => {
  try {
    const { patientId } = req.params;
    const notifications = queryAll(`
      SELECT * FROM notifications 
      WHERE patient_id = ? 
      ORDER BY created_at DESC 
      LIMIT 20
    `, [patientId]);
    return res.json({ notifications });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch notifications.' });
  }
});

// 4. Mark Notification Read
router.post('/notifications/:id/read', (req, res) => {
  try {
    const { id } = req.params;
    execute('UPDATE notifications SET read_status = 1 WHERE notification_id = ?', [id]);
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update notification.' });
  }
});

export default router;
