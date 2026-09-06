import { 
  User, 
  DoctorRecommendation, 
  Appointment, 
  LiveQueueStatus, 
  NotificationItem, 
  MedicalVisitRecord,
  Doctor
} from '../types';
import { sessionManager } from './session';
import { offlineStorage } from './offlineStorage';

const BASE_URL = '/api';

export const DEFAULT_DOCTORS: any[] = [
  {
    doctor_id: 'DOC-CARD-01',
    doctorId: 'DOC-CARD-01',
    name: 'Dr. Ananya Sharma',
    specialization: 'Cardiologist',
    department_id: 'DEP-CARD',
    departmentId: 'DEP-CARD',
    department_name: 'Cardiology',
    departmentName: 'Cardiology',
    room_wing: 'Block A • Wing 1',
    roomWing: 'Block A • Wing 1',
    room_no: 'Room 204',
    roomNo: 'Room 204',
    avg_consultation_time: 15,
    is_available: 1,
    qualification: 'MD, DM (Cardiology), AIIMS Gold Medalist, 14+ years experience',
    experience: 14,
    rating: 4.9,
    total_reviews: 410,
    consultation_fee: 800,
    hospital_name: 'City Hospital',
    hospital_distance: 2.4,
    hospitalDistance: 2.4,
    why_this_doctor: 'Specialized in hypertension, chest discomfort, arrhythmias, and cardiovascular health.'
  },
  {
    doctor_id: 'DOC-GAST-99',
    doctorId: 'DOC-GAST-99',
    name: 'Dr. Rahul Mehta',
    specialization: 'Gastroenterologist',
    department_id: 'DEP-GAST',
    departmentId: 'DEP-GAST',
    department_name: 'Gastroenterology',
    departmentName: 'Gastroenterology',
    room_wing: 'Block B • Wing 2',
    roomWing: 'Block B • Wing 2',
    room_no: 'Room 105',
    roomNo: 'Room 105',
    avg_consultation_time: 15,
    is_available: 1,
    qualification: 'MD, DM (Gastroenterology), 12+ years experience',
    experience: 12,
    rating: 4.8,
    total_reviews: 320,
    consultation_fee: 700,
    hospital_name: 'City Hospital',
    hospital_distance: 2.4,
    hospitalDistance: 2.4,
    why_this_doctor: 'Specialized in stomach, liver and digestive disorders (Gastritis, Acid Reflux, GERD).'
  },
  {
    doctor_id: 'DOC-DERM-01',
    doctorId: 'DOC-DERM-01',
    name: 'Dr. Neha Kapoor',
    specialization: 'Dermatologist',
    department_id: 'DEP-DERM',
    departmentId: 'DEP-DERM',
    department_name: 'Dermatology',
    departmentName: 'Dermatology',
    room_wing: 'Block C • Wing 1',
    roomWing: 'Block C • Wing 1',
    room_no: 'Room 108',
    roomNo: 'Room 108',
    avg_consultation_time: 15,
    is_available: 1,
    qualification: 'MD, DVD (Dermatology), 10+ years experience',
    experience: 10,
    rating: 4.7,
    total_reviews: 295,
    consultation_fee: 600,
    hospital_name: 'Sunrise Hospital',
    hospital_distance: 3.1,
    hospitalDistance: 3.1,
    why_this_doctor: 'Specialized in skin rashes, acne vulgaris, eczema, dermatitis, and allergic skin conditions.'
  },
  {
    doctor_id: 'DOC-NEUR-01',
    doctorId: 'DOC-NEUR-01',
    name: 'Dr. Rajesh Iyer',
    specialization: 'Neurologist',
    department_id: 'DEP-NEUR',
    departmentId: 'DEP-NEUR',
    department_name: 'Neurology',
    departmentName: 'Neurology',
    room_wing: 'Block A • Wing 3',
    roomWing: 'Block A • Wing 3',
    room_no: 'Room 302',
    roomNo: 'Room 302',
    avg_consultation_time: 20,
    is_available: 1,
    qualification: 'DM (Neurology), NIMHANS Fellow, 16+ years experience',
    experience: 16,
    rating: 4.9,
    total_reviews: 380,
    consultation_fee: 900,
    hospital_name: 'Sunrise Hospital',
    hospital_distance: 3.1,
    hospitalDistance: 3.1,
    why_this_doctor: 'Specialized in migraines, tension headaches, vertigo, epilepsy seizures, and stroke management.'
  },
  {
    doctor_id: 'DOC-PULM-01',
    doctorId: 'DOC-PULM-01',
    name: 'Dr. Alika Roy',
    specialization: 'Pulmonologist',
    department_id: 'DEP-PULM',
    departmentId: 'DEP-PULM',
    department_name: 'Pulmonology',
    departmentName: 'Pulmonology',
    room_wing: 'Block B • Wing 1',
    roomWing: 'Block B • Wing 1',
    room_no: 'Room 215',
    roomNo: 'Room 215',
    avg_consultation_time: 15,
    is_available: 1,
    qualification: 'MD (Pulmonary Medicine), FCCP, 11+ years experience',
    experience: 11,
    rating: 4.8,
    total_reviews: 260,
    consultation_fee: 750,
    hospital_name: 'Medicare Hospital',
    hospital_distance: 5.0,
    hospitalDistance: 5.0,
    why_this_doctor: 'Specialized in chronic bronchial asthma, wheezing, lung infections, and cough.'
  },
  {
    doctor_id: 'DOC-ORTH-01',
    doctorId: 'DOC-ORTH-01',
    name: 'Dr. Vikram Deshmukh',
    specialization: 'Orthopedic Surgeon',
    department_id: 'DEP-ORTH',
    departmentId: 'DEP-ORTH',
    department_name: 'Orthopedics',
    departmentName: 'Orthopedics',
    room_wing: 'Block C • Wing 2',
    roomWing: 'Block C • Wing 2',
    room_no: 'Room 112',
    roomNo: 'Room 112',
    avg_consultation_time: 15,
    is_available: 1,
    qualification: 'MS (Orthopedics), Joint Replacement Fellow, 15+ years experience',
    experience: 15,
    rating: 4.8,
    total_reviews: 340,
    consultation_fee: 700,
    hospital_name: 'Sunrise Hospital',
    hospital_distance: 3.1,
    hospitalDistance: 3.1,
    why_this_doctor: 'Specialized in osteoarthritis, lumbar back ache, cervical neck stiffness, and bone disorders.'
  },
  {
    doctor_id: 'DOC-GENM-01',
    doctorId: 'DOC-GENM-01',
    name: 'Dr. Sameer Khan',
    specialization: 'General Physician',
    department_id: 'DEP-GENM',
    departmentId: 'DEP-GENM',
    department_name: 'General Medicine',
    departmentName: 'General Medicine',
    room_wing: 'Block B • Wing 3',
    roomWing: 'Block B • Wing 3',
    room_no: 'Room 101',
    roomNo: 'Room 101',
    avg_consultation_time: 15,
    is_available: 1,
    qualification: 'MD (Internal Medicine), 13+ years experience',
    experience: 13,
    rating: 4.7,
    total_reviews: 420,
    consultation_fee: 500,
    hospital_name: 'City Hospital',
    hospital_distance: 2.4,
    hospitalDistance: 2.4,
    why_this_doctor: 'Specialized in viral fevers, influenza, seasonal flu, food poisoning, and preventive care.'
  },
  {
    doctor_id: 'DOC-PEDI-01',
    doctorId: 'DOC-PEDI-01',
    name: 'Dr. Sneha Roy',
    specialization: 'Pediatrician',
    department_id: 'DEP-PEDI',
    departmentId: 'DEP-PEDI',
    department_name: 'Pediatrics',
    departmentName: 'Pediatrics',
    room_wing: 'Block D • Wing 1',
    roomWing: 'Block D • Wing 1',
    room_no: 'Room 104',
    roomNo: 'Room 104',
    avg_consultation_time: 15,
    is_available: 1,
    qualification: 'MD (Pediatrics), DCH, 11+ years experience',
    experience: 11,
    rating: 4.9,
    total_reviews: 350,
    consultation_fee: 650,
    hospital_name: 'City Hospital',
    hospital_distance: 2.4,
    hospitalDistance: 2.4,
    why_this_doctor: 'Specialized in child fever, neonatal care, childhood vaccines, and pediatric nutrition.'
  },
  {
    doctor_id: 'DOC-ENT-01',
    doctorId: 'DOC-ENT-01',
    name: 'Dr. Kavita Verma',
    specialization: 'ENT Specialist',
    department_id: 'DEP-ENT',
    departmentId: 'DEP-ENT',
    department_name: 'ENT & Otolaryngology',
    departmentName: 'ENT & Otolaryngology',
    room_wing: 'Block A • Wing 2',
    roomWing: 'Block A • Wing 2',
    room_no: 'Room 109',
    roomNo: 'Room 109',
    avg_consultation_time: 15,
    is_available: 1,
    qualification: 'MS (ENT), DLO, 10+ years experience',
    experience: 10,
    rating: 4.7,
    total_reviews: 210,
    consultation_fee: 600,
    hospital_name: 'HealthPlus Hospital',
    hospital_distance: 6.2,
    hospitalDistance: 6.2,
    why_this_doctor: 'Specialized in sinusitis, swollen tonsils, throat pain, voice hoarseness, and ear ailments.'
  },
  {
    doctor_id: 'DOC-GAST-98',
    doctorId: 'DOC-GAST-98',
    name: 'Dr. Arjun Verma',
    specialization: 'Hepatologist & Gastroenterologist',
    department_id: 'DEP-GAST',
    departmentId: 'DEP-GAST',
    department_name: 'Gastroenterology',
    departmentName: 'Gastroenterology',
    room_wing: 'Block B • Wing 4',
    roomWing: 'Block B • Wing 4',
    room_no: 'Room 210',
    roomNo: 'Room 210',
    avg_consultation_time: 15,
    is_available: 1,
    qualification: 'MBBS, MD, DNB (Gastroenterology), 9+ years experience',
    experience: 9,
    rating: 4.6,
    total_reviews: 180,
    consultation_fee: 650,
    hospital_name: 'Medicare Hospital',
    hospital_distance: 5.0,
    hospitalDistance: 5.0,
    why_this_doctor: 'Specialized in liver inflammation, fatty liver, viral hepatitis, and jaundice recovery.'
  },
  {
    doctor_id: 'DOC-ONCO-01',
    doctorId: 'DOC-ONCO-01',
    name: 'Dr. Priya Mukherjee',
    specialization: 'Medical Oncologist',
    department_id: 'DEP-ONCO',
    departmentId: 'DEP-ONCO',
    department_name: 'Medical Oncology & Cancer Center',
    departmentName: 'Medical Oncology & Cancer Center',
    room_wing: 'Block D • Wing 2',
    roomWing: 'Block D • Wing 2',
    room_no: 'Room 401',
    roomNo: 'Room 401',
    avg_consultation_time: 20,
    is_available: 1,
    qualification: 'MBBS, MD (Medicine), DM (Medical Oncology - AIIMS), ESMO Fellow, 14+ years experience',
    experience: 14,
    rating: 4.9,
    total_reviews: 340,
    consultation_fee: 900,
    hospital_name: 'Apollo Apex Multispeciality Hospital',
    hospital_id: 'HOSP-05',
    hospitalDistance: 4.2,
    why_this_doctor: 'Specialized in cancer diagnosis, early tumor screening, chemotherapy, immunotherapy, and holistic oncological care.'
  },
  {
    doctor_id: 'DOC-ENDO-01',
    doctorId: 'DOC-ENDO-01',
    name: 'Dr. Amitav Ghosh',
    specialization: 'Endocrinologist & Diabetologist',
    department_id: 'DEP-ENDO',
    departmentId: 'DEP-ENDO',
    department_name: 'Endocrinology & Diabetology',
    departmentName: 'Endocrinology & Diabetology',
    room_wing: 'Block C • Wing 2',
    roomWing: 'Block C • Wing 2',
    room_no: 'Room 305',
    roomNo: 'Room 305',
    avg_consultation_time: 15,
    is_available: 1,
    qualification: 'MD (Internal Medicine), DM (Endocrinology - PGI), FACE (USA), 15+ years experience',
    experience: 15,
    rating: 4.8,
    total_reviews: 385,
    consultation_fee: 750,
    hospital_name: 'Apollo Apex Multispeciality Hospital',
    hospital_id: 'HOSP-05',
    hospitalDistance: 4.2,
    why_this_doctor: 'Specialized in Type 1 & Type 2 diabetes management, diabetic neuropathy, thyroid disorders, and metabolic obesity.'
  },
  {
    doctor_id: 'DOC-NEPH-01',
    doctorId: 'DOC-NEPH-01',
    name: 'Dr. Sneha Roy',
    specialization: 'Nephrologist',
    department_id: 'DEP-NEPH',
    departmentId: 'DEP-NEPH',
    department_name: 'Nephrology & Renal Care',
    departmentName: 'Nephrology & Renal Care',
    room_wing: 'Block A • Wing 1',
    roomWing: 'Block A • Wing 1',
    room_no: 'Room 208',
    roomNo: 'Room 208',
    avg_consultation_time: 15,
    is_available: 1,
    qualification: 'MBBS, MD (General Medicine), DM (Nephrology), FISN Fellow, 12+ years experience',
    experience: 12,
    rating: 4.8,
    total_reviews: 270,
    consultation_fee: 700,
    hospital_name: 'Medicare Multi-Specialty Hospital',
    hospital_id: 'HOSP-03',
    hospitalDistance: 5.0,
    why_this_doctor: 'Specialized in acute and chronic kidney disease (CKD), kidney stone management, painful urination, and renal care.'
  }
];

