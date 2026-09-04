import { Router } from 'express';
import { queryAll, queryOne, execute, transaction } from '../db/database.ts';
import { optimizeDoctorQueue, broadcastQueueUpdate } from '../ai/aiQueueOptimizer.ts';

const router = Router();

// 1. List all doctors
router.get('/list', (req, res) => {
  try {
    const doctors = queryAll(`
      SELECT d.*, dep.name as department_name, dep.room_wing
      FROM doctors d
      JOIN departments dep ON d.department_id = dep.department_id
      ORDER BY d.name ASC
    `);
    return res.json({ doctors });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to list doctors.' });
  }
});

// 2. Doctor Dashboard Data
router.get('/dashboard/:doctorId', (req, res) => {
  try {
    const { doctorId } = req.params;
    const today = new Date().toISOString().split('T')[0];

    const doctor = queryOne(`
      SELECT d.*, dep.name as department_name 
      FROM doctors d
      JOIN departments dep ON d.department_id = dep.department_id
      WHERE d.doctor_id = ?
    `, [doctorId]);

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found.' });
    }

    // Stats
    const totalToday = queryOne(`
      SELECT COUNT(*) as count FROM appointments 
      WHERE doctor_id = ? AND appointment_date = ?
    `, [doctorId, today])?.count || 0;

    const completedToday = queryOne(`
      SELECT COUNT(*) as count FROM appointments 
      WHERE doctor_id = ? AND appointment_date = ? AND status = 'COMPLETED'
    `, [doctorId, today])?.count || 0;

    const waitingCount = queryOne(`
      SELECT COUNT(*) as count FROM queue 
      WHERE doctor_id = ? AND status IN ('WAITING', 'CALLED')
    `, [doctorId])?.count || 0;

    // Current Patient (In Consultation or Called)
    const currentQueueItem = queryOne(`
      SELECT q.*, 
             a.reason, a.appointment_id,
             p.patient_id, p.full_name, p.age, p.gender, p.blood_group, 
             p.allergies, p.medical_history, p.current_medications,
             f.symptoms as submitted_symptoms, f.duration as submitted_duration,
             f.severity as submitted_severity, f.additional_symptoms,
             r.probable_category, r.explanation as ai_explanation
      FROM queue q
      JOIN appointments a ON q.appointment_id = a.appointment_id
      JOIN patients p ON q.patient_id = p.patient_id
      LEFT JOIN patient_problem_forms f ON f.patient_id = p.patient_id
      LEFT JOIN ai_recommendations r ON r.form_id = f.form_id
      WHERE q.doctor_id = ? AND q.status IN ('IN_CONSULTATION', 'CALLED')
      ORDER BY CASE q.status WHEN 'IN_CONSULTATION' THEN 1 ELSE 2 END ASC
      LIMIT 1
    `, [doctorId]);

    // Next Patient in Line
    const nextQueueItem = queryOne(`
      SELECT q.*, p.full_name, p.age, p.gender, a.reason
      FROM queue q
      JOIN appointments a ON q.appointment_id = a.appointment_id
      JOIN patients p ON q.patient_id = p.patient_id
      WHERE q.doctor_id = ? AND q.status = 'WAITING'
      ORDER BY q.queue_position ASC
      LIMIT 1
    `, [doctorId]);

    // Active Queue for Today
    const activeQueue = queryAll(`
      SELECT q.*, 
             p.full_name, p.age, p.gender, p.phone,
             a.appointment_time, a.status as appointment_status, a.reason
      FROM queue q
      JOIN appointments a ON q.appointment_id = a.appointment_id
      JOIN patients p ON q.patient_id = p.patient_id
      WHERE q.doctor_id = ? AND q.status IN ('IN_CONSULTATION', 'CALLED', 'WAITING')
      ORDER BY q.queue_position ASC
    `, [doctorId]);

    // Today's Appointment Schedule
    const todayAppointments = queryAll(`
      SELECT a.*, p.full_name, p.age, p.gender, p.phone, c.token_number
      FROM appointments a
      JOIN patients p ON a.patient_id = p.patient_id
      LEFT JOIN check_ins c ON a.appointment_id = c.appointment_id
      WHERE a.doctor_id = ? AND a.appointment_date = ?
      ORDER BY a.appointment_time ASC
    `, [doctorId, today]);

    return res.json({
      doctor,
      metrics: {
        totalToday,
        completedToday,
        waitingCount,
        avgConsultationTime: doctor.avg_consultation_time || 15
      },
      currentPatient: currentQueueItem || null,
      nextPatient: nextQueueItem || null,
      activeQueue,
      todayAppointments
    });
  } catch (err: any) {
    console.error('[DOCTOR] Dashboard fetch error:', err);
    return res.status(500).json({ error: 'Failed to fetch doctor dashboard.' });
  }
});

