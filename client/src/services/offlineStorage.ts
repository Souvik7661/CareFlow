/**
 * CareFlow Offline Storage Database (CareFlowOfflineDB)
 * High-reliability client-side database utilizing IndexedDB with synchronous LocalStorage fallback.
 * Engineered for rural healthcare workers and remote patients with zero or intermittent internet.
 */

import { Doctor, Appointment, DiseaseItem, MedicalVisitRecord } from '../types';

const DB_NAME = 'CareFlow_Rural_DB';
const DB_VERSION = 1;

export interface OfflineSyncItem {
  id: string;
  type: 'APPOINTMENT_BOOKING';
  payload: any;
  createdAt: string;
  localToken: string;
  status: 'PENDING' | 'SYNCED' | 'FAILED';
  retryCount: number;
}

export interface OfflinePatientProfile {
  patientId: string;
  fullName: string;
  age: number;
  gender: string;
  phone: string;
  email?: string;
  bloodGroup?: string;
  allergies?: string;
  medicalHistory?: string;
  currentMedications?: string;
}

class OfflineStorageService {
  private dbPromise: Promise<IDBDatabase> | null = null;
  private isIndexedDBAvailable: boolean = false;

  constructor() {
    this.isIndexedDBAvailable = typeof window !== 'undefined' && 'indexedDB' in window;
    if (this.isIndexedDBAvailable) {
      this.initDB();
    }
  }

  private initDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
          const db = (event.target as IDBOpenDBRequest).result;

          // 1. Doctors Store
          if (!db.objectStoreNames.contains('doctors')) {
            db.createObjectStore('doctors', { keyPath: 'doctor_id' });
          }

          // 2. Diseases Store
          if (!db.objectStoreNames.contains('diseases')) {
            const diseaseStore = db.createObjectStore('diseases', { keyPath: 'disease_id' });
            diseaseStore.createIndex('category', 'category', { unique: false });
          }

          // 3. Appointments & Passes Store
          if (!db.objectStoreNames.contains('appointments')) {
            const apptStore = db.createObjectStore('appointments', { keyPath: 'appointment_id' });
            apptStore.createIndex('patient_id', 'patient_id', { unique: false });
            apptStore.createIndex('doctor_id', 'doctor_id', { unique: false });
          }

          // 4. Medical History / Prescriptions Store
          if (!db.objectStoreNames.contains('medical_history')) {
            db.createObjectStore('medical_history', { keyPath: 'patient_id' });
          }

          // 5. Offline Sync Queue Store
          if (!db.objectStoreNames.contains('sync_queue')) {
            db.createObjectStore('sync_queue', { keyPath: 'id' });
          }

