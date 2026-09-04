import { 
  User, 
  DoctorRecommendation, 
  Appointment, 
  LiveQueueStatus, 
  NotificationItem, 
  MedicalVisitRecord,
  Doctor
} from '../types';

const BASE_URL = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('careflow_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {})
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Request failed with status ' + res.status);
  }
  return data;
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

  demoLogin: (role: string, doctorId?: string) => 
    request<{ token: string; user: User; message: string }>('/auth/demo-login', {
      method: 'POST',
      body: JSON.stringify({ role, doctorId })
    }),

  getMe: () => request<{ user: User }>('/auth/me'),

  logout: () => {
    localStorage.removeItem('careflow_token');
    return request<{ message: string }>('/auth/logout', { method: 'POST' });
  },

  // AI Module A
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

  bookAppointment: (payload: {
    patientId: string;
    doctorId: string;
    departmentId?: string;
    appointmentDate: string;
    appointmentTime: string;
    reason?: string;
  }) => request<{ message: string; appointment: any }>('/appointments/book', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),

  getMyAppointments: (patientId: string) => 
    request<{ appointments: Appointment[] }>(`/appointments/my?patientId=${patientId}`),

  cancelAppointment: (id: string) => 
    request<{ message: string }>(`/appointments/${id}/cancel`, { method: 'POST' }),

  rescheduleAppointment: (id: string, newDate: string, newTime: string) => 
    request<{ message: string }>(`/appointments/${id}/reschedule`, {
      method: 'POST',
      body: JSON.stringify({ newDate, newTime })
    }),

  // Manual Check-In
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

  // Doctor Dashboard
  getDoctorsList: () => 
    request<{ doctors: Doctor[] }>('/doctor/list'),

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
    doctorId: string;
    patientId: string;
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

  // Patient History & Notifications
  getPatientHistory: (patientId: string) => 
    request<{ timeline: MedicalVisitRecord[] }>(`/patient/history/${patientId}`),

  getPatientNotifications: (patientId: string) => 
    request<{ notifications: NotificationItem[] }>(`/patient/notifications/${patientId}`),

  markNotificationRead: (id: string) => 
    request<any>(`/patient/notifications/${id}/read`, { method: 'POST' }),

  // Reception Desk
  getReceptionOverview: () => 
    request<{ stats: any; appointments: any[] }>('/reception/overview'),

  registerWalkIn: (payload: any) => 
    request<any>('/reception/walk-in', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  searchStaff: (q: string) => 
    request<{ results: any[] }>(`/reception/search?q=${encodeURIComponent(q)}`),

  // Admin
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

  // Hospitals & Maps
  getHospitals: () =>
    request<{ hospitals: any[] }>('/hospitals'),

  getHospitalById: (id: string) =>
    request<{ hospital: any; doctors: any[] }>(`/hospitals/${id}`),

  // Diseases Catalog (50 conditions)
  getDiseases: (category?: string, search?: string) => {
    let url = '/diseases?';
    if (category) url += `category=${encodeURIComponent(category)}&`;
    if (search) url += `search=${encodeURIComponent(search)}`;
    return request<{ diseases: any[]; count: number }>(url);
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
    })
};
