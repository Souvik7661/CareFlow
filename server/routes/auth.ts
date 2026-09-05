import { Router } from 'express';
import crypto from 'node:crypto';
import { queryOne, queryAll, execute, transaction } from '../db/database.ts';
import { hashPassword } from '../db/seed.ts';

const router = Router();

// In-memory token store for demo simplicity & security
const sessionStore: Map<string, any> = new Map();

export function getSessionUser(req: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '');
  return sessionStore.get(token) || null;
}

// 1. Patient Registration
router.post('/register', (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      dob,
      age,
      gender,
      phone,
      address,
      bloodGroup,
      allergies,
      medicalHistory,
      currentMedications,
      emergencyContact
    } = req.body;

    let effectiveAge = age;
    if (!effectiveAge && dob) {
      const birthYear = new Date(dob).getFullYear();
      if (!isNaN(birthYear)) effectiveAge = Math.max(1, new Date().getFullYear() - birthYear);
    }
    if (!effectiveAge) effectiveAge = 30;

    if (!fullName || !phone || !gender) {
      return res.status(400).json({ error: 'Full name, phone, and gender are required.' });
    }

    const effectiveEmail = email || `patient_${Date.now()}@careflow.com`;
    const existing = queryOne('SELECT id FROM users WHERE email = ?', [effectiveEmail]);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    // Auto-generate Patient ID (e.g. PAT-2026-00452)
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const patientId = `PAT-2026-${randomSuffix}`;
    const userId = `USR-PAT-${Date.now().toString().slice(-6)}`;
    const passHash = hashPassword(password || 'password123');

    transaction(() => {
      execute(`
        INSERT INTO users (id, email, password_hash, role, full_name)
        VALUES (?, ?, ?, 'PATIENT', ?)
      `, [userId, effectiveEmail, passHash, fullName]);

      execute(`
        INSERT INTO patients (
          patient_id, user_id, full_name, date_of_birth, age, gender, 
          phone, email, address, blood_group, allergies, medical_history, 
          current_medications, emergency_contact
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        patientId,
        userId,
        fullName,
        dob || null,
        parseInt(effectiveAge.toString(), 10),
        gender,
        phone,
        effectiveEmail,
        address || 'Hospital City',
        bloodGroup || 'O+',
        allergies || 'None',
        medicalHistory || 'None reported',
        currentMedications || 'None',
        emergencyContact || 'Emergency Contact'
      ]);

      // Welcome Notification
      execute(`
        INSERT INTO notifications (notification_id, patient_id, type, title, message)
        VALUES (?, ?, 'GENERAL', 'Welcome to CareFlow AI', ?)
      `, [
        `NOTIF-${Date.now()}`,
        patientId,
        `Welcome to CareFlow AI, ${fullName}! Your unique Patient ID is ${patientId}. You can now describe your health concern and let our AI match you with the best specialist.`
      ]);
    });

    const token = crypto.randomBytes(24).toString('hex');
    const userData = {
      userId,
      patientId,
      fullName,
      email: effectiveEmail,
      role: 'PATIENT'
    };
    sessionStore.set(token, userData);

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: userData
    });
  } catch (err: any) {
    console.error('[AUTH] Registration error:', err);
    return res.status(500).json({ error: 'Registration failed. ' + err.message });
  }
});

// 2. Login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const passHash = hashPassword(password);
    const user = queryOne(`
      SELECT * FROM users WHERE email = ? AND password_hash = ?
    `, [email.toLowerCase().trim(), passHash]);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    let extraInfo: any = {};
    if (user.role === 'PATIENT') {
      const patient = queryOne('SELECT patient_id FROM patients WHERE user_id = ?', [user.id]);
      if (patient) extraInfo.patientId = patient.patient_id;
    } else if (user.role === 'DOCTOR') {
      const doctor = queryOne('SELECT doctor_id, specialization, room_no FROM doctors WHERE user_id = ?', [user.id]);
      if (doctor) {
        extraInfo.doctorId = doctor.doctor_id;
        extraInfo.specialization = doctor.specialization;
        extraInfo.roomNo = doctor.room_no;
      }
    }

    const token = crypto.randomBytes(24).toString('hex');
    const sessionData = {
      userId: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      ...extraInfo
    };
    sessionStore.set(token, sessionData);

    return res.json({
      message: 'Login successful',
      token,
      user: sessionData
    });
  } catch (err: any) {
    console.error('[AUTH] Login error:', err);
    return res.status(500).json({ error: 'Login failed.' });
  }
});

// 3. Quick 1-Click Demo Login (for evaluation convenience)
router.post('/demo-login', (req, res) => {
  try {
    const { role, doctorId } = req.body;
    let targetEmail = 'patient@careflow.com';

    if (role === 'DOCTOR') {
      if (doctorId) {
        const doc = queryOne('SELECT email FROM doctors WHERE doctor_id = ?', [doctorId]);
        if (doc && doc.email) targetEmail = doc.email;
        else targetEmail = 'doctor.sharma@careflow.com';
      } else {
        targetEmail = 'doctor.sharma@careflow.com';
      }
    } else if (role === 'RECEPTIONIST') {
      targetEmail = 'reception@careflow.com';
    } else if (role === 'ADMIN') {
      targetEmail = 'admin@careflow.com';
    }

    const user = queryOne('SELECT * FROM users WHERE email = ?', [targetEmail]);
    if (!user) {
      return res.status(404).json({ error: `Demo user for role ${role} not found.` });
    }

    let extraInfo: any = {};
    if (user.role === 'PATIENT') {
      const p = queryOne('SELECT patient_id FROM patients WHERE user_id = ?', [user.id]);
      if (p) extraInfo.patientId = p.patient_id;
    } else if (user.role === 'DOCTOR') {
      const d = queryOne('SELECT doctor_id, specialization, room_no FROM doctors WHERE user_id = ?', [user.id]);
      if (d) {
        extraInfo.doctorId = d.doctor_id;
        extraInfo.specialization = d.specialization;
        extraInfo.roomNo = d.room_no;
      }
    }

    const token = crypto.randomBytes(24).toString('hex');
    const sessionData = {
      userId: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      ...extraInfo
    };
    sessionStore.set(token, sessionData);

    return res.json({
      message: `Switched to demo role: ${user.role}`,
      token,
      user: sessionData
    });
  } catch (err: any) {
    console.error('[AUTH] Demo login error:', err);
    return res.status(500).json({ error: 'Demo login failed.' });
  }
});

// 4. Current User Session
router.get('/me', (req, res) => {
  const user = getSessionUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  return res.json({ user });
});

// 5. Logout
router.post('/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    sessionStore.delete(token);
  }
  return res.json({ message: 'Logged out successfully' });
});

export default router;
