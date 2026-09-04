-- CareFlow AI Database Schema

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('PATIENT', 'DOCTOR', 'RECEPTIONIST', 'ADMIN')),
  full_name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS departments (
  department_id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  specialty TEXT NOT NULL,
  description TEXT,
  room_wing TEXT
);

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

CREATE TABLE IF NOT EXISTS patients (
  patient_id TEXT PRIMARY KEY,
  user_id TEXT,
  full_name TEXT NOT NULL,
  date_of_birth TEXT,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  blood_group TEXT,
  allergies TEXT,
  medical_history TEXT,
  current_medications TEXT,
  emergency_contact TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS doctors (
  doctor_id TEXT PRIMARY KEY,
  user_id TEXT,
  hospital_id TEXT,
  name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  department_id TEXT NOT NULL,
  qualification TEXT,
  experience INTEGER DEFAULT 0,
  phone TEXT,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'ON_LEAVE', 'OFF_DUTY', 'IN_CONSULTATION', 'INACTIVE')),
  room_no TEXT NOT NULL,
  rating REAL DEFAULT 4.8,
  total_reviews INTEGER DEFAULT 320,
  consultation_fee INTEGER DEFAULT 500,
  avg_consultation_time INTEGER DEFAULT 15,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (hospital_id) REFERENCES hospitals(hospital_id) ON DELETE SET NULL,
  FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

CREATE TABLE IF NOT EXISTS doctor_availability (
  availability_id TEXT PRIMARY KEY,
  doctor_id TEXT NOT NULL,
  day_of_week TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  is_available INTEGER DEFAULT 1,
  FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE
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

CREATE TABLE IF NOT EXISTS patient_problem_forms (
  form_id TEXT PRIMARY KEY,
  patient_id TEXT NOT NULL,
  symptoms TEXT NOT NULL,
  duration TEXT,
  severity TEXT NOT NULL CHECK (severity IN ('Mild', 'Moderate', 'Severe')),
  additional_symptoms TEXT,
  existing_conditions TEXT,
  current_medications TEXT,
  previous_treatment TEXT,
  additional_information TEXT,
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ai_recommendations (
  recommendation_id TEXT PRIMARY KEY,
  patient_id TEXT NOT NULL,
  form_id TEXT NOT NULL,
  probable_category TEXT NOT NULL,
  recommended_specialty TEXT NOT NULL,
  recommended_department TEXT NOT NULL,
  recommended_doctor_id TEXT NOT NULL,
  confidence_level TEXT NOT NULL CHECK (confidence_level IN ('High', 'Medium', 'Low')),
  explanation TEXT NOT NULL,
  emergency_flag INTEGER DEFAULT 0,
  alternative_doctors TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
  FOREIGN KEY (form_id) REFERENCES patient_problem_forms(form_id) ON DELETE CASCADE,
  FOREIGN KEY (recommended_doctor_id) REFERENCES doctors(doctor_id)
);

CREATE TABLE IF NOT EXISTS appointments (
  appointment_id TEXT PRIMARY KEY,
  patient_id TEXT NOT NULL,
  doctor_id TEXT NOT NULL,
  department_id TEXT NOT NULL,
  appointment_date TEXT NOT NULL,
  appointment_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'BOOKED' CHECK (status IN ('BOOKED', 'CHECKED_IN', 'IN_QUEUE', 'IN_CONSULTATION', 'COMPLETED', 'CANCELLED', 'NO_SHOW')),
  reason TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id),
  FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

CREATE TABLE IF NOT EXISTS check_ins (
  checkin_id TEXT PRIMARY KEY,
  appointment_id TEXT UNIQUE NOT NULL,
  patient_id TEXT NOT NULL,
  checkin_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  token_number TEXT NOT NULL,
  queue_status TEXT DEFAULT 'Waiting',
  FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id) ON DELETE CASCADE,
  FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
);

CREATE TABLE IF NOT EXISTS queue (
  queue_id TEXT PRIMARY KEY,
  appointment_id TEXT UNIQUE NOT NULL,
  doctor_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  token_number TEXT NOT NULL,
  queue_position INTEGER NOT NULL,
  estimated_wait_time INTEGER NOT NULL,
  estimated_consultation_time TEXT,
  triage_priority TEXT DEFAULT 'ROUTINE' CHECK (triage_priority IN ('ROUTINE', 'URGENT', 'EMERGENCY')),
  status TEXT NOT NULL DEFAULT 'WAITING' CHECK (status IN ('WAITING', 'CALLED', 'IN_CONSULTATION', 'COMPLETED', 'NO_SHOW', 'CANCELLED')),
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id),
  FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
);

CREATE TABLE IF NOT EXISTS consultations (
  consultation_id TEXT PRIMARY KEY,
  appointment_id TEXT UNIQUE NOT NULL,
  patient_id TEXT NOT NULL,
  doctor_id TEXT NOT NULL,
  notes TEXT,
  observations TEXT,
  assessment TEXT,
  follow_up TEXT,
  consultation_start DATETIME,
  consultation_end DATETIME,
  FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id) ON DELETE CASCADE,
  FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
  FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
);

CREATE TABLE IF NOT EXISTS prescriptions (
  prescription_id TEXT PRIMARY KEY,
  patient_id TEXT NOT NULL,
  doctor_id TEXT NOT NULL,
  appointment_id TEXT NOT NULL,
  consultation_id TEXT NOT NULL,
  notes TEXT,
  prescription_date TEXT NOT NULL,
  FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id),
  FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id) ON DELETE CASCADE,
  FOREIGN KEY (consultation_id) REFERENCES consultations(consultation_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS prescription_medicines (
  medicine_id TEXT PRIMARY KEY,
  prescription_id TEXT NOT NULL,
  medicine_name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  duration TEXT NOT NULL,
  instructions TEXT,
  FOREIGN KEY (prescription_id) REFERENCES prescriptions(prescription_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
  notification_id TEXT PRIMARY KEY,
  patient_id TEXT NOT NULL,
  appointment_id TEXT,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read_status INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS hospital_settings (
  setting_id TEXT PRIMARY KEY,
  hospital_name TEXT NOT NULL,
  queue_rules TEXT,
  appointment_rules TEXT,
  notification_settings TEXT,
  default_consultation_minutes INTEGER DEFAULT 15,
  emergency_override INTEGER DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indices for rapid querying
CREATE INDEX IF NOT EXISTS idx_doctors_dept ON doctors(department_id);
CREATE INDEX IF NOT EXISTS idx_doctors_hosp ON doctors(hospital_id);
CREATE INDEX IF NOT EXISTS idx_doctors_status ON doctors(status);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_date ON appointments(doctor_id, appointment_date);
CREATE INDEX IF NOT EXISTS idx_queue_doctor_status ON queue(doctor_id, status);
CREATE INDEX IF NOT EXISTS idx_checkins_appointment ON check_ins(appointment_id);
CREATE INDEX IF NOT EXISTS idx_diseases_category ON diseases(category);
