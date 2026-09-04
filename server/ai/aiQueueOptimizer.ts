import { queryAll, queryOne, execute, transaction } from '../db/database.ts';

// Real-time Event Broadcaster (SSE)
type SSEClient = (data: { event: string; payload: any }) => void;
const sseClients: Set<SSEClient> = new Set();

export function registerSSEClient(send: SSEClient) {
  sseClients.add(send);
  return () => {
    sseClients.delete(send);
  };
}

export function broadcastQueueUpdate(event: string, payload: any) {
  for (const client of sseClients) {
    try {
      client({ event, payload });
    } catch (err) {
      console.error('[SSE] Failed to send update:', err);
    }
  }
}

/**
 * AI Queue Optimization Algorithm
 * Recalculates queue positions, estimated wait times, and projected consultation times for a doctor
 */
export function optimizeDoctorQueue(doctorId: string, doctorDelayMinutes: number = 0) {
  return transaction(() => {
    // 1. Fetch Doctor details (avg consultation duration)
    const doctor = queryOne('SELECT * FROM doctors WHERE doctor_id = ?', [doctorId]);
    const avgDuration = doctor ? (doctor.avg_consultation_time || 15) : 15;

    // 2. Fetch all active queue items for this doctor
    const queueItems = queryAll(`
      SELECT q.*, a.appointment_time, p.full_name as patient_name, c.checkin_time
      FROM queue q
      JOIN appointments a ON q.appointment_id = a.appointment_id
      JOIN patients p ON q.patient_id = p.patient_id
      LEFT JOIN check_ins c ON q.appointment_id = c.appointment_id
      WHERE q.doctor_id = ? AND q.status IN ('IN_CONSULTATION', 'CALLED', 'WAITING')
      ORDER BY 
        CASE q.status 
          WHEN 'IN_CONSULTATION' THEN 1 
          WHEN 'CALLED' THEN 2 
          WHEN 'WAITING' THEN 3 
          ELSE 4 
        END,
        CASE q.triage_priority 
          WHEN 'EMERGENCY' THEN 1 
          WHEN 'URGENT' THEN 2 
          WHEN 'ROUTINE' THEN 3 
          ELSE 4 
        END,
        c.checkin_time ASC,
        q.queue_id ASC
    `, [doctorId]);

    let accumulatedWaitMinutes = doctorDelayMinutes;
    const now = new Date();

    queueItems.forEach((item: any, index: number) => {
      let position = index;
      let estimatedWait = 0;
      let projectedConsultTime = '';

      if (item.status === 'IN_CONSULTATION') {
        position = 0;
        estimatedWait = 0;
        projectedConsultTime = 'Now in Consultation';
      } else if (item.status === 'CALLED') {
        position = 1;
        estimatedWait = 2; // Arriving at room
        const consultDate = new Date(now.getTime() + 2 * 60 * 1000);
        projectedConsultTime = formatTime(consultDate);
        accumulatedWaitMinutes += Math.max(avgDuration - 2, 5);
      } else {
        // WAITING status
        // Triage priority weighting adjustment
        let waitStep = avgDuration;
        if (item.triage_priority === 'URGENT') {
          waitStep = Math.max(avgDuration - 3, 8);
        } else if (item.triage_priority === 'EMERGENCY') {
          waitStep = 5;
        }

        accumulatedWaitMinutes += waitStep;
        estimatedWait = accumulatedWaitMinutes;
        const consultDate = new Date(now.getTime() + accumulatedWaitMinutes * 60 * 1000);
        projectedConsultTime = formatTime(consultDate);
      }

      // Update in database
      execute(`
        UPDATE queue 
        SET queue_position = ?, 
            estimated_wait_time = ?, 
            estimated_consultation_time = ?, 
            updated_at = CURRENT_TIMESTAMP
        WHERE queue_id = ?
      `, [position, estimatedWait, projectedConsultTime, item.queue_id]);
    });

    // Broadcast change
    broadcastQueueUpdate('QUEUE_OPTIMIZED', {
      doctorId,
      updatedCount: queueItems.length,
      timestamp: new Date().toISOString()
    });

    return queueItems.length;
  });
}

/**
 * Format Date into user friendly 12-hour format e.g. 11:45 AM
 */
function formatTime(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const padMin = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${hours}:${padMin} ${ampm}`;
}
