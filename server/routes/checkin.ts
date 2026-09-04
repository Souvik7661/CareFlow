import { Router } from 'express';
import { queryOne, execute, transaction } from '../db/database.ts';
import { optimizeDoctorQueue } from '../ai/aiQueueOptimizer.ts';

const router = Router();

const DEPT_PREFIX_MAP: Record<string, string> = {
  'DEP-CARD': 'C',
  'DEP-ORTH': 'O',
  'DEP-NEUR': 'N',
  'DEP-DERM': 'D',
  'DEP-GENM': 'G',
  'DEP-GAST': 'GA',
  'DEP-PULM': 'P',
  'DEP-PEDI': 'PED',
  'DEP-EMER': 'E'
};

router.post('/', (req, res) => {
  try {
    const { appointmentId, patientId, phone } = req.body;

    if (!appointmentId && (!patientId || !phone)) {
      return res.status(400).json({ error: 'Please enter an Appointment ID OR your Patient ID and Phone Number.' });
    }

    let appointment: any = null;

    if (appointmentId) {
      appointment = queryOne(`
        SELECT a.*, p.full_name as patient_name, p.phone as patient_phone,
               d.name as doctor_name, d.specialization, d.room_no,
               dep.name as department_name, dep.department_id
        FROM appointments a
        JOIN patients p ON a.patient_id = p.patient_id
        JOIN doctors d ON a.doctor_id = d.doctor_id
        JOIN departments dep ON a.department_id = dep.department_id
        WHERE a.appointment_id = ?
      `, [appointmentId.trim()]);
    } else {
      appointment = queryOne(`
        SELECT a.*, p.full_name as patient_name, p.phone as patient_phone,
               d.name as doctor_name, d.specialization, d.room_no,
               dep.name as department_name, dep.department_id
        FROM appointments a
        JOIN patients p ON a.patient_id = p.patient_id
        JOIN doctors d ON a.doctor_id = d.doctor_id
        JOIN departments dep ON a.department_id = dep.department_id
        WHERE (p.patient_id = ? OR p.phone LIKE ?)
        ORDER BY a.appointment_date DESC, a.created_at DESC
        LIMIT 1
      `, [patientId?.trim(), `%${phone?.trim()}%`]);
    }

    if (!appointment) {
      return res.status(404).json({ error: 'No matching appointment found. Please verify your details.' });
    }

    if (appointment.status === 'CANCELLED') {
      return res.status(400).json({ error: 'This appointment was cancelled. Please book a new appointment.' });
    }

    if (appointment.status === 'COMPLETED') {
      return res.status(400).json({ error: 'This consultation has already been completed.' });
    }

    // If already checked in, return the existing token
    const existingCheckIn = queryOne('SELECT * FROM check_ins WHERE appointment_id = ?', [appointment.appointment_id]);
    if (existingCheckIn) {
      const existingQueue = queryOne('SELECT * FROM queue WHERE appointment_id = ?', [appointment.appointment_id]);
      return res.json({
        alreadyCheckedIn: true,
        message: 'You are already checked in.',
        tokenNumber: existingCheckIn.token_number,
        queuePosition: existingQueue ? existingQueue.queue_position : 1,
        estimatedWaitTime: existingQueue ? existingQueue.estimated_wait_time : 15,
        doctorName: appointment.doctor_name,
        roomNo: appointment.room_no,
        departmentName: appointment.department_name
      });
    }

    // Generate New Token
    const prefix = DEPT_PREFIX_MAP[appointment.department_id] || 'T';
    const randTokenNum = Math.floor(20 + Math.random() * 80);
    const tokenNumber = `${prefix}-0${randTokenNum}`;
    const checkinId = `CHK-${Date.now()}`;
    const queueId = `QUE-${Date.now()}`;

    transaction(() => {
      // 1. Insert check-in
      execute(`
        INSERT INTO check_ins (checkin_id, appointment_id, patient_id, token_number, queue_status)
        VALUES (?, ?, ?, ?, 'Waiting')
      `, [checkinId, appointment.appointment_id, appointment.patient_id, tokenNumber]);

      // 2. Insert queue record
      execute(`
        INSERT INTO queue (
          queue_id, appointment_id, doctor_id, patient_id, 
          token_number, queue_position, estimated_wait_time, 
          estimated_consultation_time, triage_priority, status
        ) VALUES (?, ?, ?, ?, ?, 99, 30, 'Calculating...', 'ROUTINE', 'WAITING')
      `, [queueId, appointment.appointment_id, appointment.doctor_id, appointment.patient_id, tokenNumber]);

      // 3. Update appointment status
      execute("UPDATE appointments SET status = 'CHECKED_IN' WHERE appointment_id = ?", [appointment.appointment_id]);

      // 4. Run AI Queue Optimization
      optimizeDoctorQueue(appointment.doctor_id);

      // 5. Create notification
      execute(`
        INSERT INTO notifications (notification_id, patient_id, appointment_id, type, title, message)
        VALUES (?, ?, ?, 'CHECKIN_SUCCESS', 'Check-In Successful', ?)
      `, [
        `NOTIF-${Date.now()}`,
        appointment.patient_id,
        appointment.appointment_id,
        `Check-in verified! Your token is ${tokenNumber}. Please take a seat in the waiting area near ${appointment.room_no}. Watch the live screen for your call.`
      ]);
    });

    // Fetch optimized position
    const updatedQueue = queryOne('SELECT * FROM queue WHERE appointment_id = ?', [appointment.appointment_id]);

    return res.status(200).json({
      success: true,
      message: 'Check-in successful',
      tokenNumber,
      queuePosition: updatedQueue ? updatedQueue.queue_position : 1,
      estimatedWaitTime: updatedQueue ? updatedQueue.estimated_wait_time : 20,
      estimatedConsultationTime: updatedQueue?.estimated_consultation_time || 'Calculating...',
      doctorName: appointment.doctor_name,
      roomNo: appointment.room_no,
      departmentName: appointment.department_name,
      appointmentId: appointment.appointment_id
    });
  } catch (err: any) {
    console.error('[CHECKIN] Error during check-in:', err);
    return res.status(500).json({ error: 'Check-in failed: ' + err.message });
  }
});

export default router;
