import { Router } from 'express';
import { queryAll, queryOne } from '../db/database.ts';

const router = Router();

// GET /api/diseases - List all 50 curated conditions
router.get('/', (req, res) => {
  try {
    const { category, search } = req.query;

    let sql = 'SELECT * FROM diseases WHERE 1=1';
    const params: any[] = [];

    if (category && category !== 'All') {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      sql += ' AND (name LIKE ? OR description LIKE ? OR recommended_specialty LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY number ASC';

    const diseases = queryAll(sql, params);
    return res.json({ diseases, count: diseases.length });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/diseases/:id - Details, matched doctors, and hospital locations
router.get('/:id', (req, res) => {
  try {
    const disease = queryOne(
      'SELECT * FROM diseases WHERE disease_id = ? OR number = ?',
      [req.params.id, parseInt(req.params.id, 10) || 0]
    );

    if (!disease) {
      return res.status(404).json({ error: 'Disease not found' });
    }

    // Match doctors in the hospital database for this specialty
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
        h.hospital_id,
        h.name as hospital_name,
        h.address as hospital_address,
        h.distance_km as hospital_distance,
        h.is_open_247,
        h.google_maps_url
      FROM doctors d
      LEFT JOIN hospitals h ON d.hospital_id = h.hospital_id
      WHERE d.specialization LIKE ? OR d.specialization = ?
      ORDER BY d.rating DESC
    `, [`%${disease.recommended_specialty}%`, disease.recommended_specialty]);

    return res.json({ disease, doctors });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
