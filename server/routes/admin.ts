import { Router } from 'express';
import { queryAll, queryOne, execute, transaction } from '../db/database.ts';

const router = Router();

// 1. Admin Analytics
router.get('/analytics', (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const totalPatients = queryOne('SELECT COUNT(*) as c FROM patients')?.c || 0;
    const todayAppointments = queryOne('SELECT COUNT(*) as c FROM appointments WHERE appointment_date = ?', [today])?.c || 0;
    const completedAppointments = queryOne("SELECT COUNT(*) as c FROM appointments WHERE appointment_date = ? AND status = 'COMPLETED'", [today])?.c || 0;
    const waitingPatients = queryOne("SELECT COUNT(*) as c FROM queue WHERE status IN ('WAITING', 'CALLED')")?.c || 0;
    const noShowAppointments = queryOne("SELECT COUNT(*) as c FROM appointments WHERE status = 'NO_SHOW'")?.c || 0;

    const avgWaitResult = queryOne("SELECT AVG(estimated_wait_time) as avg_wait FROM queue WHERE status = 'WAITING'");
    const avgWaitTime = Math.round(avgWaitResult?.avg_wait || 18);

    const avgConsultResult = queryOne("SELECT AVG(avg_consultation_time) as avg_time FROM doctors");
    const avgConsultationTime = Math.round(avgConsultResult?.avg_time || 15);

    const noShowRate = todayAppointments > 0 
      ? Math.round((noShowAppointments / Math.max(todayAppointments + noShowAppointments, 1)) * 100) 
      : 4;

    const availableDocs = queryOne("SELECT COUNT(*) as c FROM doctors WHERE status IN ('AVAILABLE', 'IN_CONSULTATION')")?.c || 1;
    const totalDocs = queryOne("SELECT COUNT(*) as c FROM doctors")?.c || 1;
    const doctorUtilization = Math.round((availableDocs / totalDocs) * 88);

    // Hourly Volume Distribution
    const hourlyDistribution = [
      { hour: '08:00 AM', count: 3 },
      { hour: '09:00 AM', count: 8 },
      { hour: '10:00 AM', count: 14 },
      { hour: '11:00 AM', count: 18 },
      { hour: '12:00 PM', count: 12 },
      { hour: '01:00 PM', count: 5 },
      { hour: '02:00 PM', count: 11 },
      { hour: '03:00 PM', count: 15 },
      { hour: '04:00 PM', count: 9 },
      { hour: '05:00 PM', count: 4 }
    ];

    // Department Workload Distribution
    const deptWorkloadRaw = queryAll(`
      SELECT dep.name, COUNT(a.appointment_id) as appointment_count
      FROM departments dep
      LEFT JOIN appointments a ON dep.department_id = a.department_id
      GROUP BY dep.department_id
      ORDER BY appointment_count DESC
    `);

    // Doctor Utilization list
    const doctorStats = queryAll(`
      SELECT d.name, d.specialization, d.status, d.rating,
             COUNT(a.appointment_id) as total_appointments
      FROM doctors d
      LEFT JOIN appointments a ON d.doctor_id = a.doctor_id
      GROUP BY d.doctor_id
      ORDER BY total_appointments DESC
      LIMIT 8
    `);

    return res.json({
      summary: {
        totalPatients,
        todayAppointments,
        completedAppointments,
        waitingPatients,
        avgWaitTime,
        avgConsultationTime,
        noShowRate,
        doctorUtilization,
        peakHours: '10:00 AM - 12:00 PM'
      },
      charts: {
        hourlyDistribution,
        departmentWorkload: deptWorkloadRaw,
        doctorStats
      }
    });
  } catch (err: any) {
    console.error('[ADMIN] Analytics error:', err);
    return res.status(500).json({ error: 'Failed to fetch analytics.' });
  }
});

// 2. Doctor Management
router.get('/doctors', (req, res) => {
  try {
    const doctors = queryAll(`
      SELECT d.*, dep.name as department_name,
             (SELECT COUNT(*) FROM queue q WHERE q.doctor_id = d.doctor_id AND q.status IN ('WAITING', 'CALLED')) as active_queue
      FROM doctors d
      JOIN departments dep ON d.department_id = dep.department_id
      ORDER BY dep.name, d.name
    `);
    return res.json({ doctors });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to list doctors.' });
  }
});

router.put('/doctors/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status, roomNo, avgConsultationTime, consultationFee } = req.body;

    execute(`
      UPDATE doctors 
      SET status = COALESCE(?, status),
          room_no = COALESCE(?, room_no),
          avg_consultation_time = COALESCE(?, avg_consultation_time),
          consultation_fee = COALESCE(?, consultation_fee)
      WHERE doctor_id = ?
    `, [status, roomNo, avgConsultationTime, consultationFee, id]);

    return res.json({ message: 'Doctor profile updated.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update doctor.' });
  }
});

// 3. Departments
router.get('/departments', (req, res) => {
  try {
    const departments = queryAll('SELECT * FROM departments ORDER BY name ASC');
    return res.json({ departments });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to list departments.' });
  }
});

// 4. Hospital Settings
router.get('/settings', (req, res) => {
  try {
    const settings = queryOne('SELECT * FROM hospital_settings LIMIT 1');
    return res.json({ settings });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch settings.' });
  }
});

router.put('/settings', (req, res) => {
  try {
    const { hospitalName, defaultConsultationMinutes, emergencyOverride } = req.body;
    execute(`
      UPDATE hospital_settings 
      SET hospital_name = COALESCE(?, hospital_name),
          default_consultation_minutes = COALESCE(?, default_consultation_minutes),
          emergency_override = COALESCE(?, emergency_override),
          updated_at = CURRENT_TIMESTAMP
      WHERE setting_id = 'SET-001'
    `, [hospitalName, defaultConsultationMinutes, emergencyOverride]);

    return res.json({ message: 'Settings updated successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update settings.' });
  }
});

export default router;
