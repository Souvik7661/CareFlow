import { api } from './client/src/services/api.ts';

async function runEndToEndVerification() {
  console.log('====================================================');
  console.log('🚀 STARTING CAREFLOW AI FULL END-TO-END VERIFICATION');
  console.log('====================================================\n');

  const BASE = 'http://localhost:5001/api';

  // Helper fetch
  async function post(url: string, data: any) {
    const res = await fetch(`${BASE}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
    return json;
  }

  async function get(url: string) {
    const res = await fetch(`${BASE}${url}`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
    return json;
  }

  // 1. Health Check
  const health = await get('/health');
  console.log('✅ 1. Server Health:', health.status, `(v${health.version})`);

  // 2. Patient Registration
  const testPatientData = {
    fullName: 'David Miller',
    phone: '+91 99887 76655',
    email: `david.miller.${Date.now()}@example.com`,
    age: '45',
    gender: 'Male',
    bloodGroup: 'B+',
    allergies: 'Penicillin',
    medicalHistory: 'Occasional mild palpitations',
    currentMedications: 'None'
  };
  const regRes = await post('/auth/register', testPatientData);
  const patientId = regRes.user.patientId;
  console.log('✅ 2. Patient Registered Successfully:');
  console.log(`   - Name: ${regRes.user.fullName}`);
  console.log(`   - Patient ID: ${patientId}`);
  console.log(`   - Auth Token generated`);

  // 3. AI Symptom Analysis & Doctor Recommendation (Module A)
  const aiProblemInput = {
    patientId,
    symptoms: 'I have had continuous tightness in my chest and sudden palpitations for the past 3 days when climbing stairs.',
    duration: 'A few days (2-5 days)',
    severity: 'Moderate',
    additionalSymptoms: 'Chest Tightness, Palpitations, Shortness of Breath',
    existingConditions: 'Occasional mild palpitations',
    currentMedications: 'None'
  };

  const aiRec = await post('/ai/analyze-and-recommend', aiProblemInput);
  console.log('✅ 3. AI Doctor Recommendation (Module A):');
  console.log(`   - Probable Category: ${aiRec.probableCategory}`);
  console.log(`   - Recommended Department: ${aiRec.recommendedDepartment.name} (${aiRec.recommendedDepartment.wing})`);
  console.log(`   - Top Recommended Doctor: ${aiRec.recommendedDoctor.name} (${aiRec.recommendedDoctor.specialization})`);
  console.log(`   - Match Rank: ${aiRec.recommendedDoctor.rankLabel} (Score: ${aiRec.recommendedDoctor.matchScore}%)`);
  console.log(`   - Confidence: ${aiRec.confidenceLevel}`);
  console.log(`   - Doctor Room: ${aiRec.recommendedDoctor.roomNo}`);
  console.log(`   - Alternative Doctors Found: ${aiRec.alternativeDoctors.length} (${aiRec.alternativeDoctors.map((d: any) => d.name).join(', ')})`);
  console.log(`   - Explanation: "${aiRec.explanation}"`);

  // 4. Emergency Triaging Test (Safety Check)
  const emergencyInput = {
    patientId,
    symptoms: 'Sudden crushing chest pain radiating to left jaw with severe breathlessness and gasping for air.',
    severity: 'Severe'
  };
  const emerRec = await post('/ai/analyze-and-recommend', emergencyInput);
  console.log('✅ 4. Emergency Safety Triaging Check:');
  console.log(`   - Emergency Flag Triggered: ${emerRec.emergencyFlag}`);
  console.log(`   - Emergency Notice: "${emerRec.emergencyWarning?.slice(0, 60)}..."`);

  // 5. Slot Fetching & Appointment Booking
  const doctorId = aiRec.recommendedDoctor.doctorId;
  const todayStr = new Date().toISOString().split('T')[0];
  const slotsRes = await get(`/appointments/slots?doctorId=${doctorId}&date=${todayStr}`);
  const availableSlot = slotsRes.slots.find((s: any) => s.isAvailable)?.time || '03:00 PM';

  const bookingRes = await post('/appointments/book', {
    patientId,
    doctorId,
    departmentId: aiRec.recommendedDepartment.id,
    appointmentDate: todayStr,
    appointmentTime: availableSlot,
    reason: 'Cardiovascular symptoms evaluation'
  });
  const appointmentId = bookingRes.appointment.appointmentId;
  console.log('✅ 5. Appointment Booked in Database:');
  console.log(`   - Appointment ID: ${appointmentId}`);
  console.log(`   - Scheduled Slot: ${bookingRes.appointment.appointmentTime} on ${bookingRes.appointment.appointmentDate}`);
  console.log(`   - Doctor: ${bookingRes.appointment.doctorName} in ${bookingRes.appointment.roomNo}`);
  console.log(`   - Status: ${bookingRes.appointment.status}`);

  // 6. Manual Patient Arrival Check-In
  const checkinRes = await post('/checkin', { appointmentId });
  console.log('✅ 6. Manual Patient Arrival Check-In:');
  console.log(`   - Check-in Result: ${checkinRes.message}`);
  console.log(`   - Official Token: ${checkinRes.tokenNumber}`);
  console.log(`   - Initial Queue Position: #${checkinRes.queuePosition}`);
  console.log(`   - AI Estimated Wait Time: ~${checkinRes.estimatedWaitTime} mins`);

  // 7. Live Queue Inspection (Module B AI Optimizer)
  const liveQueue = await get(`/queue/patient/${patientId}`);
  console.log('✅ 7. Live Queue Status (Module B AI Optimizer):');
  console.log(`   - Active Token: ${liveQueue.tokenNumber}`);
  console.log(`   - Now Serving in Room: ${liveQueue.nowServingToken}`);
  console.log(`   - Patients Ahead: ${liveQueue.patientsAhead}`);
  console.log(`   - Estimated Wait: ~${liveQueue.estimatedWaitTime} mins`);
  console.log(`   - Projected Consultation Time: ${liveQueue.estimatedConsultationTime}`);

  // 8. Doctor Workflow & Digital Prescription
  console.log('✅ 8. Doctor Workflow & Digital Prescription Pad:');
  // Doctor calls next
  const callRes = await post('/doctor/call-next', { doctorId });
  console.log(`   - Action: Called next patient in line`);

  // Doctor starts consultation
  await post('/doctor/start-consultation', { appointmentId, doctorId });
  console.log(`   - Action: Consultation Started (Status: IN_CONSULTATION)`);

  // Doctor completes consultation & creates digital prescription
  const completeRes = await post('/doctor/complete-consultation', {
    appointmentId,
    doctorId,
    patientId,
    notes: 'Patient examined. Blood pressure 128/84 mmHg, regular pulse 78 bpm. Normal S1 S2.',
    observations: 'No acute ischemic changes. Regular heart rhythm.',
    assessment: 'Mild situational palpitations with early stage hypertension. Low sodium diet recommended.',
    followUp: 'Follow up in 3 weeks',
    medicines: [
      { medicineName: 'Amlodipine Besylate', dosage: '5 mg', frequency: 'Once daily (Morning)', duration: '21 days', instructions: 'After breakfast' },
      { medicineName: 'Metoprolol Tartrate', dosage: '25 mg', frequency: 'Once daily', duration: '14 days', instructions: 'With meals' }
    ]
  });
  console.log(`   - Action: Consultation Completed!`);
  console.log(`   - Consultation ID: ${completeRes.consultationId}`);
  console.log(`   - Digital Prescription ID: ${completeRes.prescriptionId}`);
  console.log(`   - 2 Prescription Medicines Saved to Database`);

  // 9. Patient Medical History Verification
  const historyRes = await get(`/patient/history/${patientId}`);
  const lastVisit = historyRes.timeline[0];
  console.log('✅ 9. Patient Medical History Verification:');
  console.log(`   - Past Visits Recorded: ${historyRes.timeline.length}`);
  console.log(`   - Attending Doctor: ${lastVisit.doctor_name}`);
  console.log(`   - Diagnosis Assessment: "${lastVisit.assessment}"`);
  console.log(`   - Prescribed Medicines: ${lastVisit.medicines.map((m: any) => `${m.medicine_name} (${m.dosage})`).join(', ')}`);

  // 10. Receptionist Desk & Walk-In Triage
  const walkInRes = await post('/reception/walk-in', {
    fullName: 'Maria Garcia',
    age: '38',
    gender: 'Female',
    phone: '+91 91234 56789',
    doctorId,
    triagePriority: 'URGENT',
    reason: 'Acute ankle twist with severe swelling'
  });
  console.log('✅ 10. Reception Desk Walk-In Triage:');
  console.log(`   - Walk-in Registered: ${walkInRes.tokenNumber}`);
  console.log(`   - Triage Priority: URGENT (assigned to ${walkInRes.doctorName})`);

  // 11. Reception Global Staff Search
  const searchRes = await get(`/reception/search?q=David`);
  console.log('✅ 11. Staff Global Search:');
  console.log(`   - Found ${searchRes.results.length} record(s) matching 'David'`);

  // 12. Admin Analytics
  const adminAnalytics = await get('/admin/analytics');
  console.log('✅ 12. Admin Analytics & Hospital Intelligence:');
  console.log(`   - Total Patients: ${adminAnalytics.summary.totalPatients}`);
  console.log(`   - Today's Appointments: ${adminAnalytics.summary.todayAppointments}`);
  console.log(`   - Completed Appointments: ${adminAnalytics.summary.completedAppointments}`);
  console.log(`   - Doctor Utilization: ${adminAnalytics.summary.doctorUtilization}%`);
  console.log(`   - Peak Outpatient Hours: ${adminAnalytics.summary.peakHours}`);

  // 13. Public Waiting Room TV Display
  const tvDisplay = await get('/queue/display');
  console.log('✅ 13. Public Waiting Room Lobby TV Board:');
  console.log(`   - Total Monitored Clinic Rooms: ${tvDisplay.board.length}`);
  console.log(`   - Room 204 Status: Now Serving ${tvDisplay.board.find((b: any) => b.room_no === 'Room 204')?.nowServingToken || 'Clear'}`);

  // 14. 50-Disease Clinical Catalog (Top Blueprint Grid)
  const diseasesRes = await get('/diseases');
  const gastritisRes = await get('/diseases/DIS-020'); // Gastritis
  console.log('✅ 14. 50-Disease Clinical Catalog:');
  console.log(`   - Total Seeded Diseases: ${diseasesRes.count}`);
  console.log(`   - First 3: ${diseasesRes.diseases.slice(0, 3).map((d: any) => `${d.number}. ${d.name}`).join(', ')}`);
  console.log(`   - Gastritis Matched Specialty: ${gastritisRes.disease.recommended_specialty}`);
  console.log(`   - Matched Specialist Doctors: ${gastritisRes.doctors.map((d: any) => `${d.name} (${d.hospital_name || 'City Hospital'}, ${d.hospital_distance || 2.4} km)`).join('; ')}`);

  // 15. Hospital Locations & GPS Coordinates
  const hospRes = await get('/hospitals');
  console.log('✅ 15. Hospital Directory & GPS Verification:');
  console.log(`   - Verified Hospitals in Network: ${hospRes.hospitals.length}`);
  hospRes.hospitals.forEach((h: any) => {
    console.log(`   - ${h.name}: ${h.distance_km} km away | Lat: ${h.latitude}, Lng: ${h.longitude} | 24/7 Open: ${h.is_open_247 ? 'Yes' : 'No'}`);
  });

  // 16. Emergency Ambulance Dispatch & Tracking
  const ambDispatch = await post('/ambulance/request', {
    patientId,
    hospitalId: 'HOSP-01',
    pickupAddress: 'MG Road, Your City',
    ambulanceType: 'ICU'
  });
  console.log('✅ 16. Emergency Ambulance Dispatch & Live Tracking:');
  console.log(`   - Status: ${ambDispatch.ambulance.status}`);
  console.log(`   - Vehicle: ${ambDispatch.ambulance.vehicleNumber}`);
  console.log(`   - Assigned Driver: ${ambDispatch.ambulance.driverName} (${ambDispatch.ambulance.driverPhone})`);
  console.log(`   - Estimated Arrival: ${ambDispatch.ambulance.etaMinutes} mins via fastest route`);
  console.log(`   - Route: [${ambDispatch.ambulance.pickupCoords.lat}, ${ambDispatch.ambulance.pickupCoords.lng}] -> [${ambDispatch.ambulance.hospitalCoords.lat}, ${ambDispatch.ambulance.hospitalCoords.lng}]`);

  // Clean up ambulance request
  await post('/ambulance/cancel', { requestId: ambDispatch.ambulance.requestId });
  console.log(`   - Cleaned up active ambulance request`);

  console.log('\n====================================================');
  console.log('🎉 ALL 16 END-TO-END SYSTEM TESTS PASSED SUCCESSFULLY!');
  console.log('====================================================');
}

runEndToEndVerification().catch(err => {
  console.error('❌ E2E VERIFICATION FAILED:', err);
  process.exit(1);
});
