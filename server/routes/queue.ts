import { Router } from 'express';
import { queryAll, queryOne } from '../db/database.ts';
import { registerSSEClient } from '../ai/aiQueueOptimizer.ts';

const router = Router();

// 1. Live SSE Events Stream
router.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  // Send initial connected ping
  res.write(`data: ${JSON.stringify({ event: 'CONNECTED', timestamp: Date.now() })}\n\n`);

  const unregister = registerSSEClient(payload => {
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  });

  req.on('close', () => {
    unregister();
  });
});

// 2. Patient Live Queue Status
router.get('/patient/:patientId', (req, res) => {
  try {
    const { patientId } = req.params;

    // Find active checked-in or in-queue appointment
    const activeQueue = queryOne(`
      SELECT q.*, 
             a.appointment_time, a.appointment_date,
             d.name as doctor_name, d.specialization, d.room_no,
             dep.name as department_name
      FROM queue q
      JOIN appointments a ON q.appointment_id = a.appointment_id
      JOIN doctors d ON q.doctor_id = d.doctor_id
      JOIN departments dep ON d.department_id = dep.department_id
      WHERE q.patient_id = ? AND q.status IN ('WAITING', 'CALLED', 'IN_CONSULTATION')
      ORDER BY q.updated_at DESC
      LIMIT 1
    `, [patientId]);

    if (!activeQueue) {
      return res.json({ hasActiveQueue: false });
    }

    // Find who is now serving for this doctor
    const nowServing = queryOne(`
      SELECT token_number 
      FROM queue 
      WHERE doctor_id = ? AND status = 'IN_CONSULTATION'
      LIMIT 1
    `, [activeQueue.doctor_id]);

    // Count patients ahead
    const patientsAheadCount = queryOne(`
      SELECT COUNT(*) as count 
      FROM queue 
      WHERE doctor_id = ? AND status IN ('WAITING', 'CALLED') AND queue_position < ?
    `, [activeQueue.doctor_id, activeQueue.queue_position]);

    const patientsAhead = patientsAheadCount ? patientsAheadCount.count : 0;

    return res.json({
      hasActiveQueue: true,
      tokenNumber: activeQueue.token_number,
      queuePosition: activeQueue.queue_position,
      patientsAhead,
      estimatedWaitTime: activeQueue.estimated_wait_time,
      estimatedConsultationTime: activeQueue.estimated_consultation_time,
      status: activeQueue.status,
      doctorName: activeQueue.doctor_name,
      specialization: activeQueue.specialization,
      roomNo: activeQueue.room_no,
      departmentName: activeQueue.department_name,
      nowServingToken: nowServing ? nowServing.token_number : 'None'
    });
  } catch (err: any) {
    console.error('[QUEUE] Patient status error:', err);
    return res.status(500).json({ error: 'Failed to fetch queue status.' });
  }
});

// 3. Public Waiting Room TV Display Data
router.get('/display', (req, res) => {
  try {
    const doctors = queryAll(`
      SELECT d.doctor_id, d.name as doctor_name, d.specialization, d.room_no,
             dep.name as department_name, dep.room_wing
      FROM doctors d
      JOIN departments dep ON d.department_id = dep.department_id
      WHERE d.status IN ('AVAILABLE', 'IN_CONSULTATION')
      ORDER BY d.room_no ASC
    `);

    const board = doctors.map((doc: any) => {
      const nowServing = queryOne(`
        SELECT q.token_number, p.full_name as patient_name
        FROM queue q
        JOIN patients p ON q.patient_id = p.patient_id
        WHERE q.doctor_id = ? AND q.status = 'IN_CONSULTATION'
        LIMIT 1
      `, [doc.doctor_id]);

      const called = queryOne(`
        SELECT q.token_number, p.full_name as patient_name
        FROM queue q
        JOIN patients p ON q.patient_id = p.patient_id
        WHERE q.doctor_id = ? AND q.status = 'CALLED'
        LIMIT 1
      `, [doc.doctor_id]);

      const upcoming = queryAll(`
        SELECT q.token_number, q.estimated_wait_time
        FROM queue q
        WHERE q.doctor_id = ? AND q.status = 'WAITING'
        ORDER BY q.queue_position ASC
        LIMIT 3
      `, [doc.doctor_id]);

      return {
        ...doc,
        nowServingToken: nowServing ? nowServing.token_number : (called ? called.token_number : '—'),
        isCalling: !!called,
        calledToken: called?.token_number || null,
        waitingCount: upcoming.length,
        upcomingTokens: upcoming.map((u: any) => u.token_number)
      };
    });

    return res.json({ board });
  } catch (err: any) {
    console.error('[QUEUE] Display error:', err);
    return res.status(500).json({ error: 'Failed to fetch display board data.' });
  }
});

export default router;
