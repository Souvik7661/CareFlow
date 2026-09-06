import crypto from 'node:crypto';
import { db, queryOne, execute, transaction } from './database.ts';

export function hashPassword(password: string): string {
  const salt = 'careflow_secure_salt_2026';
  return crypto.createHash('sha256').update(password + salt).digest('hex');
}

export function seedDatabase() {
  console.log('[SEED] Checking database state & syncing 10 distinct doctors...');

  // Ensure tables exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS hospitals (
      hospital_id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      distance_km REAL DEFAULT 2.4,
      rating REAL DEFAULT 4.8,
      total_reviews INTEGER DEFAULT 320,
      is_open_247 INTEGER DEFAULT 1,
      emergency_phone TEXT NOT NULL,
      google_maps_url TEXT NOT NULL,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS diseases (
      disease_id TEXT PRIMARY KEY,
      number INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      recommended_specialty TEXT NOT NULL,
      urgency TEXT DEFAULT 'Routine' CHECK (urgency IN ('Routine', 'Urgent', 'Emergency')),
      requires_ambulance INTEGER DEFAULT 0,
      icon_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS ambulance_requests (
      request_id TEXT PRIMARY KEY,
      patient_id TEXT,
      hospital_id TEXT NOT NULL,
      pickup_address TEXT NOT NULL,
      pickup_lat REAL NOT NULL,
      pickup_lng REAL NOT NULL,
      ambulance_type TEXT NOT NULL CHECK (ambulance_type IN ('Basic', 'Advanced', 'ICU')),
      eta_minutes INTEGER DEFAULT 8,
      status TEXT NOT NULL DEFAULT 'DISPATCHED' CHECK (status IN ('DISPATCHED', 'EN_ROUTE', 'ARRIVED', 'COMPLETED', 'CANCELLED')),
      driver_name TEXT NOT NULL,
      driver_phone TEXT NOT NULL,
      vehicle_number TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (hospital_id) REFERENCES hospitals(hospital_id)
    );
  `);

  try {
    execute('ALTER TABLE doctors ADD COLUMN hospital_id TEXT');
  } catch (e) {}
  try {
    execute('ALTER TABLE doctors ADD COLUMN total_reviews INTEGER DEFAULT 320');
  } catch (e) {}
  try {
    execute('ALTER TABLE doctors ADD COLUMN why_this_doctor TEXT');
  } catch (e) {}

  // 1. Seed / Update 4 Hospitals with Real Coordinates & Distances
  const hospitals = [
    {
      id: 'HOSP-01',
      name: 'City Hospital',
      address: '123, MG Road, Central District',
      city: 'Kolkata',
      lat: 22.5726,
      lng: 88.3639,
      dist: 2.4,
      rating: 4.8,
      reviews: 320,
      isOpen247: 1,
      phone: '+91 33 2211 4400',
      mapsUrl: 'https://maps.google.com/?q=22.5726,88.3639'
    },
    {
      id: 'HOSP-02',
      name: 'Sunrise Hospital',
      address: '45, Park Avenue, North Wing',
      city: 'Kolkata',
      lat: 22.5512,
      lng: 88.3524,
      dist: 3.1,
      rating: 4.7,
      reviews: 285,
      isOpen247: 1,
      phone: '+91 33 2288 5500',
      mapsUrl: 'https://maps.google.com/?q=22.5512,88.3524'
    },
    {
      id: 'HOSP-03',
      name: 'Medicare Multi-Specialty Hospital',
      address: '78, Outer Ring Road, East Sector',
      city: 'Kolkata',
      lat: 22.5890,
      lng: 88.4012,
      dist: 5.0,
      rating: 4.6,
      reviews: 190,
      isOpen247: 1,
      phone: '+91 33 2344 6600',
      mapsUrl: 'https://maps.google.com/?q=22.5890,88.4012'
    },
    {
      id: 'HOSP-04',
      name: 'HealthPlus Hospital',
      address: '12, Sector 4, Tech Park Boulevard',
      city: 'Kolkata',
      lat: 22.5697,
      lng: 88.4325,
      dist: 6.2,
      rating: 4.5,
      reviews: 145,
      isOpen247: 1,
      phone: '+91 33 2455 7700',
      mapsUrl: 'https://maps.google.com/?q=22.5697,88.4325'
    },
    {
      id: 'HOSP-05',
      name: 'Apollo Apex Multispeciality Hospital',
      address: '58, Canal Circular Road, EM Bypass',
      city: 'Kolkata',
      lat: 22.5658,
      lng: 88.3980,
      dist: 4.2,
      rating: 4.9,
      reviews: 490,
      isOpen247: 1,
      phone: '+91 33 2320 3040',
      mapsUrl: 'https://maps.google.com/?q=22.5658,88.3980'
    }
  ];

  for (const h of hospitals) {
    execute(`
      INSERT OR REPLACE INTO hospitals (hospital_id, name, address, city, latitude, longitude, distance_km, rating, total_reviews, is_open_247, emergency_phone, google_maps_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [h.id, h.name, h.address, h.city, h.lat, h.lng, h.dist, h.rating, h.reviews, h.isOpen247, h.phone, h.mapsUrl]);
  }

  // 2. Ensure standard departments exist including ENT and Gastroenterology
  const standardDepts = [
    { id: 'DEP-CARD', name: 'Cardiology', specialty: 'Cardiology', desc: 'Heart & Vascular Clinic', wing: 'Block A, 2nd Floor' },
    { id: 'DEP-GAST', name: 'Gastroenterology', specialty: 'Gastroenterology', desc: 'Digestive & Liver Center', wing: 'Block B, 1st Floor' },
    { id: 'DEP-DERM', name: 'Dermatology', specialty: 'Dermatology', desc: 'Skin & Allergy Clinic', wing: 'Block C, Ground Floor' },
    { id: 'DEP-NEUR', name: 'Neurology', specialty: 'Neurology', desc: 'Brain & Nervous System', wing: 'Block A, 3rd Floor' },
    { id: 'DEP-PULM', name: 'Pulmonology', specialty: 'Pulmonology', desc: 'Respiratory Medicine', wing: 'Block B, 2nd Floor' },
    { id: 'DEP-ORTH', name: 'Orthopedics', specialty: 'Orthopedics', desc: 'Bone & Joint Clinic', wing: 'Block C, 1st Floor' },
    { id: 'DEP-GENM', name: 'General Medicine', specialty: 'General Medicine', desc: 'Internal & Preventative Medicine', wing: 'Block B, Ground Floor' },
    { id: 'DEP-ENT',  name: 'ENT & Otolaryngology', specialty: 'ENT', desc: 'Ear, Nose & Throat Center', wing: 'Block A, Ground Floor' },
    { id: 'DEP-PEDI', name: 'Pediatrics', specialty: 'Pediatrics', desc: 'Child & Neonatal Health', wing: 'Block D, 1st Floor' },
    { id: 'DEP-EMER', name: 'Emergency Medicine', specialty: 'Emergency', desc: '24/7 Trauma & Critical Care', wing: 'Trauma Wing' },
    { id: 'DEP-ONCO', name: 'Medical Oncology & Cancer Center', specialty: 'Medical Oncology', desc: 'Comprehensive Cancer & Chemotherapy Institute', wing: 'Block D, 2nd Floor' },
    { id: 'DEP-ENDO', name: 'Endocrinology & Diabetology', specialty: 'Endocrinology', desc: 'Diabetes, Thyroid & Metabolic Wellness', wing: 'Block C, 2nd Floor' },
    { id: 'DEP-NEPH', name: 'Nephrology & Renal Care', specialty: 'Nephrology', desc: 'Kidney Health, Dialysis & Renal Stones Clinic', wing: 'Block A, 1st Floor' }
  ];

  for (const d of standardDepts) {
    execute(`
      INSERT OR REPLACE INTO departments (department_id, name, specialty, description, room_wing)
      VALUES (?, ?, ?, ?, ?)
    `, [d.id, d.name, d.specialty, d.desc, d.wing]);
  }

  // 3. Seed / Update 10 DISTINCT DOCTORS FOR 10 DISTINCT DISEASE AREAS
  const tenDoctors = [
    // 1. Gastritis / Acid Reflux / GERD -> Dr. Rahul Mehta (From Blueprint Screen 3 & 5)
    {
      docId: 'DOC-GAST-99',
      userId: 'USR-DOC-99',
      email: 'doctor.mehta.gastro@careflow.com',
      name: 'Dr. Rahul Mehta',
      specialization: 'Gastroenterologist',
      deptId: 'DEP-GAST',
      hospId: 'HOSP-01', // City Hospital, 2.4 km
      qualification: 'MD, DM (Gastroenterology), 12+ years experience',
      experience: 12,
      phone: '+91 98300 44221',
      room: 'Room 105',
      rating: 4.8,
      reviews: 320,
      fee: 700,
      avgTime: 15,
      why: 'Specialized in stomach, liver and digestive disorders (Gastritis, Acid Reflux, GERD, Colic).'
    },
    // 2. Chest Pain / Heart Disease / Hypertension -> Dr. Ananya Sharma
    {
      docId: 'DOC-CARD-01',
      userId: 'USR-DOC-01',
      email: 'doctor.sharma@careflow.com',
      name: 'Dr. Ananya Sharma',
      specialization: 'Cardiologist',
      deptId: 'DEP-CARD',
      hospId: 'HOSP-01', // City Hospital, 2.4 km
      qualification: 'MD, DM (Cardiology), AIIMS Gold Medalist, 14+ years experience',
      experience: 14,
      phone: '+91 98300 11001',
      room: 'Room 204',
      rating: 4.9,
      reviews: 410,
      fee: 800,
      avgTime: 15,
      why: 'Specialized in hypertension, chest discomfort, arrhythmias, and comprehensive cardiovascular health.'
    },
    // 3. Acne / Skin Rash / Eczema -> Dr. Neha Kapoor (From Blueprint Screen 4)
    {
      docId: 'DOC-DERM-01',
      userId: 'USR-DOC-03',
      email: 'doctor.kapoor@careflow.com',
      name: 'Dr. Neha Kapoor',
      specialization: 'Dermatologist',
      deptId: 'DEP-DERM',
      hospId: 'HOSP-02', // Sunrise Hospital, 3.1 km
      qualification: 'MD, DVD (Dermatology), 10+ years experience',
      experience: 10,
      phone: '+91 98300 11003',
      room: 'Room 108',
      rating: 4.7,
      reviews: 295,
      fee: 600,
      avgTime: 15,
      why: 'Specialized in skin rashes, acne vulgaris, eczema, dermatitis, and allergic skin conditions.'
    },
    // 4. Liver Disease / Jaundice -> Dr. Arjun Verma (From Blueprint Screen 4)
    {
      docId: 'DOC-GAST-98',
      userId: 'USR-DOC-98',
      email: 'doctor.arjun@careflow.com',
      name: 'Dr. Arjun Verma',
      specialization: 'Hepatologist & Gastroenterologist',
      deptId: 'DEP-GAST',
      hospId: 'HOSP-03', // Medicare Hospital, 5.0 km
      qualification: 'MBBS, MD, DNB (Gastroenterology), 9+ years experience',
      experience: 9,
      phone: '+91 98300 55332',
      room: 'Room 210',
      rating: 4.6,
      reviews: 180,
      fee: 650,
      avgTime: 15,
      why: 'Specialized in liver inflammation, fatty liver, viral hepatitis, and jaundice recovery.'
    },
    // 5. Gallstones / Digestion -> Dr. Pooja Shah (From Blueprint Screen 4)
    {
      docId: 'DOC-GAST-97',
      userId: 'USR-DOC-97',
      email: 'doctor.pooja.shah@careflow.com',
      name: 'Dr. Pooja Shah',
      specialization: 'Gastroenterologist',
      deptId: 'DEP-GAST',
      hospId: 'HOSP-04', // HealthPlus Hospital, 6.2 km
      qualification: 'MD (Internal Medicine), Fellowship in Hepatology, 8+ years experience',
      experience: 8,
      phone: '+91 98300 66443',
      room: 'Room 118',
      rating: 4.5,
      reviews: 140,
      fee: 600,
      avgTime: 15,
      why: 'Specialized in gallstone colic, chronic constipation, irritable bowel syndrome, and digestive care.'
    },
    // 6. Migraine / Headache / Stroke / Epilepsy -> Dr. Rajesh Iyer
    {
      docId: 'DOC-NEUR-01',
      userId: 'USR-DOC-05',
      email: 'doctor.iyer@careflow.com',
      name: 'Dr. Rajesh Iyer',
      specialization: 'Neurologist',
      deptId: 'DEP-NEUR',
      hospId: 'HOSP-02', // Sunrise Hospital, 3.1 km
      qualification: 'DM (Neurology), NIMHANS Fellow, 16+ years experience',
      experience: 16,
      phone: '+91 98300 11005',
      room: 'Room 302',
      rating: 4.9,
      reviews: 380,
      fee: 900,
      avgTime: 20,
      why: 'Specialized in migraines, tension headaches, vertigo, epilepsy seizures, and stroke management.'
    },
    // 7. Asthma / Bronchitis / Cough / Pneumonia -> Dr. Alika Roy
    {
      docId: 'DOC-PULM-01',
      userId: 'USR-DOC-07',
      email: 'doctor.alika@careflow.com',
      name: 'Dr. Alika Roy',
      specialization: 'Pulmonologist',
      deptId: 'DEP-PULM',
      hospId: 'HOSP-03', // Medicare Hospital, 5.0 km
      qualification: 'MD (Pulmonary Medicine), FCCP, 11+ years experience',
      experience: 11,
      phone: '+91 98300 11007',
      room: 'Room 215',
      rating: 4.8,
      reviews: 260,
      fee: 750,
      avgTime: 15,
      why: 'Specialized in chronic bronchial asthma, wheezing, lung infections, cough, and pneumonia care.'
    },
    // 8. Arthritis / Back Pain / Neck Pain -> Dr. Vikram Deshmukh
    {
      docId: 'DOC-ORTH-01',
      userId: 'USR-DOC-09',
      email: 'doctor.deshmukh@careflow.com',
      name: 'Dr. Vikram Deshmukh',
      specialization: 'Orthopedic Surgeon',
      deptId: 'DEP-ORTH',
      hospId: 'HOSP-02', // Sunrise Hospital, 3.1 km
      qualification: 'MS (Orthopedics), Joint Replacement Fellow, 15+ years experience',
      experience: 15,
      phone: '+91 98300 11009',
      room: 'Room 112',
      rating: 4.8,
      reviews: 340,
      fee: 700,
      avgTime: 15,
      why: 'Specialized in osteoarthritis, lumbar back ache, cervical neck stiffness, and bone disorders.'
    },
    // 9. Common Cold / Flu / Fever / Food Poisoning -> Dr. Sameer Khan
    {
      docId: 'DOC-GENM-01',
      userId: 'USR-DOC-11',
      email: 'doctor.khan@careflow.com',
      name: 'Dr. Sameer Khan',
      specialization: 'General Physician',
      deptId: 'DEP-GENM',
      hospId: 'HOSP-01', // City Hospital, 2.4 km
      qualification: 'MD (Internal Medicine), 13+ years experience',
      experience: 13,
      phone: '+91 98300 11011',
      room: 'Room 101',
      rating: 4.7,
      reviews: 420,
      fee: 500,
      avgTime: 15,
      why: 'Specialized in viral fevers, influenza, seasonal flu, food poisoning, and adult preventive care.'
    },
    // 10. Tonsillitis / Sinusitis / Sore Throat / Ear Infection -> Dr. Kavita Verma
    {
      docId: 'DOC-ENT-01',
      userId: 'USR-DOC-10',
      email: 'doctor.kavita@careflow.com',
      name: 'Dr. Kavita Verma',
      specialization: 'ENT Specialist',
      deptId: 'DEP-ENT',
      hospId: 'HOSP-04', // HealthPlus Hospital, 6.2 km
      qualification: 'MS (ENT), DLO, 10+ years experience',
      experience: 10,
      phone: '+91 98300 11010',
      room: 'Room 109',
      rating: 4.7,
      reviews: 210,
      fee: 600,
      avgTime: 15,
      why: 'Specialized in sinusitis, swollen tonsils, throat pain, voice hoarseness, and ear ailments.'
    },
    // 11. Oncology / Cancer Care / Tumors -> Dr. Priya Mukherjee
    {
      docId: 'DOC-ONCO-01',
      userId: 'USR-DOC-12',
      email: 'doctor.priya.onco@careflow.com',
      name: 'Dr. Priya Mukherjee',
      specialization: 'Medical Oncologist',
      deptId: 'DEP-ONCO',
      hospId: 'HOSP-05', // Apollo Apex Multispeciality Hospital, 4.2 km
      qualification: 'MBBS, MD (Medicine), DM (Medical Oncology - AIIMS), ESMO Fellow, 14+ years experience',
      experience: 14,
      phone: '+91 98300 77112',
      room: 'Room 401',
      rating: 4.9,
      reviews: 340,
      fee: 900,
      avgTime: 20,
      why: 'Specialized in cancer diagnosis, early tumor screening, chemotherapy, immunotherapy, and holistic oncological care.'
    },
    // 12. Diabetes / Thyroid / Metabolism / PCOS -> Dr. Amitav Ghosh
    {
      docId: 'DOC-ENDO-01',
      userId: 'USR-DOC-13',
      email: 'doctor.ghosh.endo@careflow.com',
      name: 'Dr. Amitav Ghosh',
      specialization: 'Endocrinologist & Diabetologist',
      deptId: 'DEP-ENDO',
      hospId: 'HOSP-05', // Apollo Apex Multispeciality Hospital, 4.2 km
      qualification: 'MD (Internal Medicine), DM (Endocrinology - PGI), FACE (USA), 15+ years experience',
      experience: 15,
      phone: '+91 98300 88223',
      room: 'Room 305',
      rating: 4.8,
      reviews: 385,
      fee: 750,
      avgTime: 15,
      why: 'Specialized in Type 1 & Type 2 diabetes management, diabetic neuropathy, thyroid disorders, and metabolic obesity.'
    },
    // 13. Kidney Stones / UTI / Renal Health -> Dr. Sneha Roy
    {
      docId: 'DOC-NEPH-01',
      userId: 'USR-DOC-14',
      email: 'doctor.sneha.nephro@careflow.com',
      name: 'Dr. Sneha Roy',
      specialization: 'Nephrologist',
      deptId: 'DEP-NEPH',
      hospId: 'HOSP-03', // Medicare Multi-Specialty Hospital, 5.0 km
      qualification: 'MBBS, MD (General Medicine), DM (Nephrology), FISN Fellow, 12+ years experience',
      experience: 12,
      phone: '+91 98300 99334',
      room: 'Room 208',
      rating: 4.8,
      reviews: 270,
      fee: 700,
      avgTime: 15,
      why: 'Specialized in acute and chronic kidney disease (CKD), kidney stone management, painful urination, and renal care.'
    }
  ];

  const defaultPass = hashPassword('password123');

  for (const doc of tenDoctors) {
    // 1. Ensure User account exists
    execute(`
      INSERT OR REPLACE INTO users (id, email, password_hash, role, full_name)
      VALUES (?, ?, ?, 'DOCTOR', ?)
    `, [doc.userId, doc.email, defaultPass, doc.name]);

    // 2. Ensure Doctor record exists with ALL fields including hospital_id and why_this_doctor
    execute(`
      INSERT OR REPLACE INTO doctors (
        doctor_id, user_id, hospital_id, name, specialization, department_id, qualification,
        experience, phone, email, status, room_no, rating, total_reviews, consultation_fee,
        avg_consultation_time, why_this_doctor
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'AVAILABLE', ?, ?, ?, ?, ?, ?)
    `, [
      doc.docId,
      doc.userId,
      doc.hospId,
      doc.name,
      doc.specialization,
      doc.deptId,
      doc.qualification,
      doc.experience,
      doc.phone,
      doc.email,
      doc.room,
      doc.rating,
      doc.reviews,
      doc.fee,
      doc.avgTime,
      doc.why
    ]);

    // 3. Ensure full Monday - Saturday schedule
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    for (const day of days) {
      execute(`
        INSERT OR REPLACE INTO doctor_availability (availability_id, doctor_id, day_of_week, start_time, end_time, is_available)
        VALUES (?, ?, ?, '09:00 AM', '05:00 PM', 1)
      `, [`AVL-${doc.docId}-${day.slice(0, 3).toUpperCase()}`, doc.docId, day]);
    }
  }

  // 4. Seed / Ensure 50 Curated Diseases are stored in the database
  const diseasesData = [
    { num: 1, name: 'Common Cold', desc: 'Runny nose, sneezing, sore throat, mild congestion', cat: 'Respiratory', spec: 'General Physician', urg: 'Routine', amb: 0, icon: 'Thermometer' },
    { num: 2, name: 'Flu (Influenza)', desc: 'Fever, body ache, chills, fatigue, persistent headache', cat: 'Respiratory', spec: 'General Physician', urg: 'Routine', amb: 0, icon: 'Activity' },
    { num: 3, name: 'Fever', desc: 'High body temperature with or without chills', cat: 'General', spec: 'General Physician', urg: 'Routine', amb: 0, icon: 'Thermometer' },
    { num: 4, name: 'Headache / Migraine', desc: 'Throbbing head pain, migraine, tension, or sinus-related pressure', cat: 'Neurology', spec: 'Neurologist', urg: 'Routine', amb: 0, icon: 'Brain' },
    { num: 5, name: 'Sore Throat', desc: 'Throat pain, redness, irritation, difficulty swallowing', cat: 'ENT', spec: 'ENT Specialist', urg: 'Routine', amb: 0, icon: 'Mic' },
    { num: 6, name: 'Cough', desc: 'Dry or productive cough due to infection, pollution, or allergy', cat: 'Respiratory', spec: 'Pulmonologist', urg: 'Routine', amb: 0, icon: 'Wind' },
    { num: 7, name: 'Chest Pain', desc: 'Pain or crushing discomfort in the chest radiating to arm', cat: 'Cardiology', spec: 'Cardiologist', urg: 'Emergency', amb: 1, icon: 'Heart' },
    { num: 8, name: 'Hypertension', desc: 'High blood pressure or systolic BP spikes, dizziness', cat: 'Cardiology', spec: 'Cardiologist', urg: 'Urgent', amb: 0, icon: 'Activity' },
    { num: 9, name: 'Asthma', desc: 'Breathing difficulty, wheezing, nighttime chest tightness', cat: 'Respiratory', spec: 'Pulmonologist', urg: 'Urgent', amb: 0, icon: 'Wind' },
    { num: 10, name: 'Bronchitis', desc: 'Inflammation of bronchial tubes, persistent mucus cough', cat: 'Respiratory', spec: 'Pulmonologist', urg: 'Routine', amb: 0, icon: 'Wind' },
    { num: 11, name: 'Pneumonia', desc: 'Lung infection, high fever, wet cough, breathing difficulty', cat: 'Respiratory', spec: 'Pulmonologist', urg: 'Urgent', amb: 1, icon: 'AlertTriangle' },
    { num: 12, name: 'Tonsillitis', desc: 'Swollen red tonsils, severe throat pain, difficulty swallowing', cat: 'ENT', spec: 'ENT Specialist', urg: 'Routine', amb: 0, icon: 'Thermometer' },
    { num: 13, name: 'Sinusitis', desc: 'Sinus pressure, facial ache, headache, thick nasal discharge', cat: 'ENT', spec: 'ENT Specialist', urg: 'Routine', amb: 0, icon: 'Wind' },
    { num: 14, name: 'Allergies', desc: 'Sneezing, itchy eyes, runny nose, allergic skin reactions', cat: 'Dermatology', spec: 'Dermatologist', urg: 'Routine', amb: 0, icon: 'Sparkles' },
    { num: 15, name: 'Skin Rash', desc: 'Red, itchy, inflamed patches or allergic hive eruptions', cat: 'Dermatology', spec: 'Dermatologist', urg: 'Routine', amb: 0, icon: 'Sparkles' },
    { num: 16, name: 'Acne', desc: 'Pimples, cystic breakouts, oily skin related inflammation', cat: 'Dermatology', spec: 'Dermatologist', urg: 'Routine', amb: 0, icon: 'Smile' },
    { num: 17, name: 'Eczema', desc: 'Dry, flaky, intensely itchy, inflamed skin dermatitis', cat: 'Dermatology', spec: 'Dermatologist', urg: 'Routine', amb: 0, icon: 'Sparkles' },
    { num: 18, name: 'UTI (Urinary Tract Infection)', desc: 'Painful burning urination, frequent urgent urination, pelvic pain', cat: 'Urology', spec: 'Nephrologist', urg: 'Routine', amb: 0, icon: 'AlertCircle' },
    { num: 19, name: 'Kidney Stones', desc: 'Excruciating sharp pain in side and back, hematuria (blood in urine)', cat: 'Urology', spec: 'Nephrologist', urg: 'Urgent', amb: 0, icon: 'AlertTriangle' },
    { num: 20, name: 'Gastritis', desc: 'Stomach ache, burning epigastric acidity, nausea, indigestion', cat: 'Gastroenterology', spec: 'Gastroenterologist', urg: 'Routine', amb: 0, icon: 'Flame' },
    { num: 21, name: 'GERD', desc: 'Acid reflux, heartburn, food regurgitation, sour throat', cat: 'Gastroenterology', spec: 'Gastroenterologist', urg: 'Routine', amb: 0, icon: 'Flame' },
    { num: 22, name: 'Constipation', desc: 'Hard infrequent stools, straining, painful bowel movement', cat: 'Gastroenterology', spec: 'Gastroenterologist', urg: 'Routine', amb: 0, icon: 'Clock' },
    { num: 23, name: 'Diarrhea', desc: 'Frequent loose watery stools, stomach cramps, dehydration risk', cat: 'Gastroenterology', spec: 'Gastroenterologist', urg: 'Routine', amb: 0, icon: 'AlertCircle' },
    { num: 24, name: 'Thyroid Disorder', desc: 'Hypothyroidism or hyperthyroidism, chronic fatigue, weight shifts', cat: 'Endocrinology', spec: 'Endocrinologist & Diabetologist', urg: 'Routine', amb: 0, icon: 'Activity' },
    { num: 25, name: 'Anemia', desc: 'Extreme fatigue, pale skin, dizziness, shortness of breath on exertion', cat: 'General', spec: 'General Physician', urg: 'Routine', amb: 0, icon: 'Droplet' },
    { num: 26, name: 'Arthritis', desc: 'Joint inflammation, stiffness, morning pain, reduced mobility', cat: 'Orthopedics', spec: 'Orthopedic Surgeon', urg: 'Routine', amb: 0, icon: 'Bone' },
    { num: 27, name: 'Back Pain', desc: 'Lumbar pain, spine stiffness, radiating sciatica, muscle spasm', cat: 'Orthopedics', spec: 'Orthopedic Surgeon', urg: 'Routine', amb: 0, icon: 'Bone' },
    { num: 28, name: 'Neck Pain', desc: 'Cervical stiffness, sharp neck pain, poor posture strain, headache', cat: 'Orthopedics', spec: 'Orthopedic Surgeon', urg: 'Routine', amb: 0, icon: 'Bone' },
    { num: 29, name: 'Eye Infection', desc: 'Redness, burning, discharge, swollen eyelids, conjunctivitis', cat: 'Ophthalmology', spec: 'General Physician', urg: 'Routine', amb: 0, icon: 'Eye' },
    { num: 30, name: 'Ear Infection', desc: 'Sharp earache, fluid discharge, temporary hearing dampening', cat: 'ENT', spec: 'ENT Specialist', urg: 'Routine', amb: 0, icon: 'Volume2' },
    { num: 31, name: 'Toothache', desc: 'Throbbing tooth pain, temperature sensitivity, dental cavity', cat: 'Dental', spec: 'General Physician', urg: 'Routine', amb: 0, icon: 'Smile' },
    { num: 32, name: 'Gum Disease', desc: 'Swollen bleeding gums, gingivitis, loose teeth, bad breath', cat: 'Dental', spec: 'General Physician', urg: 'Routine', amb: 0, icon: 'Smile' },
    { num: 33, name: 'Menstrual Pain', desc: 'Severe abdominal cramps, lower back pelvic aches during periods', cat: 'Gynecology', spec: 'General Physician', urg: 'Routine', amb: 0, icon: 'Heart' },
    { num: 34, name: 'PCOS', desc: 'Hormonal imbalance, irregular menstrual cycles, acne, weight gain', cat: 'Gynecology', spec: 'General Physician', urg: 'Routine', amb: 0, icon: 'Activity' },
    { num: 35, name: 'Pregnancy Care', desc: 'Prenatal wellness checkups, first trimester nausea, fetal monitoring', cat: 'Gynecology', spec: 'General Physician', urg: 'Routine', amb: 0, icon: 'UserCheck' },
    { num: 36, name: 'Infertility', desc: 'Difficulty conceiving, reproductive health check, hormone profiling', cat: 'Gynecology', spec: 'General Physician', urg: 'Routine', amb: 0, icon: 'Heart' },
    { num: 37, name: 'Depression', desc: 'Persistent sadness, lack of interest, sleep disruption, mood changes', cat: 'Mental Health', spec: 'General Physician', urg: 'Routine', amb: 0, icon: 'Brain' },
    { num: 38, name: 'Anxiety', desc: 'Excessive nervousness, panic palpitations, racing thoughts, restlessness', cat: 'Mental Health', spec: 'General Physician', urg: 'Routine', amb: 0, icon: 'Brain' },
    { num: 39, name: 'Insomnia', desc: 'Chronic difficulty falling or staying asleep, daytime exhaustion', cat: 'Neurology', spec: 'Neurologist', urg: 'Routine', amb: 0, icon: 'Moon' },
    { num: 40, name: 'Vertigo', desc: 'Sudden spinning sensation, loss of balance, nausea while turning', cat: 'Neurology', spec: 'Neurologist', urg: 'Routine', amb: 0, icon: 'RotateCw' },
    { num: 41, name: 'Liver Disease', desc: 'Liver inflammation, fatty liver diagnosis, right upper quadrant pain', cat: 'Gastroenterology', spec: 'Hepatologist & Gastroenterologist', urg: 'Routine', amb: 0, icon: 'Activity' },
    { num: 42, name: 'Jaundice', desc: 'Yellowing of skin and whites of eyes, dark urine, liver stress', cat: 'Gastroenterology', spec: 'Hepatologist & Gastroenterologist', urg: 'Urgent', amb: 0, icon: 'Eye' },
    { num: 43, name: 'Heart Disease', desc: 'Coronary artery disease, irregular heartbeats, exertion breathlessness', cat: 'Cardiology', spec: 'Cardiologist', urg: 'Emergency', amb: 1, icon: 'Heart' },
    { num: 44, name: 'Stroke', desc: 'Sudden facial droop, arm weakness, speech slurring (FAST warning)', cat: 'Neurology', spec: 'Neurologist', urg: 'Emergency', amb: 1, icon: 'AlertTriangle' },
    { num: 45, name: 'Epilepsy', desc: 'Seizures, fits, momentary loss of consciousness, involuntary jerks', cat: 'Neurology', spec: 'Neurologist', urg: 'Emergency', amb: 1, icon: 'Zap' },
    { num: 46, name: 'Obesity', desc: 'Excess body weight affecting cardiovascular and metabolic vitality', cat: 'General', spec: 'Endocrinologist & Diabetologist', urg: 'Routine', amb: 0, icon: 'Scale' },
    { num: 47, name: 'Hair Fall', desc: 'Excessive hair shedding, scalp thinning, alopecia areata patches', cat: 'Dermatology', spec: 'Dermatologist', urg: 'Routine', amb: 0, icon: 'Sparkles' },
    { num: 48, name: 'Diabetes', desc: 'Uncontrolled high blood sugar, excessive thirst, frequent urination', cat: 'General', spec: 'Endocrinologist & Diabetologist', urg: 'Routine', amb: 0, icon: 'Activity' },
    { num: 49, name: 'Gallstones', desc: 'Sharp upper right abdominal colic pain, nausea after fatty meals', cat: 'Gastroenterology', spec: 'Gastroenterologist', urg: 'Urgent', amb: 0, icon: 'Flame' },
    { num: 50, name: 'Food Poisoning', desc: 'Sudden acute vomiting, watery diarrhea, stomach cramps after dining', cat: 'Gastroenterology', spec: 'General Physician', urg: 'Urgent', amb: 0, icon: 'AlertCircle' }
  ];

  for (const d of diseasesData) {
    execute(`
      INSERT OR REPLACE INTO diseases (disease_id, number, name, description, category, recommended_specialty, urgency, requires_ambulance, icon_name)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [`DIS-${d.num.toString().padStart(3, '0')}`, d.num, d.name, d.desc, d.cat, d.spec, d.urg, d.amb, d.icon]);
  }

  // Ensure all doctors in hospital.db are linked to hospital network
  execute("UPDATE doctors SET hospital_id = 'HOSP-05' WHERE doctor_id IN ('DOC-CARD-02', 'DOC-PEDI-01') AND (hospital_id IS NULL OR hospital_id = '')");
  execute("UPDATE doctors SET hospital_id = 'HOSP-03' WHERE doctor_id = 'DOC-ORTH-02' AND (hospital_id IS NULL OR hospital_id = '')");
  execute("UPDATE doctors SET hospital_id = 'HOSP-01' WHERE doctor_id = 'DOC-EMER-01' AND (hospital_id IS NULL OR hospital_id = '')");

  console.log('[SEED] Successfully synchronized 13 distinct doctors, 5 hospitals, and 50 clinical diseases in database!');
}

if (process.argv[1]?.includes('seed')) {
  seedDatabase();
}
