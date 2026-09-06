import { Router } from 'express';
import { queryAll, queryOne, execute, transaction } from '../db/database.ts';
import { optimizeDoctorQueue } from '../ai/aiQueueOptimizer.ts';
import { getSessionUser } from './auth.ts';

const router = Router();

// Standard 30-minute day slots
const STANDARD_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', 
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', 
  '04:00 PM', '04:30 PM'
];

// 1. Get available slots for a doctor on a target date
router.get('/slots', (req, res) => {
  try {
    const { doctorId, date } = req.query;
    if (!doctorId || !date) {
      return res.status(400).json({ error: 'doctorId and date query parameters are required.' });
    }

    const doctor = queryOne('SELECT * FROM doctors WHERE doctor_id = ?', [doctorId]);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found.' });
    }

    // Find existing booked appointments for this doctor on this date
    const bookedAppointments = queryAll(`
      SELECT appointment_time 
      FROM appointments 
      WHERE doctor_id = ? AND appointment_date = ? AND status NOT IN ('CANCELLED', 'NO_SHOW')
    `, [doctorId, date]);

    const bookedTimes = new Set(bookedAppointments.map((a: any) => a.appointment_time));

    // If today, filter out past time slots
    const todayStr = new Date().toISOString().split('T')[0];
    const isToday = date === todayStr;
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const slots = STANDARD_SLOTS.map(slotStr => {
      let isAvailable = !bookedTimes.has(slotStr);

      if (isToday) {
        // Parse slot hour
        const [timePart, ampm] = slotStr.split(' ');
        let [h, m] = timePart.split(':').map(Number);
        if (ampm === 'PM' && h !== 12) h += 12;
        if (ampm === 'AM' && h === 12) h = 0;

        if (h < currentHour || (h === currentHour && m <= currentMinute)) {
          // If in the past today, mark unavailable
          isAvailable = false;
        }
      }

      return {
        time: slotStr,
        isAvailable
      };
    });

    return res.json({
      doctorId,
      date,
      doctorName: doctor.name,
      specialization: doctor.specialization,
      roomNo: doctor.room_no,
      slots
    });
  } catch (err: any) {
    console.error('[APPOINTMENTS] Slot lookup error:', err);
    return res.status(500).json({ error: 'Failed to retrieve appointment slots.' });
  }
});

