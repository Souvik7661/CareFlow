import { Router } from 'express';
import { execute, queryOne, transaction } from '../db/database.ts';
import { analyzeAndRecommend, type PatientFormInput } from '../ai/aiRecommendation.ts';

const router = Router();

router.post('/analyze-and-recommend', async (req, res) => {
  try {
    const {
      patientId,
      symptoms,
      duration,
      severity,
      additionalSymptoms,
      existingConditions,
      currentMedications,
      previousTreatment,
      additionalInformation
    } = req.body;

    if (!patientId || !symptoms || !severity) {
      return res.status(400).json({ error: 'Patient ID, symptoms, and severity are required.' });
    }

    let patient = queryOne('SELECT * FROM patients WHERE patient_id = ?', [patientId]);
    if (!patient) {
      // Allow demo / guest patients to use the AI symptom triage
      patient = queryOne('SELECT * FROM patients WHERE patient_id = ?', ['PAT-001']) ||
                queryOne('SELECT * FROM patients LIMIT 1');
    }
    const resolvedPatientId = patient ? patient.patient_id : patientId;

    // Call AI Module A
    const input: PatientFormInput = {
      patientId,
      symptoms,
      duration: duration || 'Not specified',
      severity,
      additionalSymptoms,
      existingConditions: existingConditions || patient.medical_history,
      currentMedications: currentMedications || patient.current_medications,
      previousTreatment,
      additionalInformation
    };

    const recommendation = await analyzeAndRecommend(input);

    const formId = `FRM-${Date.now()}`;
    const recId = `REC-${Date.now()}`;

    transaction(() => {
      // Save form
      execute(`
        INSERT INTO patient_problem_forms (
          form_id, patient_id, symptoms, duration, severity, additional_symptoms, 
          existing_conditions, current_medications, previous_treatment, additional_information
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        formId,
        resolvedPatientId,
        symptoms,
        input.duration,
        severity,
        additionalSymptoms || '',
        input.existingConditions || '',
        input.currentMedications || '',
        previousTreatment || '',
        additionalInformation || ''
      ]);

      // Save AI recommendation
      execute(`
        INSERT INTO ai_recommendations (
          recommendation_id, patient_id, form_id, probable_category, recommended_specialty, 
          recommended_department, recommended_doctor_id, confidence_level, explanation, 
          emergency_flag, alternative_doctors
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        recId,
        resolvedPatientId,
        formId,
        recommendation.probableCategory,
        recommendation.recommendedSpecialty,
        recommendation.recommendedDepartment.name,
        recommendation.recommendedDoctor.doctorId,
        recommendation.confidenceLevel,
        recommendation.explanation,
        recommendation.emergencyFlag ? 1 : 0,
        JSON.stringify(recommendation.alternativeDoctors)
      ]);
    });

    return res.json({
      formId,
      recommendationId: recId,
      ...recommendation
    });
  } catch (err: any) {
    console.error('[AI] Analysis error:', err);
    return res.status(500).json({ error: 'AI analysis failed: ' + err.message });
  }
});

export default router;