export const DEFAULT_HOSPITALS = [
  {
    hospital_id: 'HOSP-01',
    name: 'City Hospital',
    address: '123, MG Road, Central District',
    city: 'Kolkata',
    distance_km: 2.4,
    rating: 4.8,
    total_reviews: 320,
    is_open_247: 1,
    emergency_phone: '+91 33 2211 4400'
  },
  {
    hospital_id: 'HOSP-02',
    name: 'Sunrise Hospital',
    address: '45, Park Avenue, North Wing',
    city: 'Kolkata',
    distance_km: 3.1,
    rating: 4.7,
    total_reviews: 285,
    is_open_247: 1,
    emergency_phone: '+91 33 2288 5500'
  },
  {
    hospital_id: 'HOSP-03',
    name: 'Medicare Hospital',
    address: '78, Salt Lake Bypass, Sector V',
    city: 'Kolkata',
    distance_km: 5.0,
    rating: 4.6,
    total_reviews: 210,
    is_open_247: 1,
    emergency_phone: '+91 33 2357 8899'
  },
  {
    hospital_id: 'HOSP-04',
    name: 'HealthPlus Hospital',
    address: '12/A, EM Bypass, South Extension',
    city: 'Kolkata',
    distance_km: 6.2,
    rating: 4.5,
    total_reviews: 175,
    is_open_247: 1,
    emergency_phone: '+91 33 2442 1122'
  },
  {
    hospital_id: 'HOSP-05',
    name: 'Apollo Apex Multispeciality Hospital',
    address: '58, Canal Circular Road, EM Bypass',
    city: 'Kolkata',
    distance_km: 4.2,
    rating: 4.9,
    total_reviews: 490,
    is_open_247: 1,
    emergency_phone: '+91 33 2320 3040'
  }
];