// 2. Book an Appointment
router.post('/book', (req, res) => {
  try {
    let { patientId, doctorId, departmentId, appointmentDate, appointmentTime, timeSlot, reason, reasonForVisit } = req.body;

    if (!appointmentTime && timeSlot) appointmentTime = timeSlot;
    if (!reason && reasonForVisit) reason = reasonForVisit;

    if (!patientId) {
      const sessionUser = getSessionUser(req);
      if (sessionUser?.patientId) {
        patientId = sessionUser.patientId;
      } else if (sessionUser?.userId) {
        patientId = sessionUser.userId;
      }
    }

    if (!patientId || !doctorId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({ error: 'Missing required booking fields.' });
    }

    const doctor = queryOne('SELECT * FROM doctors WHERE doctor_id = ?', [doctorId]);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found.' });
    }

    let patient = queryOne('SELECT * FROM patients WHERE patient_id = ?', [patientId]);
    if (!patient) {
      // Check if patientId corresponds to a user's ID
      const user = queryOne('SELECT * FROM users WHERE id = ?', [patientId]);
      if (user) {
        const newPatientId = `PAT-2026-${Math.floor(10000 + Math.random() * 90000)}`;
        execute(`
          INSERT INTO patients (patient_id, user_id, full_name, age, gender, phone, email)
          VALUES (?, ?, ?, 30, 'Other', '+91 99999 00000', ?)
        `, [newPatientId, user.id, user.full_name, user.email]);
        patient = queryOne('SELECT * FROM patients WHERE patient_id = ?', [newPatientId]);
      } else {
        return res.status(404).json({ error: 'Patient not found.' });
      }
    }

    const effectivePatientId = patient.patient_id;
    const effectiveDeptId = departmentId || doctor.department_id;
    const dept = queryOne('SELECT * FROM departments WHERE department_id = ?', [effectiveDeptId]);

    // Check collision
    const existing = queryOne(`
      SELECT appointment_id 
      FROM appointments 
      WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ? AND status NOT IN ('CANCELLED', 'NO_SHOW')
    `, [doctorId, appointmentDate, appointmentTime]);

    if (existing) {
      return res.status(409).json({ error: 'This time slot was just taken. Please choose another available slot.' });
    }

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const appointmentId = `APT-2026-${randomNum}`;
    const checkinId = `CHK-2026-${randomNum}`;
    const queueId = `Q-2026-${randomNum}`;

    let tokenNum = '#1';
    let tokenSequence = 1;

    transaction(() => {
      // Calculate sequential token number for this doctor on this specific date
      const countRow = queryOne(`
        SELECT COUNT(*) as count 
        FROM appointments 
        WHERE doctor_id = ? AND appointment_date = ? AND status NOT IN ('CANCELLED')
      `, [doctorId, appointmentDate]);

      tokenSequence = (countRow?.count || 0) + 1;
      tokenNum = `#${tokenSequence}`;

      // 1. Insert new active appointment into database
      execute(`
        INSERT INTO appointments (
          appointment_id, patient_id, doctor_id, department_id, 
          appointment_date, appointment_time, status, reason
        ) VALUES (?, ?, ?, ?, ?, ?, 'BOOKED', ?)
      `, [
        appointmentId,
        effectivePatientId,
        doctorId,
        effectiveDeptId,
        appointmentDate,
        appointmentTime,
        reason || 'Consultation'
      ]);

      // 2. Generate initial check-in record
      execute(`
        INSERT INTO check_ins (checkin_id, appointment_id, patient_id, token_number, queue_status)
        VALUES (?, ?, ?, ?, 'Waiting')
      `, [checkinId, appointmentId, effectivePatientId, tokenNum]);

      // Calculate queue position
      const queueCountResult = queryOne(`
        SELECT COUNT(*) as count FROM queue WHERE doctor_id = ? AND status = 'WAITING'
      `, [doctorId]);
      const queuePosition = (queueCountResult?.count || 0) + 1;
      const estimatedWaitTime = queuePosition * (doctor.avg_consultation_time || 15);

      execute(`
        INSERT INTO queue (
          queue_id, appointment_id, doctor_id, patient_id, 
          token_number, queue_position, estimated_wait_time, triage_priority, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'ROUTINE', 'WAITING')
      `, [queueId, appointmentId, doctorId, effectivePatientId, tokenNum, queuePosition, estimatedWaitTime]);

      // 3. Notification
      execute(`
        INSERT INTO notifications (notification_id, patient_id, appointment_id, type, title, message)
        VALUES (?, ?, ?, 'APPOINTMENT_CONFIRMED', 'Appointment Confirmed & Token Generated', ?)
      `, [
        `NOTIF-${Date.now()}`,
        effectivePatientId,
        appointmentId,
        `Your consultation with ${doctor.name} (${dept?.name || 'Department'}) is confirmed for ${appointmentDate} at ${appointmentTime} in ${doctor.room_no}. Your active queue token is ${tokenNum}.`
      ]);
    });

    return res.status(201).json({
      message: 'Appointment booked successfully and digital pass issued',
      appointment: {
        appointmentId,
        patientId: effectivePatientId,
        patientName: patient.full_name,
        doctorId,
        doctorName: doctor.name,
        specialization: doctor.specialization,
        roomNo: doctor.room_no,
        departmentId: effectiveDeptId,
        departmentName: dept?.name || 'Medical Department',
        wing: dept?.room_wing || 'Main Wing',
        appointmentDate,
        appointmentTime,
        status: 'BOOKED',
        token_number: tokenNum,
        tokenNumber: tokenNum,
        tokenSequence,
        queue_position: tokenSequence,
        estimated_wait_time: tokenSequence * (doctor.avg_consultation_time || 15),
        reason
      }
    });
  } catch (err: any) {
    console.error('[APPOINTMENTS] Booking error:', err);
    return res.status(500).json({ error: 'Failed to book appointment: ' + err.message });
  }
});

