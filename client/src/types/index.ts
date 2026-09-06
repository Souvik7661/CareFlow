export type Role = 'PATIENT' | 'DOCTOR' | 'RECEPTIONIST' | 'ADMIN';

export interface User {
  userId: string;
  patientId?: string;
  doctorId?: string;
  fullName: string;
  email: string;
  role: Role;
  specialization?: string;
  roomNo?: string;
  phone?: string;
}

export interface Patient {
  patient_id: string;
  user_id?: string;
  full_name: string;
  date_of_birth?: string;
  age: number;
  gender: string;
  phone: string;
  email?: string;
  address?: string;
  blood_group?: string;
  allergies?: string;
  medical_history?: string;
  current_medications?: string;
  emergency_contact?: string;
}

export interface Doctor {
  doctor_id: string;
  user_id?: string;
  hospital_id?: string;
  hospital_name?: string;
  hospital_address?: string;
  hospital_distance?: number;
  name: string;
  specialization: string;
  department_id: string;
  department_name?: string;
  qualification?: string;
  experience?: number;
  phone?: string;
  email?: string;
  status: 'AVAILABLE' | 'ON_LEAVE' | 'OFF_DUTY' | 'IN_CONSULTATION' | 'INACTIVE';
  room_no: string;
  rating: number;
  total_reviews?: number;
  consultation_fee: number;
  avg_consultation_time: number;
  active_queue?: number;
}

export interface Hospital {
  hospital_id: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  distance_km: number;
  rating: number;
  total_reviews: number;
  is_open_247: number;
  emergency_phone: string;
  google_maps_url: string;
  doctor_count?: number;
}

export interface DiseaseItem {
  disease_id: string;
  number: number;
  name: string;
  description: string;
  category: string;
  recommended_specialty: string;
  urgency: 'Routine' | 'Urgent' | 'Emergency';
  requires_ambulance: number;
  icon_name?: string;
}

export interface AmbulanceInfo {
  requestId: string;
  hospitalName: string;
  pickupAddress: string;
  ambulanceType: 'Basic' | 'Advanced' | 'ICU';
  etaMinutes: number;
  status: 'DISPATCHED' | 'EN_ROUTE' | 'ARRIVED' | 'COMPLETED' | 'CANCELLED';
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  hospitalPhone: string;
  hospitalCoords: { lat: number; lng: number };
  pickupCoords: { lat: number; lng: number };
}

export interface Department {
  department_id: string;
  name: string;
  specialty: string;
  description?: string;
  room_wing?: string;
}

export interface Appointment {
  appointment_id: string;
  patient_id: string;
  patient_name?: string;
  patient_phone?: string;
  doctor_id: string;
  doctor_name?: string;
  specialization?: string;
  room_no?: string;
  department_id: string;
  department_name?: string;
  room_wing?: string;
  appointment_date: string;
  appointment_time: string;
  status: 'BOOKED' | 'CHECKED_IN' | 'IN_QUEUE' | 'IN_CONSULTATION' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  reason?: string;
  token_number?: string;
  queue_position?: number;
  estimated_wait_time?: number;
  queue_status?: string;
}

export interface DoctorRecommendation {
  formId: string;
  recommendationId: string;
  probableCategory: string;
  recommendedSpecialty: string;
  recommendedDepartment: {
    id: string;
    name: string;
    description: string;
    wing: string;
  };
  recommendedDoctor: {
    doctorId: string;
    name: string;
    specialization: string;
    departmentId: string;
    qualification: string;
    experience: number;
    roomNo: string;
    rating: number;
    consultationFee: number;
    avgTime: number;
    status: string;
    activeQueueCount: number;
    nextAvailableSlot: string;
    matchScore: number;
    rankLabel: 'Best Match';
  };
  alternativeDoctors: Array<{
    doctorId: string;
    name: string;
    specialization: string;
    departmentId: string;
    qualification: string;
    experience: number;
    roomNo: string;
    rating: number;
    consultationFee: number;
    status: string;
    activeQueueCount: number;
    nextAvailableSlot: string;
    rankLabel: 'Alternative';
  }>;
  explanation: string;
  confidenceLevel: 'High' | 'Medium' | 'Low';
  emergencyFlag: boolean;
  emergencyWarning?: string;
}

export interface LiveQueueStatus {
  hasActiveQueue: boolean;
  tokenNumber?: string;
  queuePosition?: number;
  patientsAhead?: number;
  estimatedWaitTime?: number;
  estimatedConsultationTime?: string;
  status?: string;
  doctorName?: string;
  specialization?: string;
  roomNo?: string;
  departmentName?: string;
  nowServingToken?: string;
}

export interface NotificationItem {
  notification_id: string;
  patient_id: string;
  appointment_id?: string;
  type: string;
  title: string;
  message: string;
  read_status: number;
  created_at: string;
}

export interface PrescriptionMedicine {
  medicine_id?: string;
  medicine_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface MedicalVisitRecord {
  appointment_id: string;
  appointment_date: string;
  appointment_time: string;
  reason?: string;
  doctor_name: string;
  specialization: string;
  room_no: string;
  department_name: string;
  consultation_id?: string;
  clinical_notes?: string;
  observations?: string;
  assessment?: string;
  follow_up?: string;
  prescription_id?: string;
  prescription_notes?: string;
  medicines: PrescriptionMedicine[];
}