// 3. Call Next Patient
router.post('/call-next', (req, res) => {
  try {
    const { doctorId } = req.body;
    if (!doctorId) {
      return res.status(400).json({ error: 'doctorId is required.' });
    }

    const doctor = queryOne('SELECT * FROM doctors WHERE doctor_id = ?', [doctorId]);

    // Find first WAITING patient
    const nextPatient = queryOne(`
      SELECT q.*, p.full_name, p.patient_id, a.appointment_id
      FROM queue q
      JOIN patients p ON q.patient_id = p.patient_id
      JOIN appointments a ON q.appointment_id = a.appointment_id
      WHERE q.doctor_id = ? AND q.status = 'WAITING'
      ORDER BY q.queue_position ASC
      LIMIT 1
    `, [doctorId]);

    if (!nextPatient) {
      return res.status(404).json({ error: 'No waiting patients in queue.' });
    }

    transaction(() => {
      // Mark as CALLED
      execute("UPDATE queue SET status = 'CALLED' WHERE queue_id = ?", [nextPatient.queue_id]);

      // Create notification
      execute(`
        INSERT INTO notifications (notification_id, patient_id, appointment_id, type, title, message)
        VALUES (?, ?, ?, 'CALL_NEXT', 'Proceed to Consultation Room', ?)
      `, [
        `NOTIF-${Date.now()}`,
        nextPatient.patient_id,
        nextPatient.appointment_id,
        `Token ${nextPatient.token_number}: Dr. ${doctor.name} is ready for you! Please proceed immediately to ${doctor.room_no}.`
      ]);

      optimizeDoctorQueue(doctorId);
    });

    broadcastQueueUpdate('PATIENT_CALLED', {
      doctorId,
      tokenNumber: nextPatient.token_number,
      roomNo: doctor.room_no
    });

    return res.json({
      message: `Called patient ${nextPatient.full_name} (${nextPatient.token_number})`,
      calledPatient: nextPatient
    });
  } catch (err: any) {
    console.error('[DOCTOR] Call next error:', err);
    return res.status(500).json({ error: 'Failed to call next patient.' });
  }
});

// 4. Start Consultation
router.post('/start-consultation', (req, res) => {
  try {
    const { appointmentId, doctorId } = req.body;
    if (!appointmentId || !doctorId) {
      return res.status(400).json({ error: 'appointmentId and doctorId are required.' });
    }

    transaction(() => {
      execute("UPDATE appointments SET status = 'IN_CONSULTATION' WHERE appointment_id = ?", [appointmentId]);
      execute("UPDATE queue SET status = 'IN_CONSULTATION' WHERE appointment_id = ?", [appointmentId]);
      execute("UPDATE doctors SET status = 'IN_CONSULTATION' WHERE doctor_id = ?", [doctorId]);
      optimizeDoctorQueue(doctorId);
    });

    return res.json({ message: 'Consultation started.' });
  } catch (err: any) {
    console.error('[DOCTOR] Start consultation error:', err);
    return res.status(500).json({ error: 'Failed to start consultation.' });
  }
});