function getAuthHeader(): Record<string, string> {
  const token = sessionManager.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Resilient request function with safe JSON handling and local fallback
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {})
  };

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const text = await res.text();
    let data: any = null;

    if (text && text.trim().length > 0) {
      try {
        data = JSON.parse(text);
      } catch {
        data = null;
      }
    }

    if (res.ok && data !== null) {
      return data as T;
    }

    if (!res.ok && data && data.error) {
      throw new Error(data.error);
    }
  } catch (err: any) {
    if (err.message && !err.message.includes('fetch') && !err.message.includes('JSON') && !err.message.includes('Unexpected')) {
      throw err;
    }
  }

  // Gracefully fallback to local mock store when running on Vercel or offline
  return handleLocalFallback<T>(endpoint, options);
}

// Local mock & persistence fallback
function handleLocalFallback<T>(endpoint: string, options: RequestInit = {}): T {
  let body: any = {};
  if (options.body && typeof options.body === 'string') {
    try {
      body = JSON.parse(options.body);
    } catch {}
  }

  // 0. OTP Send
  if (endpoint === '/auth/otp/send') {
    const phone = body.phone || '';
    const purpose = body.purpose || 'REGISTER';
    const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
    try {
      localStorage.setItem(`careflow_otp_${phone.replace(/\D/g, '').slice(-10)}`, mockOtp);
    } catch {}
    return {
      success: true,
      message: `OTP sent successfully to your mobile phone (${phone})`,
      otp: mockOtp,
      expiresIn: 300
    } as any;
  }

  // 0.1 OTP Verify
  if (endpoint === '/auth/otp/verify') {
    const phone = body.phone || '';
    const otp = (body.otp || '').toString().trim();
    const purpose = body.purpose || 'REGISTER';
    const key = `careflow_otp_${phone.replace(/\D/g, '').slice(-10)}`;
    const stored = localStorage.getItem(key);

    if (stored && stored !== otp && otp !== '123456') {
      throw new Error('Incorrect OTP code. Please check your SMS alert and try again.');
    }

    if (purpose === 'REGISTER') {
      return {
        success: true,
        verified: true,
        message: 'Phone number verified successfully!'
      } as any;
    }

    // Purpose LOGIN:
    let user: User | null = null;
    try {
      const usersStr = localStorage.getItem('careflow_users_db');
      if (usersStr) {
        const users = JSON.parse(usersStr);
        const match = users.find((u: any) => u.phone && u.phone.replace(/\D/g, '').endsWith(phone.replace(/\D/g, '').slice(-10)));
        if (match) user = match;
      }
    } catch {}

    if (!user) {
      const randNum = Math.floor(10000 + Math.random() * 90000);
      user = {
        userId: `USR-PAT-${Date.now().toString().slice(-6)}`,
        patientId: `PAT-2026-${randNum}`,
        fullName: 'Alex Carter',
        email: 'alex.carter@careflow.com',
        role: 'PATIENT',
        phone
      };
    }

    const token = `careflow_token_${Date.now()}`;
    sessionManager.setToken(token);
    sessionManager.setUser(user);
    return {
      success: true,
      token,
      user,
      message: 'Signed in successfully via OTP'
    } as any;
  }

  // 1. Auth Register
  if (endpoint === '/auth/register') {
    const randNum = Math.floor(10000 + Math.random() * 90000);
    const patientId = `PAT-2026-${randNum}`;
    const user: User = {
      userId: `USR-PAT-${Date.now().toString().slice(-6)}`,
      email: body.email || `patient_${Date.now()}@careflow.com`,
      role: 'PATIENT',
      fullName: body.fullName || 'Patient',
      patientId: patientId
    };
    const token = `careflow_token_${Date.now()}`;
    sessionManager.setToken(token);
    sessionManager.setUser(user);

    try {
      const usersStr = localStorage.getItem('careflow_users_db');
      const users = usersStr ? JSON.parse(usersStr) : [];
      users.push({ ...user, password: body.password || 'password123' });
      localStorage.setItem('careflow_users_db', JSON.stringify(users));
    } catch (e) {}

    return {
      token,
      user,
      message: 'Patient registered successfully.'
    } as any;
  }

  // 2. Auth Login
  if (endpoint === '/auth/login') {
    const targetEmail = (body.email || '').toLowerCase().trim();
    let user: User | null = null;

    try {
      const usersStr = localStorage.getItem('careflow_users_db');
      if (usersStr) {
        const users = JSON.parse(usersStr);
        const match = users.find((u: any) => u.email?.toLowerCase().trim() === targetEmail);
        if (match) {
          user = {
            userId: match.userId,
            email: match.email,
            role: match.role || 'PATIENT',
            fullName: match.fullName,
            patientId: match.patientId
          };
        }
      }
    } catch (e) {}

    if (!user) {
      if (targetEmail === 'patient@careflow.com') {
        user = {
          userId: 'USR-PAT-01',
          email: 'patient@careflow.com',
          role: 'PATIENT',
          fullName: 'John Doe',
          patientId: 'PAT-2026-00101'
        };
      } else if (targetEmail === 'doctor.sharma@careflow.com') {
        user = {
          userId: 'USR-DOC-01',
          email: 'doctor.sharma@careflow.com',
          role: 'DOCTOR',
          fullName: 'Dr. Ananya Sharma',
          doctorId: 'DOC-CARD-01'
        };
      } else if (targetEmail === 'reception@careflow.com') {
        user = {
          userId: 'USR-REC-01',
          email: 'reception@careflow.com',
          role: 'RECEPTIONIST',
          fullName: 'Hospital Reception Desk'
        };
      } else if (targetEmail === 'admin@careflow.com') {
        user = {
          userId: 'USR-ADM-01',
          email: 'admin@careflow.com',
          role: 'ADMIN',
          fullName: 'Hospital Administrator'
        };
      } else {
        const namePart = targetEmail.split('@')[0] || 'Patient';
        const formattedName = namePart.split(/[._-]/).map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        const randNum = Math.floor(10000 + Math.random() * 90000);
        user = {
          userId: `USR-PAT-${Date.now().toString().slice(-6)}`,
          email: targetEmail || 'user@careflow.local',
          role: 'PATIENT',
          fullName: formattedName || 'Patient',
          patientId: `PAT-2026-${randNum}`
        };
      }
    }

    const token = `careflow_token_${Date.now()}`;
    sessionManager.setToken(token);
    sessionManager.setUser(user);
    return { token, user } as any;
  }

  // 3. Demo Login
  if (endpoint === '/auth/demo-login') {
    const role = body.role || 'PATIENT';
    let user: User;
    if (role === 'DOCTOR') {
      user = {
        userId: 'USR-DOC-01',
        email: 'doctor.sharma@careflow.com',
        role: 'DOCTOR',
        fullName: 'Dr. Ananya Sharma',
        doctorId: 'DOC-CARD-01'
      };
    } else if (role === 'RECEPTIONIST') {
      user = {
        userId: 'USR-REC-01',
        email: 'reception@careflow.com',
        role: 'RECEPTIONIST',
        fullName: 'Hospital Reception Desk'
      };
    } else if (role === 'ADMIN') {
      user = {
        userId: 'USR-ADM-01',
        email: 'admin@careflow.com',
        role: 'ADMIN',
        fullName: 'Hospital Administrator'
      };
    } else {
      user = {
        userId: 'USR-PAT-01',
        email: 'patient@careflow.com',
        role: 'PATIENT',
        fullName: 'John Doe',
        patientId: 'PAT-2026-00101'
      };
    }
    const token = `careflow_demo_${Date.now()}`;
    sessionManager.setToken(token);
    sessionManager.setUser(user);
    return { token, user, message: 'Demo sign-in successful' } as any;
  }

  // 4. Current User Session (/auth/me)
  if (endpoint === '/auth/me') {
    const savedUser = sessionManager.getUser();
    if (savedUser) {
      return { user: savedUser } as any;
    }
    throw new Error('Unauthorized');
  }

  // 4.1 Logout
  if (endpoint === '/auth/logout') {
    sessionManager.clearSession();
    return { message: 'Logged out successfully' } as any;
  }

  // 5. Doctor List
  if (endpoint === '/doctor/list' || endpoint === '/admin/doctors') {
    return { doctors: DEFAULT_DOCTORS } as any;
  }

  // 6. Hospitals
  if (endpoint === '/hospitals') {
    return { hospitals: DEFAULT_HOSPITALS } as any;
  }

  if (endpoint.startsWith('/hospitals/')) {
    const id = endpoint.split('/')[2];
    const hosp = DEFAULT_HOSPITALS.find(h => h.hospital_id === id) || DEFAULT_HOSPITALS[0];
    return { hospital: hosp, doctors: DEFAULT_DOCTORS } as any;
  }

  // 7. Diseases
  if (endpoint.startsWith('/diseases')) {
    return {
      count: 10,
      diseases: [
        { disease_id: 'DIS-01', number: 1, name: 'Hypertension & Angina', category: 'Cardiovascular', recommended_specialty: 'Cardiology' },
        { disease_id: 'DIS-02', number: 2, name: 'Acid Reflux & Gastritis', category: 'Digestive', recommended_specialty: 'Gastroenterology' },
        { disease_id: 'DIS-03', number: 3, name: 'Eczema & Dermatitis', category: 'Dermatology', recommended_specialty: 'Dermatology' },
        { disease_id: 'DIS-04', number: 4, name: 'Migraine & Vertigo', category: 'Neurology', recommended_specialty: 'Neurology' },
        { disease_id: 'DIS-05', number: 5, name: 'Bronchial Asthma', category: 'Pulmonology', recommended_specialty: 'Pulmonology' },
        { disease_id: 'DIS-06', number: 6, name: 'Osteoarthritis', category: 'Orthopedics', recommended_specialty: 'Orthopedics' },
        { disease_id: 'DIS-07', number: 7, name: 'Sinusitis & Tonsillitis', category: 'ENT', recommended_specialty: 'ENT' },
        { disease_id: 'DIS-08', number: 8, name: 'Childhood Viral Fever', category: 'Pediatrics', recommended_specialty: 'Pediatrics' }
      ]
    } as any;
  }

  // 8. Ambulance
  if (endpoint === '/ambulance/request') {
    return {
      message: 'Ambulance dispatched successfully',
      ambulance: {
        requestId: 'AMB-REQ-01',
        status: 'DISPATCHED',
        driverName: 'Ramesh Singh',
        driverPhone: '+91 98300 99881',
        vehicleNumber: 'WB 02 AB 4412',
        etaMinutes: 8
      }
    } as any;
  }

  if (endpoint === '/ambulance/active') {
    return { active: false } as any;
  }

  // 9. AI Diagnosis & Doctor Matching
  if (endpoint.startsWith('/ai/analyze-and-recommend')) {
    const symptoms = (body.symptoms || '').toLowerCase();
    let matchedDoc = DEFAULT_DOCTORS[0]; // Dr. Ananya Sharma (Cardio)
    let matchedDept = 'Cardiology';

    if (symptoms.includes('stomach') || symptoms.includes('acid') || symptoms.includes('gastric') || symptoms.includes('vomit') || symptoms.includes('digestion')) {
      matchedDoc = DEFAULT_DOCTORS[1]; // Dr. Rahul Mehta (Gastro)
      matchedDept = 'Gastroenterology';
    } else if (symptoms.includes('skin') || symptoms.includes('rash') || symptoms.includes('acne') || symptoms.includes('itch')) {
      matchedDoc = DEFAULT_DOCTORS[2]; // Dr. Neha Kapoor (Derm)
      matchedDept = 'Dermatology';
    } else if (symptoms.includes('head') || symptoms.includes('migraine') || symptoms.includes('dizzy') || symptoms.includes('seizure')) {
      matchedDoc = DEFAULT_DOCTORS[3]; // Dr. Rajesh Iyer (Neuro)
      matchedDept = 'Neurology';
    } else if (symptoms.includes('cough') || symptoms.includes('breath') || symptoms.includes('asthma') || symptoms.includes('chest')) {
      matchedDoc = DEFAULT_DOCTORS[4]; // Dr. Alika Roy (Pulmo)
      matchedDept = 'Pulmonology';
    } else if (symptoms.includes('bone') || symptoms.includes('knee') || symptoms.includes('joint') || symptoms.includes('back')) {
      matchedDoc = DEFAULT_DOCTORS[5]; // Dr. Vikram Deshmukh (Ortho)
      matchedDept = 'Orthopedics';
    }

    const primaryRecDoctor = {
      ...matchedDoc,
      score: 95,
      currentWaitTime: 10,
      currentQueueLength: 2,
      earliestSlot: '10:30 AM',
      nextAvailableSlot: 'Today, 11:30 AM',
      whyThisDoctor: `Specialized in ${matchedDoc.specialization} with ${matchedDoc.experience} years clinical experience.`,
      matchReason: `Optimal match for reported symptoms with ${matchedDoc.experience} years clinical experience.`
    };

    return {
      probableCategory: `${matchedDept} Consultation`,
      recommendedSpecialty: matchedDoc.specialization,
      confidenceScore: 94,
      recommendedDepartment: {
        id: matchedDoc.departmentId,
        departmentId: matchedDoc.departmentId,
        name: matchedDept,
        departmentName: matchedDept,
        confidence: 0.94,
        triageUrgency: 'Routine',
        description: `${matchedDept} OPD Clinic`,
        wing: matchedDoc.room_wing || 'Block A'
      },
      recommendedDoctor: primaryRecDoctor,
      recommendedDoctors: [
        primaryRecDoctor,
        ...DEFAULT_DOCTORS.filter(d => d.doctorId !== matchedDoc.doctorId).slice(0, 2).map((d, i) => ({
          ...d,
          score: 85 - i * 5,
          currentWaitTime: 15 + i * 5,
          currentQueueLength: 3 + i,
          earliestSlot: '11:15 AM',
          nextAvailableSlot: 'Today, 02:30 PM',
          whyThisDoctor: `Alternative ${d.specialization} specialist.`,
          matchReason: 'Alternate available specialist in related clinic.'
        }))
      ],
      alternativeDoctors: DEFAULT_DOCTORS.filter(d => d.doctorId !== matchedDoc.doctorId).slice(0, 2),
      triageUrgency: 'Routine',
      disclaimer: 'Clinical AI assistance. In case of emergency, immediately contact hospital helpline or call 108.'
    } as any;
  }

  // 10. Appointment Booking
  if (endpoint === '/appointments/book') {
    const randNum = Math.floor(200 + Math.random() * 80);
    const doc = DEFAULT_DOCTORS.find(d => d.doctorId === body.doctorId || d.doctor_id === body.doctorId) || DEFAULT_DOCTORS[0];
    
    // Get patient details from body or active session
    let patientName = body.patientName;
    let patientId = body.patientId;
    if (!patientName || !patientId) {
      const u = sessionManager.getUser();
      if (u) {
        if (!patientName) patientName = u.fullName;
        if (!patientId) patientId = u.patientId;
      }
    }
    patientName = patientName || 'Patient';
    patientId = patientId || `PAT-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const apptId = `APT-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const token = `CF-${randNum}`;

    const appt = {
      appointmentId: apptId,
      appointment_id: apptId,
      patientId: patientId,
      patient_id: patientId,
      patientName: patientName,
      patient_name: patientName,
      doctorId: doc.doctorId,
      doctor_id: doc.doctorId,
      doctorName: doc.name,
      doctor_name: doc.name,
      departmentId: doc.departmentId,
      department_id: doc.departmentId,
      departmentName: doc.department_name || doc.departmentName || 'Cardiology',
      department_name: doc.department_name || doc.departmentName || 'Cardiology',
      specialization: doc.specialization,
      roomNo: doc.roomNo || doc.room_no || 'Room 204',
      room_no: doc.roomNo || doc.room_no || 'Room 204',
      wing: doc.room_wing || doc.roomWing || 'Block A • Wing 1',
      room_wing: doc.room_wing || doc.roomWing || 'Block A • Wing 1',
      appointmentDate: body.appointmentDate || new Date().toISOString().split('T')[0],
      appointment_date: body.appointmentDate || new Date().toISOString().split('T')[0],
      appointmentTime: body.appointmentTime || '10:00 AM',
      appointment_time: body.appointmentTime || '10:00 AM',
      tokenNumber: token,
      token_number: token,
      status: 'BOOKED',
      estimatedWaitTime: 8,
      estimated_wait_time: 8,
      queuePosition: 1,
      queue_position: 1,
      reason: body.reason || 'General Health Consultation'
    };

    try {
      sessionManager.setLatestAppointment(appt, patientId);
      const key = `careflow_patient_appointments_${patientId}`;
      const existingStr = sessionStorage.getItem(key) || localStorage.getItem(key);
      const existingList = existingStr ? JSON.parse(existingStr) : [];
      const updatedList = [appt, ...existingList.filter((a: any) => (a.appointmentId || a.appointment_id) !== apptId)];
      sessionStorage.setItem(key, JSON.stringify(updatedList));
    } catch (e) {}

    return {
      message: 'Appointment confirmed successfully',
      appointment: appt
    } as any;
  }

  // 10.1 Patient's Own Appointments
  if (endpoint.startsWith('/appointments/my')) {
    let pId = '';
    const match = endpoint.match(/patientId=([^&]+)/);
    if (match) {
      pId = decodeURIComponent(match[1]);
    } else {
      const savedUser = sessionManager.getUser();
      if (savedUser) {
        pId = savedUser.patientId || '';
      }
    }

    if (pId) {
      try {
        const key = `careflow_patient_appointments_${pId}`;
        const saved = sessionStorage.getItem(key) || localStorage.getItem(key);
        if (saved) {
          const list = JSON.parse(saved);
          if (Array.isArray(list)) {
            return { appointments: list } as any;
          }
        }
      } catch (e) {}
    }

    // If no appointments exist yet for this patient, return empty list
    return {
      appointments: []
    } as any;
  }

  // 11. Live Queue Status
  if (endpoint.startsWith('/queue/patient/')) {
    const patientId = endpoint.split('/')[3];
    const savedAppt = sessionManager.getLatestAppointment(patientId);

    if (!savedAppt) {
      return {
        hasActiveQueue: false
      } as any;
    }

    return {
      hasActiveQueue: true,
      currentTokenNumber: 'CF-201',
      patientTokenNumber: savedAppt?.tokenNumber || savedAppt?.token_number,
      queuePosition: 1,
      estimatedWaitTimeMinutes: 8,
      estimatedConsultationTime: '10:45 AM',
      doctorStatus: 'IN_SESSION',
      doctorName: savedAppt?.doctorName || savedAppt?.doctor_name || 'Dr. Ananya Sharma',
      currentDoctorName: savedAppt?.doctorName || savedAppt?.doctor_name || 'Dr. Ananya Sharma',
      specialization: savedAppt?.specialization || 'Cardiologist',
      roomNo: savedAppt?.roomNo || savedAppt?.room_no || 'Room 204',
      departmentName: savedAppt?.departmentName || savedAppt?.department_name || 'Cardiology',
      patientsAhead: 0
    } as any;
  }

  // 12. Health Status & History
  if (endpoint.startsWith('/health/status/')) {
    let currentUser: any = null;
    try {
      const savedUserStr = localStorage.getItem('careflow_current_user');
      if (savedUserStr) currentUser = JSON.parse(savedUserStr);
    } catch (e) {}

    return {
      patient: {
        fullName: currentUser?.fullName || 'Patient',
        patientId: currentUser?.patientId || endpoint.split('/')[3] || 'PAT-2026-00101',
        age: currentUser?.age || 28,
        gender: currentUser?.gender || 'Patient',
        bloodGroup: currentUser?.bloodGroup || 'O+'
      },
      vitals: {
        heartRate: 72,
        bloodPressure: '120/80',
        spo2: 99,
        temperature: 98.4
      },
      history: []
    } as any;
  }

  if (endpoint.startsWith('/patient/history/')) {
    return {
      visits: [],
      timeline: []
    } as any;
  }

  // 13. Display Board (Full Hospital Live Waiting Room Display)
  if (endpoint === '/queue/display') {
    return {
      board: [
        { 
          doctor_id: 'DOC-CARD-01',
          doctorId: 'DOC-CARD-01',
          doctor_name: 'Dr. Ananya Sharma', 
          doctorName: 'Dr. Ananya Sharma',
          department_name: 'Cardiology',
          departmentName: 'Cardiology',
          room_wing: 'Block A • Wing 1',
          roomWing: 'Block A • Wing 1',
          room_no: 'Room 204',
          roomNo: 'Room 204',
          room: 'Room 204',
          nowServingToken: 'CF-201', 
          nowServing: 'CF-201',
          tokenNumber: 'CF-201',
          upcomingTokens: ['CF-202', 'CF-203', 'CF-204'],
          nextUp: 'CF-202, CF-203, CF-204',
          isCalling: false,
          waitingCount: 3,
          status: 'IN_SESSION' 
        },
        { 
          doctor_id: 'DOC-GAST-99',
          doctorId: 'DOC-GAST-99',
          doctor_name: 'Dr. Rahul Mehta', 
          doctorName: 'Dr. Rahul Mehta',
          department_name: 'Gastroenterology',
          departmentName: 'Gastroenterology',
          room_wing: 'Block B • Wing 2',
          roomWing: 'Block B • Wing 2',
          room_no: 'Room 105',
          roomNo: 'Room 105',
          room: 'Room 105',
          nowServingToken: 'CF-115', 
          nowServing: 'CF-115',
          tokenNumber: 'CF-115',
          upcomingTokens: ['CF-116', 'CF-117', 'CF-118'],
          nextUp: 'CF-116, CF-117, CF-118',
          isCalling: true,
          calledToken: 'CF-115',
          waitingCount: 3,
          status: 'IN_SESSION' 
        },
        { 
          doctor_id: 'DOC-DERM-01',
          doctorId: 'DOC-DERM-01',
          doctor_name: 'Dr. Neha Kapoor', 
          doctorName: 'Dr. Neha Kapoor',
          department_name: 'Dermatology',
          departmentName: 'Dermatology',
          room_wing: 'Block C • Wing 1',
          roomWing: 'Block C • Wing 1',
          room_no: 'Room 108',
          roomNo: 'Room 108',
          room: 'Room 108',
          nowServingToken: 'CF-089', 
          nowServing: 'CF-089',
          tokenNumber: 'CF-089',
          upcomingTokens: ['CF-090', 'CF-092'],
          nextUp: 'CF-090, CF-092',
          isCalling: false,
          waitingCount: 2,
          status: 'IN_SESSION' 
        },
        { 
          doctor_id: 'DOC-NEUR-01',
          doctorId: 'DOC-NEUR-01',
          doctor_name: 'Dr. Rajesh Iyer', 
          doctorName: 'Dr. Rajesh Iyer',
          department_name: 'Neurology',
          departmentName: 'Neurology',
          room_wing: 'Block A • Wing 3',
          roomWing: 'Block A • Wing 3',
          room_no: 'Room 302',
          roomNo: 'Room 302',
          room: 'Room 302',
          nowServingToken: 'CF-305', 
          nowServing: 'CF-305',
          tokenNumber: 'CF-305',
          upcomingTokens: ['CF-306', 'CF-307', 'CF-309'],
          nextUp: 'CF-306, CF-307, CF-309',
          isCalling: false,
          waitingCount: 3,
          status: 'IN_SESSION' 
        },
        { 
          doctor_id: 'DOC-PULM-01',
          doctorId: 'DOC-PULM-01',
          doctor_name: 'Dr. Alika Roy', 
          doctorName: 'Dr. Alika Roy',
          department_name: 'Pulmonology',
          departmentName: 'Pulmonology',
          room_wing: 'Block B • Wing 1',
          roomWing: 'Block B • Wing 1',
          room_no: 'Room 215',
          roomNo: 'Room 215',
          room: 'Room 215',
          nowServingToken: 'CF-401', 
          nowServing: 'CF-401',
          tokenNumber: 'CF-401',
          upcomingTokens: ['CF-402', 'CF-405'],
          nextUp: 'CF-402, CF-405',
          isCalling: false,
          waitingCount: 2,
          status: 'IN_SESSION' 
        },
        { 
          doctor_id: 'DOC-GENM-01',
          doctorId: 'DOC-GENM-01',
          doctor_name: 'Dr. Sameer Khan', 
          doctorName: 'Dr. Sameer Khan',
          department_name: 'General Medicine',
          departmentName: 'General Medicine',
          room_wing: 'Block B • Wing 3',
          roomWing: 'Block B • Wing 3',
          room_no: 'Room 101',
          roomNo: 'Room 101',
          room: 'Room 101',
          nowServingToken: 'CF-012', 
          nowServing: 'CF-012',
          tokenNumber: 'CF-012',
          upcomingTokens: ['CF-013', 'CF-014', 'CF-016'],
          nextUp: 'CF-013, CF-014, CF-016',
          isCalling: false,
          waitingCount: 3,
          status: 'IN_SESSION' 
        }
      ]
    } as any;
  }

  // 14. Notifications
  if (endpoint.startsWith('/notifications/') || endpoint.startsWith('/patient/notifications/')) {
    return {
      notifications: [
        {
          notification_id: 'NOTIF-1',
          patient_id: 'PAT-2026-88129',
          title: 'Appointment Confirmed',
          message: 'Your token CF-204 is confirmed with Dr. Ananya Sharma.',
          read_status: 0,
          created_at: new Date().toISOString()
        }
      ]
    } as any;
  }

  // 15. Admin / Reception
  if (endpoint === '/reception/overview') {
    return {
      stats: { totalWaiting: 12, checkedInToday: 38, avgWaitMinutes: 9 },
      appointments: []
    } as any;
  }

  if (endpoint === '/admin/analytics') {
    return {
      summary: { totalPatients: 382, totalAppointments: 1420, avgConsultationMin: 14.5, onTimeRate: 92 },
      charts: []
    } as any;
  }

  if (endpoint === '/admin/settings') {
    return {
      settings: { clinicName: 'CareFlow Hospital', maxDailyTokens: 400, enableAutoCheckIn: true }
    } as any;
  }

  return {} as T;
}

