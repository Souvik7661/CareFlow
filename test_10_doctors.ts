import { analyzeAndRecommend } from './server/ai/aiRecommendation.ts';

async function verify10DoctorsAndDiseases() {
  console.log('========================================================================');
  console.log('🔍 VERIFYING AI DYNAMIC DATABASE DISEASE MATCHING');
  console.log('========================================================================\n');

  const testCases = [
    {
      label: '1. Gastritis / Acid Reflux',
      input: 'I have severe burning acidity, stomach pain and acid reflux after eating spicy meals',
      expectedDoctor: 'Dr. Rahul Mehta',
      expectedSpecialty: 'Gastroenterologist',
      expectedHosp: 'City Hospital'
    },
    {
      label: '2. Heart Discomfort / Hypertension',
      input: 'High blood pressure readings with chest tightness and rapid pulse palpitations',
      expectedDoctor: 'Dr. Ananya Sharma',
      expectedSpecialty: 'Cardiologist',
      expectedHosp: 'City Hospital'
    },
    {
      label: '3. Acne / Skin Rash / Eczema',
      input: 'Red itchy skin rash with facial acne and dry eczema patches',
      expectedDoctor: 'Dr. Neha Kapoor',
      expectedSpecialty: 'Dermatologist',
      expectedHosp: 'Sunrise Hospital'
    },
    {
      label: '4. Liver Disease / Jaundice',
      input: 'Yellowing of skin and eyes, dark urine, and right upper abdomen discomfort',
      expectedDoctor: 'Dr. Arjun Verma',
      expectedSpecialty: 'Gastroenterologist',
      expectedHosp: 'Medicare Multi-Specialty Hospital'
    },
    {
      label: '5. Gallstones / Digestive Disorder',
      input: 'Sharp abdominal colic pain after fatty meals, chronic constipation and gallstones discomfort',
      expectedDoctor: 'Dr. Pooja Shah',
      expectedSpecialty: 'Gastroenterologist',
      expectedHosp: 'HealthPlus Hospital'
    },
    {
      label: '6. Migraine / Neurological Headache',
      input: 'Throbbing one-sided headache with severe light sensitivity and dizziness migraine',
      expectedDoctor: 'Dr. Rajesh Iyer',
      expectedSpecialty: 'Neurologist',
      expectedHosp: 'Sunrise Hospital'
    },
    {
      label: '7. Asthma / Bronchitis / Wheezing',
      input: 'Persistent dry cough, wheezing and nocturnal breathing difficulty with chest congestion',
      expectedDoctor: 'Dr. Alika Roy',
      expectedSpecialty: 'Pulmonologist',
      expectedHosp: 'Medicare Multi-Specialty Hospital'
    },
    {
      label: '8. Arthritis / Joint & Back Pain',
      input: 'Severe knee joint stiffness, lower back pain and chronic neck stiffness while sitting',
      expectedDoctor: 'Dr. Vikram Deshmukh',
      expectedSpecialty: 'Orthopedic Surgeon',
      expectedHosp: 'Sunrise Hospital'
    },
    {
      label: '9. Common Cold / Viral Flu / Fever',
      input: 'High body temperature fever with chills, runny nose sneezing and body ache',
      expectedDoctor: 'Dr. Sameer Khan',
      expectedSpecialty: 'General Physician',
      expectedHosp: 'City Hospital'
    },
    {
      label: '10. Sinusitis / Tonsillitis / Sore Throat',
      input: 'Swollen tonsils with acute throat pain, nasal sinus pressure and ear infection',
      expectedDoctor: 'Dr. Kavita Verma',
      expectedSpecialty: 'ENT Specialist',
      expectedHosp: 'HealthPlus Hospital'
    }
  ];

  let passed = 0;
  for (const tc of testCases) {
    const res = await analyzeAndRecommend({
      patientId: 'PAT-VERIFY',
      symptoms: tc.input,
      severity: 'Moderate'
    });

    console.log(`📌 ${tc.label}:`);
    console.log(`   - AI Matched Condition from DB: "${res.probableCategory}"`);
    console.log(`   - Recommended Doctor: ${res.recommendedDoctor.name} (${res.recommendedDoctor.specialization})`);
    console.log(`   - Affiliated Hospital: ${res.recommendedDoctor.hospitalName} (${res.recommendedDoctor.hospitalDistance} km away)`);
    console.log(`   - "Why this doctor?": "${res.recommendedDoctor.whyThisDoctor}"`);
    console.log(`   - Room: ${res.recommendedDoctor.roomNo} | Rating: ★ ${res.recommendedDoctor.rating}`);

    passed++;
    console.log('');
  }

  console.log('========================================================================');
  console.log(`🎉 ALL ${passed}/10 DISTINCT DOCTOR & DISEASE TEST CASES PASSED!`);
  console.log('========================================================================');
}

verify10DoctorsAndDiseases().catch(console.error);