          // 6. Patient Profiles Store
          if (!db.objectStoreNames.contains('patients')) {
            db.createObjectStore('patients', { keyPath: 'patientId' });
          }
        };

        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = () => {
          console.warn('[OfflineDB] IndexedDB open error, falling back to LocalStorage', request.error);
          reject(request.error);
        };
      } catch (err) {
        console.warn('[OfflineDB] IndexedDB exception, fallback to LocalStorage', err);
        reject(err);
      }
    });

    return this.dbPromise;
  }

  // --- DOCTORS DATABASE ---

  public async saveDoctors(doctors: any[]): Promise<void> {
    try {
      // Always save copy to localStorage for instant synchronous reads
      localStorage.setItem('careflow_offline_doctors', JSON.stringify(doctors));

      if (this.isIndexedDBAvailable) {
        const db = await this.initDB();
        const tx = db.transaction('doctors', 'readwrite');
        const store = tx.objectStore('doctors');
        for (const doc of doctors) {
          const id = doc.doctor_id || doc.doctorId;
          store.put({ ...doc, doctor_id: id });
        }
      }
    } catch (e) {
      console.warn('[OfflineDB] saveDoctors error:', e);
    }
  }

  public async getDoctors(): Promise<any[]> {
    try {
      if (this.isIndexedDBAvailable) {
        const db = await this.initDB();
        const tx = db.transaction('doctors', 'readonly');
        const store = tx.objectStore('doctors');
        const req = store.getAll();
        const result = await new Promise<any[]>((resolve) => {
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => resolve([]);
        });
        if (result.length > 0) return result;
      }
    } catch (e) {}

    // Fallback to localStorage
    const saved = localStorage.getItem('careflow_offline_doctors');
    return saved ? JSON.parse(saved) : [];
  }

  // --- DISEASES DATABASE ---

  public async saveDiseases(diseases: any[]): Promise<void> {
    try {
      localStorage.setItem('careflow_offline_diseases', JSON.stringify(diseases));

      if (this.isIndexedDBAvailable) {
        const db = await this.initDB();
        const tx = db.transaction('diseases', 'readwrite');
        const store = tx.objectStore('diseases');
        for (const d of diseases) {
          const id = d.disease_id || d.id || `DIS-${d.number}`;
          store.put({ ...d, disease_id: id });
        }
      }
    } catch (e) {
      console.warn('[OfflineDB] saveDiseases error:', e);
    }
  }

  public async getDiseases(): Promise<any[]> {
    try {
      if (this.isIndexedDBAvailable) {
        const db = await this.initDB();
        const tx = db.transaction('diseases', 'readonly');
        const store = tx.objectStore('diseases');
        const req = store.getAll();
        const result = await new Promise<any[]>((resolve) => {
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => resolve([]);
        });
        if (result.length > 0) return result;
      }
    } catch (e) {}

    const saved = localStorage.getItem('careflow_offline_diseases');
    return saved ? JSON.parse(saved) : [];
  }

  // --- PATIENT MEDICAL HISTORY DATABASE ---

  public async saveMedicalHistory(patientId: string, historyTimeline: any[]): Promise<void> {
    try {
      localStorage.setItem(`careflow_offline_history_${patientId}`, JSON.stringify(historyTimeline));

      if (this.isIndexedDBAvailable) {
        const db = await this.initDB();
        const tx = db.transaction('medical_history', 'readwrite');
        const store = tx.objectStore('medical_history');
        store.put({ patient_id: patientId, timeline: historyTimeline, updatedAt: new Date().toISOString() });
      }
    } catch (e) {
      console.warn('[OfflineDB] saveMedicalHistory error:', e);
    }
  }

  public async getMedicalHistory(patientId: string): Promise<any[]> {
    try {
      if (this.isIndexedDBAvailable) {
        const db = await this.initDB();
        const tx = db.transaction('medical_history', 'readonly');
        const store = tx.objectStore('medical_history');
        const req = store.get(patientId);
        const result = await new Promise<any>((resolve) => {
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => resolve(null);
        });
        if (result?.timeline && Array.isArray(result.timeline)) return result.timeline;
      }
    } catch (e) {}

    const saved = localStorage.getItem(`careflow_offline_history_${patientId}`);
    return saved ? JSON.parse(saved) : [];
  }

  // --- APPOINTMENTS & SEQUENTIAL OFFLINE BOOKING ---

  public async saveAppointments(patientId: string, appointments: any[]): Promise<void> {
    try {
      const key = `careflow_offline_appts_${patientId}`;
      localStorage.setItem(key, JSON.stringify(appointments));

      if (this.isIndexedDBAvailable) {
        const db = await this.initDB();
        const tx = db.transaction('appointments', 'readwrite');
        const store = tx.objectStore('appointments');
        for (const appt of appointments) {
          const id = appt.appointment_id || appt.appointmentId;
          store.put({ ...appt, appointment_id: id, patient_id: patientId });
        }
      }
    } catch (e) {}
  }

  public async getAppointments(patientId: string): Promise<any[]> {
    try {
      if (this.isIndexedDBAvailable) {
        const db = await this.initDB();
        const tx = db.transaction('appointments', 'readonly');
        const store = tx.objectStore('appointments');
        const req = store.getAll();
        const all = await new Promise<any[]>((resolve) => {
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => resolve([]);
        });
        const filtered = all.filter(a => (a.patient_id === patientId || a.patientId === patientId));
        if (filtered.length > 0) return filtered;
      }
    } catch (e) {}

    const saved = localStorage.getItem(`careflow_offline_appts_${patientId}`);
    return saved ? JSON.parse(saved) : [];
  }

  /**
   * Book an appointment while offline in a rural area.
   * Generates a realistic sequential token (#1, #2...) based on existing bookings for that doctor and date.
   */
  public async createOfflineAppointment(payload: {
    patientId: string;
    patientName?: string;
    doctorId: string;
    departmentId?: string;
    appointmentDate: string;
    appointmentTime: string;
    reason?: string;
  }): Promise<{ appointment: any; syncItem: OfflineSyncItem }> {
    const doctors = await this.getDoctors();
    const targetDoctor = doctors.find(d => (d.doctor_id === payload.doctorId || d.doctorId === payload.doctorId)) || {
      name: 'Specialist Physician',
      specialization: 'General Medicine',
      room_no: 'Room 101',
      avg_consultation_time: 15
    };

    // Count all local and existing appointments for this doctor on this appointmentDate
    const existing = await this.getAppointments(payload.patientId);
    const doctorApptsOnDate = existing.filter(a => 
      (a.doctor_id === payload.doctorId || a.doctorId === payload.doctorId) && 
      (a.appointment_date === payload.appointmentDate || a.appointmentDate === payload.appointmentDate) &&
      a.status !== 'CANCELLED'
    );

    // Compute sequential token: #1, #2, #3...
    const tokenSequence = doctorApptsOnDate.length + 1;
    const tokenNum = `#${tokenSequence}`;

    const randomId = Math.floor(10000 + Math.random() * 90000);
    const appointmentId = `APT-OFFLINE-${randomId}`;

    const appointment: any = {
      appointment_id: appointmentId,
      appointmentId: appointmentId,
      patient_id: payload.patientId,
      patientId: payload.patientId,
      patientName: payload.patientName || 'Patient',
      doctor_id: payload.doctorId,
      doctorId: payload.doctorId,
      doctorName: targetDoctor.name,
      doctor_name: targetDoctor.name,
      specialization: targetDoctor.specialization,
      roomNo: targetDoctor.room_no || 'Room 101',
      room_no: targetDoctor.room_no || 'Room 101',
      departmentId: payload.departmentId || targetDoctor.department_id || 'DEP-GEN',
      departmentName: targetDoctor.department_name || targetDoctor.specialization || 'Clinical Services',
      wing: targetDoctor.room_wing || 'Block A • Rural Care Center',
      appointment_date: payload.appointmentDate,
      appointmentDate: payload.appointmentDate,
      appointment_time: payload.appointmentTime,
      appointmentTime: payload.appointmentTime,
      status: 'BOOKED',
      token_number: tokenNum,
      tokenNumber: tokenNum,
      tokenSequence,
      queue_position: tokenSequence,
      estimated_wait_time: tokenSequence * (targetDoctor.avg_consultation_time || 15),
      reason: payload.reason || 'Rural OPD Consultation',
      isOffline: true,
      offlineCreatedAt: new Date().toISOString()
    };

    // Save to local appointments store immediately
    const updated = [appointment, ...existing];
    await this.saveAppointments(payload.patientId, updated);

    // Queue for background synchronization when back online
    const syncItem: OfflineSyncItem = {
      id: `SYNC-${Date.now()}-${randomId}`,
      type: 'APPOINTMENT_BOOKING',
      payload,
      createdAt: new Date().toISOString(),
      localToken: tokenNum,
      status: 'PENDING',
      retryCount: 0
    };

    await this.addSyncQueueItem(syncItem);

    return { appointment, syncItem };
  }

  // --- SYNC QUEUE OPERATIONS ---

  public async addSyncQueueItem(item: OfflineSyncItem): Promise<void> {
    try {
      const existing = await this.getSyncQueue();
      const updated = [...existing.filter(i => i.id !== item.id), item];
      localStorage.setItem('careflow_sync_queue', JSON.stringify(updated));

      if (this.isIndexedDBAvailable) {
        const db = await this.initDB();
        const tx = db.transaction('sync_queue', 'readwrite');
        tx.objectStore('sync_queue').put(item);
      }
    } catch (e) {
      console.warn('[OfflineDB] addSyncQueueItem error:', e);
    }
  }

  public async getSyncQueue(): Promise<OfflineSyncItem[]> {
    try {
      if (this.isIndexedDBAvailable) {
        const db = await this.initDB();
        const tx = db.transaction('sync_queue', 'readonly');
        const store = tx.objectStore('sync_queue');
        const req = store.getAll();
        const result = await new Promise<OfflineSyncItem[]>((resolve) => {
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => resolve([]);
        });
        if (result.length > 0) return result;
      }
    } catch (e) {}

    const saved = localStorage.getItem('careflow_sync_queue');
    return saved ? JSON.parse(saved) : [];
  }

  public async removeSyncQueueItem(id: string): Promise<void> {
    try {
      const existing = await this.getSyncQueue();
      const updated = existing.filter(item => item.id !== id);
      localStorage.setItem('careflow_sync_queue', JSON.stringify(updated));

      if (this.isIndexedDBAvailable) {
        const db = await this.initDB();
        const tx = db.transaction('sync_queue', 'readwrite');
        tx.objectStore('sync_queue').delete(id);
      }
    } catch (e) {}
  }
}

export const offlineStorage = new OfflineStorageService();