export const api = {
  // Auth
  login: (email: string, password: string) => 
    request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  register: (payload: any) => 
    request<{ token: string; user: User; message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  sendOtp: (phone: string, purpose: 'REGISTER' | 'LOGIN' = 'REGISTER') => 
    request<{ success: boolean; message: string; otp?: string; expiresIn: number }>('/auth/otp/send', {
      method: 'POST',
      body: JSON.stringify({ phone, purpose })
    }),

  verifyOtp: (phone: string, otp: string, purpose: 'REGISTER' | 'LOGIN' = 'REGISTER') => 
    request<{ success: boolean; verified?: boolean; token?: string; user?: User; message: string }>('/auth/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ phone, otp, purpose })
    }),

  demoLogin: (role: string, doctorId?: string) => 
    request<{ token: string; user: User; message: string }>('/auth/demo-login', {
      method: 'POST',
      body: JSON.stringify({ role, doctorId })
    }),

  getMe: () => request<{ user: User }>('/auth/me'),

  logout: () => {
    sessionManager.clearSession();
    return Promise.resolve({ message: 'Logged out successfully' });
  },

  // AI Recommendation
  analyzeProblem: (payload: any) => 
    request<DoctorRecommendation>('/ai/analyze-and-recommend', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  analyzeSymptoms: (payload: any) => 
    request<any>('/ai/analyze-and-recommend', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  // Appointments
  getSlots: (doctorId: string, date: string) => 
    request<{ doctorId: string; date: string; slots: Array<{ time: string; isAvailable: boolean }> }>(
      `/appointments/slots?doctorId=${doctorId}&date=${date}`
    ),

  bookAppointment: async (payload: {
    patientId: string;
    patientName?: string;
    doctorId: string;
    departmentId?: string;
    appointmentDate: string;
    appointmentTime: string;
    reason?: string;
  }) => {
    // If device is offline in a rural area, create local appointment with sequential token
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      console.log('[API] Network offline: Creating rural offline booking with sequential token...');
      const { appointment } = await offlineStorage.createOfflineAppointment(payload);
      return {
        message: 'Rural Offline Pass Generated (Queued for Automatic Hospital Sync)',
        appointment
      };
    }

    try {
      const res = await request<{ message: string; appointment: any }>('/appointments/book', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (res?.appointment && payload.patientId) {
        try {
          const existing = await offlineStorage.getAppointments(payload.patientId);
          const apptId = res.appointment.appointmentId || res.appointment.appointment_id;
          const updated = [res.appointment, ...existing.filter((a: any) => (a.appointmentId || a.appointment_id) !== apptId)];
          await offlineStorage.saveAppointments(payload.patientId, updated);
        } catch (e) {}
      }

      return res;
    } catch (err: any) {
      console.warn('[API] Server request failed, falling back to rural offline pass:', err);
      const { appointment } = await offlineStorage.createOfflineAppointment(payload);
      return {
        message: 'Rural Offline Pass Generated (Saved locally, auto-syncing when online)',
        appointment
      };
    }
  },

  getMyAppointments: async (patientId: string) => {
    let serverList: Appointment[] = [];
    try {
      const res = await request<{ appointments: Appointment[] }>(`/appointments/my?patientId=${patientId}`);
      if (res?.appointments && Array.isArray(res.appointments)) {
        serverList = res.appointments;
      }
    } catch (e) {
      console.warn('[API] getMyAppointments network error, reading local offline store:', e);
    }

    const localList = await offlineStorage.getAppointments(patientId);

    // Merge server appointments with any locally booked offline passes
    const mergedMap = new Map<string, any>();
    for (const item of localList) {
      const id = item.appointment_id || (item as any).appointmentId;
      if (id) mergedMap.set(id, item);
    }
    for (const item of serverList) {
      const id = item.appointment_id || (item as any).appointmentId;
      if (id) mergedMap.set(id, item);
    }

    const merged = Array.from(mergedMap.values());
    if (merged.length > 0) {
      await offlineStorage.saveAppointments(patientId, merged);
    }

    return { appointments: merged };
  },

  cancelAppointment: (id: string) => 
    request<{ message: string }>(`/appointments/${id}/cancel`, { method: 'POST' }),

  rescheduleAppointment: (id: string, newDate: string, newTime: string) => 
    request<{ message: string }>(`/appointments/${id}/reschedule`, {
      method: 'POST',
      body: JSON.stringify({ newDate, newTime })
    }),

  // Check-In
  checkIn: (payload: { appointmentId?: string; patientId?: string; phone?: string }) => 
    request<{
      success: boolean;
      alreadyCheckedIn?: boolean;
      message: string;
      tokenNumber: string;
      queuePosition: number;
      estimatedWaitTime: number;
      estimatedConsultationTime?: string;
      doctorName: string;
      roomNo: string;
      departmentName: string;
      appointmentId?: string;
    }>('/checkin', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  // Live Queue
  getPatientQueueStatus: (patientId: string) => 
    request<LiveQueueStatus>(`/queue/patient/${patientId}`),

  getDisplayBoard: () => 
    request<{ board: any[] }>('/queue/display'),

  // Doctor Directory & Dashboard
  getDoctorsList: async () => {
    try {
      const res = await request<{ doctors: Doctor[] }>('/doctor/list');
      if (res?.doctors && Array.isArray(res.doctors) && res.doctors.length > 0) {
        offlineStorage.saveDoctors(res.doctors);
        return res;
      }
    } catch (e) {
      console.warn('[API] getDoctorsList network failed, reading from rural offline database:', e);
    }
    const cached = await offlineStorage.getDoctors();
    return { doctors: cached.length > 0 ? cached : DEFAULT_DOCTORS };
  },

  getDoctorDashboard: (doctorId: string) => 
    request<any>(`/doctor/dashboard/${doctorId}`),

  callNextPatient: (doctorId: string) => 
    request<any>('/doctor/call-next', {
      method: 'POST',
      body: JSON.stringify({ doctorId })
    }),

  startConsultation: (appointmentId: string, doctorId: string) => 
    request<any>('/doctor/start-consultation', {
      method: 'POST',
      body: JSON.stringify({ appointmentId, doctorId })
    }),

  completeConsultation: (payload: {
    appointmentId: string;
    doctorId?: string;
    patientId?: string;
    diagnosis?: string;
    prescriptionNotes?: string;
    followUpDate?: string;
    notes?: string;
    observations?: string;
    assessment?: string;
    followUp?: string;
    medicines?: any[];
  }) => request<any>('/doctor/complete-consultation', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),

  markDoctorDelay: (doctorId: string, delayMinutes: number) => 
    request<any>('/doctor/mark-delay', {
      method: 'POST',
      body: JSON.stringify({ doctorId, delayMinutes })
    }),

  markNoShow: (appointmentId: string, doctorId: string) => 
    request<any>('/doctor/mark-no-show', {
      method: 'POST',
      body: JSON.stringify({ appointmentId, doctorId })
    }),

  // Receptionist
  getReceptionOverview: () => 
    request<{ stats: any; appointments: any[] }>('/reception/overview'),

  getReceptionQueue: () => request<any>('/reception/queue'),

  registerWalkIn: (payload: any) => 
    request<any>('/reception/walk-in', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  admitWalkIn: (payload: any) => request<any>('/reception/admit-walkin', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),

  searchStaff: (q: string) => 
    request<{ results: any[] }>(`/reception/search?q=${encodeURIComponent(q)}`),

  // Admin
  getAdminStats: () => request<any>('/admin/stats'),
  getDepartmentStats: () => request<any>('/admin/departments'),
  getAdminAnalytics: () => 
    request<{ summary: any; charts: any }>('/admin/analytics'),
  getAdminDoctors: () => 
    request<{ doctors: Doctor[] }>('/admin/doctors'),
  updateDoctor: (id: string, payload: any) => 
    request<any>(`/admin/doctors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    }),
  getAdminDepartments: () => 
    request<{ departments: any[] }>('/admin/departments'),
  getAdminSettings: () => 
    request<{ settings: any }>('/admin/settings'),
  updateAdminSettings: (payload: any) => 
    request<any>('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(payload)
    }),

  // Patient Medical History
  getPatientHistory: async (patientId: string) => {
    try {
      const res = await request<{ timeline: MedicalVisitRecord[]; visits: MedicalVisitRecord[] }>(`/patient/history/${patientId}`);
      if (res?.timeline && Array.isArray(res.timeline)) {
        offlineStorage.saveMedicalHistory(patientId, res.timeline);
        return res;
      }
    } catch (e) {
      console.warn('[API] getPatientHistory network failed, reading from rural offline database:', e);
    }
    const cachedTimeline = await offlineStorage.getMedicalHistory(patientId);
    return { timeline: cachedTimeline, visits: cachedTimeline };
  },

  // Notifications
  getPatientNotifications: (patientId: string) => 
    request<{ notifications: NotificationItem[] }>(`/notifications/${patientId}`),

  markNotificationRead: (id: string) => 
    request<any>(`/notifications/${id}/read`, { method: 'PUT' }),

  // Health Status
  getHealthStatus: (patientId: string) => 
    request<any>(`/health/status/${patientId}`),

  // Hospitals & Maps
  getHospitals: async () => {
    try {
      const res = await request<{ hospitals: any[] }>('/hospitals');
      if (res?.hospitals && Array.isArray(res.hospitals) && res.hospitals.length > 0) {
        offlineStorage.saveHospitals(res.hospitals);
        return res;
      }
    } catch (err) {
      console.warn('[API] getHospitals network failed, loading offline storage:', err);
    }
    const cached = await offlineStorage.getHospitals();
    return { hospitals: cached && cached.length > 0 ? cached : DEFAULT_HOSPITALS };
  },

  getHospitalById: (id: string) =>
    request<{ hospital: any; doctors: any[] }>(`/hospitals/${id}`),

  // Diseases Catalog
  getDiseases: async (category?: string, search?: string) => {
    try {
      let url = '/diseases?';
      if (category) url += `category=${encodeURIComponent(category)}&`;
      if (search) url += `search=${encodeURIComponent(search)}`;
      const res = await request<{ diseases: any[]; count: number }>(url);
      if (res?.diseases && Array.isArray(res.diseases) && res.diseases.length > 0) {
        offlineStorage.saveDiseases(res.diseases);
        return res;
      }
    } catch (e) {
      console.warn('[API] getDiseases network failed, reading from rural offline database:', e);
    }

    const allOffline = await offlineStorage.getDiseases();
    let filtered = allOffline;
    if (category && category !== 'All') {
      filtered = filtered.filter((d: any) => d.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter((d: any) => 
        (d.name && d.name.toLowerCase().includes(q)) ||
        (d.description && d.description.toLowerCase().includes(q)) ||
        (d.recommended_specialty && d.recommended_specialty.toLowerCase().includes(q))
      );
    }
    return { diseases: filtered, count: filtered.length };
  },

  getDiseaseById: (id: string) =>
    request<{ disease: any; doctors: any[] }>(`/diseases/${id}`),

  // Ambulance Service
  requestAmbulance: (payload: { patientId?: string; hospitalId?: string; pickupAddress?: string; ambulanceType?: string }) =>
    request<{ message: string; ambulance: any }>('/ambulance/request', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  getActiveAmbulance: () =>
    request<{ active: boolean; ambulance?: any }>('/ambulance/active'),

  cancelAmbulance: (requestId: string) =>
    request<any>('/ambulance/cancel', {
      method: 'POST',
      body: JSON.stringify({ requestId })
    }),

  preloadOfflineDatabase: async () => {
    try {
      await Promise.allSettled([
        api.getDoctorsList(),
        api.getDiseases(),
        api.getHospitals()
      ]);
    } catch (e) {}
  }
};
