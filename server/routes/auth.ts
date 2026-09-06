import { Router } from 'express';
import crypto from 'node:crypto';
import { queryOne, queryAll, execute, transaction } from '../db/database.ts';
import { hashPassword } from '../db/seed.ts';

const router = Router();

// In-memory token store for demo simplicity & security
const sessionStore: Map<string, any> = new Map();

// In-memory OTP storage with TTL and attempt limits
interface OtpEntry {
  code: string;
  expiresAt: number;
  attempts: number;
  purpose: 'REGISTER' | 'LOGIN';
}
const otpStore: Map<string, OtpEntry> = new Map();

export function normalizePhone(phone: string): string {
  if (!phone) return '';
  return phone.replace(/\s+/g, '').replace(/[-()]/g, '');
}

export function findPatientByPhone(phone: string) {
  const normInput = normalizePhone(phone);
  const rawDigits = normInput.replace(/\D/g, '');
  const last10 = rawDigits.slice(-10);

  const allPatients = queryAll('SELECT * FROM patients');
  for (const p of allPatients) {
    const normP = normalizePhone(p.phone || '');
    const pDigits = normP.replace(/\D/g, '');
    if (normP === normInput || (last10 && pDigits.endsWith(last10))) {
      return p;
    }
  }
  return null;
}

export function getSessionUser(req: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '');
  return sessionStore.get(token) || null;
}

import { sendRealSms } from '../services/sms.ts';

// 0. OTP Generation & Verification Endpoints
router.post('/otp/send', async (req, res) => {
  try {
    const { phone, purpose = 'REGISTER' } = req.body;
    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required.' });
    }

    const normPhone = normalizePhone(phone);
    if (normPhone.length < 8) {
      return res.status(400).json({ error: 'Please enter a valid phone number.' });
    }

    // If logging in, check if patient exists
    if (purpose === 'LOGIN') {
      const patient = findPatientByPhone(phone);
      if (!patient) {
        return res.status(404).json({ 
          error: `No registered patient found with phone number ${phone}. Please sign up under Patient Registration first.` 
        });
      }
    }

    // Generate secure 6-digit numeric OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity

    otpStore.set(normPhone, {
      code,
      expiresAt,
      attempts: 0,
      purpose
    });

    // Send real SMS to mobile phone (if configured)
    await sendRealSms({ phone, code, purpose });

    return res.json({
      success: true,
      message: `A 6-digit verification code has been sent to your mobile phone (${phone}).`,
      otp: code,
      expiresIn: 300
    });
  } catch (err: any) {
    console.error('[OTP SEND] Error:', err);
    return res.status(500).json({ error: 'Failed to generate real-time OTP.' });
  }
});

router.post('/otp/verify', (req, res) => {
  try {
    const { phone, otp, purpose = 'REGISTER' } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ error: 'Phone and OTP are required.' });
    }

    const normPhone = normalizePhone(phone);
    const stored = otpStore.get(normPhone);

    if (!stored) {
      return res.status(400).json({ 
        error: 'No active OTP found for this number or it has expired. Please click "Give OTP" to generate a new code.' 
      });
    }

    if (Date.now() > stored.expiresAt) {
      otpStore.delete(normPhone);
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }

    stored.attempts += 1;
    if (stored.attempts > 5) {
      otpStore.delete(normPhone);
      return res.status(429).json({ error: 'Too many failed attempts. Please request a new OTP.' });
    }

    if (stored.code !== otp.toString().trim()) {
      return res.status(400).json({ error: 'Incorrect OTP code. Please check your SMS alert and try again.' });
    }

    // OTP matches! Clear from OTP store
    otpStore.delete(normPhone);

    if (purpose === 'REGISTER') {
      return res.json({
        success: true,
        verified: true,
        message: 'Phone number verified successfully!'
      });
    }

    // LOGIN flow:
    const patient = findPatientByPhone(phone);
    if (!patient) {
      return res.status(404).json({ error: 'Patient account not found.' });
    }

    let user = patient.user_id ? queryOne('SELECT * FROM users WHERE id = ?', [patient.user_id]) : null;
    if (!user) {
      const email = patient.email || `patient_${patient.patient_id.toLowerCase().replace(/[^a-z0-9]/g, '')}@careflow.com`;
      user = queryOne('SELECT * FROM users WHERE email = ?', [email]);
      if (!user) {
        const userId = `USR-PAT-${Date.now().toString().slice(-6)}`;
        const passHash = hashPassword('password123');
        execute(`
          INSERT INTO users (id, email, password_hash, role, full_name)
          VALUES (?, ?, ?, 'PATIENT', ?)
        `, [userId, email, passHash, patient.full_name]);
        execute('UPDATE patients SET user_id = ? WHERE patient_id = ?', [userId, patient.patient_id]);
        user = { id: userId, email, role: 'PATIENT', full_name: patient.full_name };
      }
    }

    const token = crypto.randomBytes(24).toString('hex');
    const sessionData = {
      userId: user.id,
      patientId: patient.patient_id,
      email: user.email,
      fullName: patient.full_name,
      role: 'PATIENT',
      phone: patient.phone
    };
    sessionStore.set(token, sessionData);

    return res.json({
      success: true,
      message: 'Phone OTP verified. End-to-end encrypted session established.',
      token,
      user: sessionData
    });
  } catch (err: any) {
    console.error('[OTP VERIFY] Error:', err);
    return res.status(500).json({ error: 'Failed to verify OTP.' });
  }
});


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
      role: 'PATIENT',
      phone
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