// 5. Complete Consultation & Create Digital Prescription
router.post('/complete-consultation', (req, res) => {
  try {
    const {
      appointmentId,
      doctorId,
      patientId,
      notes,
      observations,
      assessment,
      followUp,
      medicines
    } = req.body;

    if (!appointmentId || !doctorId || !patientId) {
      return res.status(400).json({ error: 'appointmentId, doctorId, and patientId are required.' });
    }

    const consultId = `CNS-${Date.now()}`;
    const prescId = `RX-${Date.now()}`;
    const today = new Date().toISOString().split('T')[0];

    transaction(() => {
      // 1. Record Consultation
      execute(`
        INSERT INTO consultations (
          consultation_id, appointment_id, patient_id, doctor_id,
          notes, observations, assessment, follow_up, consultation_start, consultation_end
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [
        consultId,
        appointmentId,
        patientId,
        doctorId,
        notes || 'Routine consultation completed.',
        observations || 'Normal vitals examined.',
        assessment || 'Diagnosis verified by attending physician.',
        followUp || 'As needed or SOS'
      ]);

      // 2. Record Prescription
      execute(`
        INSERT INTO prescriptions (
          prescription_id, patient_id, doctor_id, appointment_id, consultation_id, notes, prescription_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        prescId,
        patientId,
        doctorId,
        appointmentId,
        consultId,
        assessment || 'Follow prescribed course with adequate rest.',
        today
      ]);

      // 3. Add Medicines
      if (Array.isArray(medicines) && medicines.length > 0) {
        for (let i = 0; i < medicines.length; i++) {
          const med = medicines[i];
          execute(`
            INSERT INTO prescription_medicines (
              medicine_id, prescription_id, medicine_name, dosage, frequency, duration, instructions
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
          `, [
            `MED-${Date.now()}-${i}`,
            prescId,
            med.medicineName || 'Medication',
            med.dosage || '1 tab',
            med.frequency || 'Once daily',
            med.duration || '5 days',
            med.instructions || 'After meals'
          ]);
        }
      }

      // 4. Update status & advance queue
      execute("UPDATE appointments SET status = 'COMPLETED' WHERE appointment_id = ?", [appointmentId]);
      execute("UPDATE queue SET status = 'COMPLETED' WHERE appointment_id = ?", [appointmentId]);
      execute("UPDATE doctors SET status = 'AVAILABLE' WHERE doctor_id = ?", [doctorId]);

      // 5. Re-optimize queue for the remaining patients
      optimizeDoctorQueue(doctorId);

      // 6. Notify Patient
      execute(`
        INSERT INTO notifications (notification_id, patient_id, appointment_id, type, title, message)
        VALUES (?, ?, ?, 'CONSULTATION_COMPLETED', 'Consultation Completed', ?)
      `, [
        `NOTIF-${Date.now()}`,
        patientId,
        appointmentId,
        `Your consultation has been completed. Your digital prescription (ID: ${prescId}) is now available in your Medical History tab.`
      ]);
    });

    return res.json({
      message: 'Consultation completed and prescription saved successfully.',
      consultationId: consultId,
      prescriptionId: prescId
    });
  } catch (err: any) {
    console.error('[DOCTOR] Complete consultation error:', err);
    return res.status(500).json({ error: 'Failed to complete consultation: ' + err.message });
  }
});

// 6. Mark Delay
router.post('/mark-delay', (req, res) => {
  try {
    const { doctorId, delayMinutes } = req.body;
    const mins = parseInt(delayMinutes || '10', 10);

    optimizeDoctorQueue(doctorId, mins);

    broadcastQueueUpdate('DOCTOR_DELAY', {
      doctorId,
      delayMinutes: mins
    });

    return res.json({ message: `Marked delay of ${mins} minutes. Queue times updated for all waiting patients.` });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to mark delay.' });
  }
});

// 7. Mark No-Show
router.post('/mark-no-show', (req, res) => {
  try {
    const { appointmentId, doctorId } = req.body;

    transaction(() => {
      execute("UPDATE appointments SET status = 'NO_SHOW' WHERE appointment_id = ?", [appointmentId]);
      execute("UPDATE queue SET status = 'NO_SHOW' WHERE appointment_id = ?", [appointmentId]);
      optimizeDoctorQueue(doctorId);
    });

    return res.json({ message: 'Marked patient as No-Show. Queue advanced.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to mark no-show.' });
  }
});

export default router;
