import React, { useState } from 'react';
import { User, DoctorRecommendation } from '../../types';
import { api } from '../../services/api';
import { 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Activity, 
  ChevronRight,
  ShieldCheck,
  Building2,
  Stethoscope
} from 'lucide-react';

interface FindDoctorFormProps {
  user: User;
  onRecommendationReceived: (rec: any) => void;
  onCancel: () => void;
}

export const FindDoctorForm: React.FC<FindDoctorFormProps> = ({
  user,
  onRecommendationReceived,
  onCancel
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [symptoms, setSymptoms] = useState('');
  const [duration, setDuration] = useState('A few days (2-5 days)');
  const [severity, setSeverity] = useState<'Mild' | 'Moderate' | 'Severe'>('Moderate');
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [analysisProgress, setAnalysisProgress] = useState(1);

  const symptomChips = [
    'Acidity / Heartburn',
    'Stomach Ache',
    'Chest Tightness',
    'Palpitations',
    'Shortness of Breath',
    'Headache / Migraine',
    'Skin Rash / Itching',
    'Wheezing / Cough',
    'Joint Pain',
    'Nausea / Vomiting',
    'Fever / Chills',
    'Fatigue'
  ];

  const handleChipToggle = (chip: string) => {
    if (selectedChips.includes(chip)) {
      setSelectedChips(selectedChips.filter(c => c !== chip));
    } else {
      setSelectedChips([...selectedChips, chip]);
    }
  };

  const handleSubmitStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim() && selectedChips.length === 0) {
      alert('Please describe your symptoms or select at least one symptom chip.');
      return;
    }

    // Advance to Step 2: AI Analysis
    setStep(2);
    setAnalysisProgress(1);

    // Progressive animation timeline
    const t1 = setTimeout(() => setAnalysisProgress(2), 700);
    const t2 = setTimeout(() => setAnalysisProgress(3), 1500);
    const t3 = setTimeout(() => setAnalysisProgress(4), 2200);

    try {
      const combinedAdditional = selectedChips.join(', ');
      const res = await api.analyzeSymptoms({
        patientId: user.patientId || 'PAT-DEMO',
        symptoms: symptoms || selectedChips.join(', '),
        duration,
        severity,
        additionalSymptoms: combinedAdditional
      });

      // Allow animations to play out
      setTimeout(() => {
        onRecommendationReceived(res);
      }, 2900);
    } catch (err: any) {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      alert('AI triage error: ' + (err.message || 'Unknown error'));
      setStep(1);
    }
  };

  return (
    <div className="blueprint-flow-container">
      {/* Step 1: Describe Your Symptoms */}
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Header matching Blueprint Screen 1 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button 
              className="btn btn-outline btn-sm"
              onClick={onCancel}
              style={{ width: '36px', height: '36px', padding: 0, borderRadius: '50%' }}
            >
              <ArrowLeft size={18} />
            </button>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Describe Your Symptoms</h2>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Step 1 of 4</span>
            </div>
            <div style={{ width: '36px' }} />
          </div>

          <form onSubmit={handleSubmitStep1} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Free-text input matching Screen 1 */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                What are you experiencing?
              </label>
              <textarea
                className="form-input"
                rows={4}
                style={{ resize: 'vertical', fontSize: '0.9rem', lineHeight: '1.4' }}
                placeholder="Describe your symptoms in detail (e.g., severe burning acidity and stomach ache after meals, or persistent wheezing and cough)..."
                value={symptoms}
                onChange={e => setSymptoms(e.target.value)}
              />
            </div>

            {/* Duration Dropdown matching Screen 1 */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                Duration
              </label>
              <select
                className="form-select"
                value={duration}
                onChange={e => setDuration(e.target.value)}
              >
                <option value="Less than 24 hours">Less than 24 hours</option>
                <option value="A few days (2-5 days)">A few days (2-5 days)</option>
                <option value="1-2 weeks">1-2 weeks</option>
                <option value="More than 2 weeks">More than 2 weeks</option>
              </select>
            </div>

            {/* Severity Segmented Toggle matching Screen 1 */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                Severity
              </label>
              <div className="severity-segmented">
                <button
                  type="button"
                  className={`severity-btn ${severity === 'Mild' ? 'selected-mild' : ''}`}
                  onClick={() => setSeverity('Mild')}
                >
                  Mild
                </button>
                <button
                  type="button"
                  className={`severity-btn ${severity === 'Moderate' ? 'selected-moderate' : ''}`}
                  onClick={() => setSeverity('Moderate')}
                >
                  Moderate
                </button>
                <button
                  type="button"
                  className={`severity-btn ${severity === 'Severe' ? 'selected-severe' : ''}`}
                  onClick={() => setSeverity('Severe')}
                >
                  Severe
                </button>
              </div>
            </div>

            {/* Any other symptoms chip selector matching Screen 1 */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                Any other symptoms?
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                {symptomChips.map(chip => {
                  const isSelected = selectedChips.includes(chip);
                  return (
                    <button
                      key={chip}
                      type="button"
                      className={`symptom-chip ${isSelected ? 'active' : ''}`}
                      onClick={() => handleChipToggle(chip)}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {chip}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Next Button matching Screen 1 */}
            <div style={{ marginTop: '10px' }}>
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '1rem',
                  fontWeight: 800,
                  background: '#0d9488',
                  borderRadius: 'var(--radius-lg)'
                }}
              >
                <span>Next</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Step 2: AI Analysis with Circular Radar Pulse & Checklist */}
      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
          {/* Header matching Screen 2 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <button 
              className="btn btn-outline btn-sm"
              onClick={() => setStep(1)}
              style={{ width: '36px', height: '36px', padding: 0, borderRadius: '50%' }}
            >
              <ArrowLeft size={18} />
            </button>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>AI Analysis</h2>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Step 2 of 4</span>
            </div>
            <div style={{ width: '36px' }} />
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '8px' }}>
            Analyzing your symptoms...
          </h3>

          {/* Glowing Circular AI Radar Scanner matching Blueprint Screen 2 */}
          <div className="ai-radar-container">
            <div className="ai-radar-ring ai-radar-ring-1" />
            <div className="ai-radar-ring ai-radar-ring-2" />
            <div className="ai-radar-ring ai-radar-ring-3" />
            <div className="ai-radar-ring ai-radar-ring-4" />
            <div className="ai-radar-sweep" />
            <div className="ai-radar-center">
              AI
            </div>
          </div>

          {/* Progressive Checklist matching Blueprint Screen 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '340px', margin: '0 auto', textAlign: 'left' }}>
            <div className={`ai-checklist-item ${analysisProgress >= 1 ? 'active' : 'pending'}`}>
              <CheckCircle2 size={18} color={analysisProgress >= 1 ? '#0d9488' : '#94a3b8'} />
              <span>Reading your symptoms</span>
            </div>

            <div className={`ai-checklist-item ${analysisProgress >= 2 ? 'active' : 'pending'}`}>
              <CheckCircle2 size={18} color={analysisProgress >= 2 ? '#0d9488' : '#94a3b8'} />
              <span>Analyzing possible conditions from database</span>
            </div>

            <div className={`ai-checklist-item ${analysisProgress >= 3 ? 'active' : 'pending'}`}>
              <CheckCircle2 size={18} color={analysisProgress >= 3 ? '#0d9488' : '#94a3b8'} />
              <span>Matching with verified specialists</span>
            </div>

            <div className={`ai-checklist-item ${analysisProgress >= 4 ? 'active' : 'pending'}`}>
              <CheckCircle2 size={18} color={analysisProgress >= 4 ? '#0d9488' : '#94a3b8'} />
              <span>Finding nearest affiliated hospitals</span>
            </div>
          </div>

          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '28px' }}>
            This may take a few seconds
          </div>
        </div>
      )}
    </div>
  );
};
