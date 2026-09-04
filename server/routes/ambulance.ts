import { Router } from 'express';
import { queryAll, queryOne, execute } from '../db/database.ts';

const router = Router();

// POST /api/ambulance/request - Request Emergency Ambulance
router.post('/request', (req, res) => {
  try {
    const {
      patientId,
      hospitalId = 'HOSP-01',
      pickupAddress = 'MG Road, Your City',
      ambulanceType = 'Basic'
    } = req.body;

    const hospital = queryOne('SELECT * FROM hospitals WHERE hospital_id = ?', [hospitalId]) ||
      queryOne('SELECT * FROM hospitals LIMIT 1');

    const requestId = `AMB-${Date.now()}`;
    const vehicleNumber = `WB-02-${Math.floor(1000 + Math.random() * 9000)}`;
    const driverNames = ['Ramesh Kumar', 'Suresh Mondal', 'Bikram Das', 'Arun Ghosh'];
    const driverName = driverNames[Math.floor(Math.random() * driverNames.length)];
    const driverPhone = `+91 98310 ${Math.floor(10000 + Math.random() * 90000)}`;
    const etaMinutes = 8; // Exactly matching Screen 7 in the user's blueprint ("Estimated Arrival: 8 mins via fastest route")

    execute(`
      INSERT INTO ambulance_requests (
        request_id, patient_id, hospital_id, pickup_address, pickup_lat, pickup_lng,
        ambulance_type, eta_minutes, status, driver_name, driver_phone, vehicle_number
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'DISPATCHED', ?, ?, ?)
    `, [
      requestId,
      patientId || 'PAT-DEMO',
      hospital.hospital_id,
      pickupAddress,
      22.5680,
      88.3610,
      ambulanceType,
      etaMinutes,
      driverName,
      driverPhone,
      vehicleNumber
    ]);

    return res.status(201).json({
      message: 'Ambulance dispatched successfully',
      ambulance: {
        requestId,
        hospitalName: hospital.name,
        pickupAddress,
        ambulanceType,
        etaMinutes,
        status: 'DISPATCHED',
        driverName,
        driverPhone,
        vehicleNumber,
        hospitalPhone: hospital.emergency_phone,
        hospitalCoords: { lat: hospital.latitude, lng: hospital.longitude },
        pickupCoords: { lat: 22.5680, lng: 88.3610 }
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/ambulance/active - Get current active ambulance request
router.get('/active', (req, res) => {
  try {
    const { patientId } = req.query;
    const reqRecord = queryOne(`
      SELECT 
        a.*,
        h.name as hospital_name,
        h.emergency_phone as hospital_phone,
        h.latitude as hospital_lat,
        h.longitude as hospital_lng
      FROM ambulance_requests a
      JOIN hospitals h ON a.hospital_id = h.hospital_id
      WHERE a.status IN ('DISPATCHED', 'EN_ROUTE', 'ARRIVED')
      ORDER BY a.created_at DESC
      LIMIT 1
    `);

    if (!reqRecord) {
      return res.json({ active: false });
    }

    return res.json({
      active: true,
      ambulance: {
        requestId: reqRecord.request_id,
        hospitalName: reqRecord.hospital_name,
        pickupAddress: reqRecord.pickup_address,
        ambulanceType: reqRecord.ambulance_type,
        etaMinutes: reqRecord.eta_minutes,
        status: reqRecord.status,
        driverName: reqRecord.driver_name,
        driverPhone: reqRecord.driver_phone,
        vehicleNumber: reqRecord.vehicle_number,
        hospitalPhone: reqRecord.hospital_phone,
        hospitalCoords: { lat: reqRecord.hospital_lat, lng: reqRecord.hospital_lng },
        pickupCoords: { lat: reqRecord.pickup_lat, lng: reqRecord.pickup_lng }
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/ambulance/cancel - Cancel active ambulance request
router.post('/cancel', (req, res) => {
  try {
    const { requestId } = req.body;
    execute("UPDATE ambulance_requests SET status = 'CANCELLED' WHERE request_id = ?", [requestId]);
    return res.json({ message: 'Ambulance request cancelled' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