// 3. Get Patient's Appointments
router.get('/my', (req, res) => {
  try {
    let { patientId } = req.query;

    if (!patientId) {
      const sessionUser = getSessionUser(req);
      if (sessionUser?.patientId) {
        patientId = sessionUser.patientId;
      } else if (sessionUser?.userId) {
        const p = queryOne('SELECT patient_id FROM patients WHERE user_id = ?', [sessionUser.userId]);
        if (p) patientId = p.patient_id;
      }
    }

    if (!patientId) {
      return res.status(400).json({ error: 'patientId is required.' });
    }

    const appointments = queryAll(`
      SELECT a.*, 
             d.name as doctor_name, 
             d.specialization, 
             d.room_no,
             d.rating as doctor_rating,
             dep.name as department_name,
             dep.room_wing,
             c.token_number,
             q.queue_position,
             q.estimated_wait_time,
             q.status as queue_status
      FROM appointments a
      LEFT JOIN doctors d ON a.doctor_id = d.doctor_id
      LEFT JOIN departments dep ON a.department_id = dep.department_id
      LEFT JOIN check_ins c ON a.appointment_id = c.appointment_id
      LEFT JOIN queue q ON a.appointment_id = q.appointment_id
      WHERE a.patient_id = ?
      ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `, [patientId]);

    return res.json({ appointments });
  } catch (err: any) {
    console.error('[APPOINTMENTS] Fetch error:', err);
    return res.status(500).json({ error: 'Failed to fetch appointments.' });
  }
});

// 4. Cancel Appointment
router.post('/:id/cancel', (req, res) => {
  try {
    const { id } = req.params;
    const appointment = queryOne('SELECT * FROM appointments WHERE appointment_id = ?', [id]);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found.' });
    }

    transaction(() => {
      execute("UPDATE appointments SET status = 'CANCELLED' WHERE appointment_id = ?", [id]);
      execute("UPDATE queue SET status = 'CANCELLED' WHERE appointment_id = ?", [id]);
      optimizeDoctorQueue(appointment.doctor_id);
    });

    return res.json({ message: 'Appointment cancelled successfully.' });
  } catch (err: any) {
    console.error('[APPOINTMENTS] Cancel error:', err);
    return res.status(500).json({ error: 'Failed to cancel appointment.' });
  }
});

// 5. Reschedule Appointment
router.post('/:id/reschedule', (req, res) => {
  try {
    const { id } = req.params;
    const { newDate, newTime } = req.body;
    if (!newDate || !newTime) {
      return res.status(400).json({ error: 'newDate and newTime are required.' });
    }

    const appointment = queryOne('SELECT * FROM appointments WHERE appointment_id = ?', [id]);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found.' });
    }

    // Check collision
    const existing = queryOne(`
      SELECT appointment_id FROM appointments 
      WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ? AND appointment_id != ? AND status NOT IN ('CANCELLED', 'NO_SHOW')
    `, [appointment.doctor_id, newDate, newTime, id]);

    if (existing) {
      return res.status(409).json({ error: 'This time slot is already taken.' });
    }

    transaction(() => {
      execute(`
        UPDATE appointments 
        SET appointment_date = ?, appointment_time = ?, status = 'BOOKED' 
        WHERE appointment_id = ?
      `, [newDate, newTime, id]);
    });

    return res.json({ message: 'Appointment rescheduled successfully.', newDate, newTime });
  } catch (err: any) {
    console.error('[APPOINTMENTS] Reschedule error:', err);
    return res.status(500).json({ error: 'Failed to reschedule appointment.' });
  }
});

export default router;
