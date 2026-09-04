import { Router } from 'express';
import { queryAll, queryOne } from '../db/database.ts';

const router = Router();

// GET /api/hospitals - List all hospitals with real location & emergency details
router.get('/', (req, res) => {
  try {
    const hospitals = queryAll(`
      SELECT 
        hospital_id,
        name,
        address,
        city,
        latitude,
        longitude,
        distance_km,
        rating,
        total_reviews,
        is_open_247,
        emergency_phone,
        google_maps_url,
        (SELECT COUNT(*) FROM doctors WHERE doctors.hospital_id = hospitals.hospital_id) as doctor_count
      FROM hospitals
      ORDER BY distance_km ASC
    `);

    return res.json({ hospitals });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/hospitals/:id - Get specific hospital details and its doctors
router.get('/:id', (req, res) => {
  try {
    const hospital = queryOne('SELECT * FROM hospitals WHERE hospital_id = ?', [req.params.id]);
    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }

    const doctors = queryAll(`
      SELECT 
        d.doctor_id,
        d.name,
        d.specialization,
        d.qualification,
        d.experience,
        d.rating,
        d.total_reviews,
        d.consultation_fee,
        d.status,
        d.room_no,
        dep.name as department_name
      FROM doctors d
      JOIN departments dep ON d.department_id = dep.department_id
      WHERE d.hospital_id = ?
    `, [req.params.id]);

    return res.json({ hospital, doctors });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
