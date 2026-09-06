import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Moon, Sun, X, Sparkles } from 'lucide-react';
import { User } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import './mascot.css';

interface HoverExplanation {
  title: string;
  category: string;
  description: string;
}

interface CareFlowMascotProps {
  user?: User | null;
}

// Comprehensive clinical knowledge base describing each feature and button
const OPTION_KNOWLEDGE_BASE: Record<string, HoverExplanation> = {

  // Navigation
  'services': {
    title: 'Hospital Services Hub',
    category: 'Care Directory',
    description: 'Explore all available clinical care services, emergency facilities, OPD clinics, and diagnostic labs across the hospital.'
  },
  'ai triage': {
    title: 'AI Clinical Triage & Match',
    category: 'Clinical AI',
    description: 'Describe your symptoms in natural words. Our Clinical AI analyzes probable conditions and matches you with the best specialist doctor!'
  },
  'doctors': {
    title: 'Specialist Doctor Directory',
    category: 'Medical Staff',
    description: 'Browse verified hospital specialist physicians, view qualifications, ratings, OPD consultation timings, and real-time availability.'
  },
  'sign in': {
    title: 'Patient Portal Sign In',
    category: 'Account Access',
    description: 'Log in with your verified credentials to access personal consultation passes, prescriptions, and synchronized medical history.'
  },
  'register': {
    title: 'New Patient Registration',
    category: 'Onboarding',
    description: 'Create your verified digital patient profile in seconds to book appointments and track live queue wait times.'
  },
  'lobby': {
    title: 'Public Waiting Room TV',
    category: 'Live Display',
    description: 'Open the full-screen hospital lobby display showing live token calls, active OPD rooms, and queue updates.'
  },

  // Welcome Hub Quick Actions
  'hospital check-in': {
    title: 'Hospital Self Check-In',
    category: 'Arrival Verification',
    description: 'Verify your physical arrival using your Patient ID or QR pass to immediately notify the OPD doctor and secure your queue turn.'
  },
  'live queue status': {
    title: 'Live Queue & Token Status',
    category: 'Real-Time Monitor',
    description: 'Check real-time estimated wait times, queue token counts, and current doctor consultation progress before entering.'
  },
  'hospital network': {
    title: 'Hospital Network & Bed Availability',
    category: 'Regional Healthcare',
    description: 'View nearby affiliated hospitals, live ICU and general bed availability, trauma center status, and map routing.'
  },
  'my consultations': {
    title: 'My Consultations & Passes',
    category: 'Patient History',
    description: 'View your booked OPD appointments, verified entry tokens, digital passes, and past medical consultation records.'
  },
  'direct book slot': {
    title: 'Direct Specialist Booking',
    category: 'Appointment Scheduling',
    description: 'Directly select your preferred specialist doctor, date, and morning/evening OPD consultation time slot.'
  },
  'emergency ambulance': {
    title: '108 Emergency Ambulance',
    category: 'Critical Dispatch',
    description: 'Rapid 1-tap emergency dispatch with GPS tracking, direct 108 hotline linking, and priority hospital trauma triage.'
  },
  'lobby display': {
    title: 'Lobby Waiting TV Display',
    category: 'Hospital Dashboard',
    description: 'Full-screen waiting room monitor optimized for wall TVs, displaying real-time patient token numbers and clinic availability.'
  },

  // Services Hub
  'opd consultations': {
    title: 'OPD Specialist Consultations',
    category: 'Outpatient Care',
    description: 'Scheduled in-person specialist doctor checkups across Cardiology, Neurology, Pediatrics, Orthopedics, and more.'
  },
  'emergency 24/7': {
    title: '24/7 Trauma & Emergency Care',
    category: 'Urgent Response',
    description: 'Immediate acute critical care, emergency resuscitation, and urgent trauma response open round the clock.'
  },
  'diagnostics & lab': {
    title: 'Pathology & Diagnostic Center',
    category: 'Clinical Testing',
    description: 'Book comprehensive blood tests, ECG, digital X-Ray, CT scans, ultrasound, and receive verified digital reports.'
  },
  'teleconsultation': {
    title: 'Digital Teleconsultation',
    category: 'Virtual Health',
    description: 'Connect with senior hospital doctors from home via secure HD encrypted video consultation and instant e-prescriptions.'
  },

  // Booking & Actions
  'book consultation': {
    title: 'Book OPD Consultation',
    category: 'Booking Action',
    description: 'Select your preferred morning or evening consultation slot and generate your verified hospital entry pass.'
  },
  'choose slot': {
    title: 'Choose Doctor Slot',
    category: 'Scheduling',
    description: 'Select an available morning or afternoon appointment time with this specialist.'
  },
  'find specialist': {
    title: 'Find Specialist Doctor',
    category: 'AI Recommendation',
    description: 'Answer simple clinical questions to be matched with the right medical department.'
  },
  'view profile': {
    title: 'Doctor Medical Profile',
    category: 'Doctor Details',
    description: 'Review doctor qualifications, medical council registration, specialties, experience, and patient ratings.'
  },
  'back': {
    title: 'Return to Previous View',
    category: 'Navigation',
    description: 'Click to return cleanly to the previous service hub or appointment list without losing your session.'
  },
  'confirm': {
    title: 'Confirm & Finalize Booking',
    category: 'Verification',
    description: 'Saves your appointment to the hospital database, assigns a live token, and generates your printable digital pass.'
  }
};

import { TRANSLATIONS } from '../../i18n/translations';

export const CareFlowMascot: React.FC<CareFlowMascotProps> = ({ user }) => {
  const { currentLanguage, t, translateText } = useLanguage();
  const [isSleeping, setIsSleeping] = useState<boolean>(false);
  const [isBubbleDismissed, setIsBubbleDismissed] = useState<boolean>(false);
  const [hoveredOption, setHoveredOption] = useState<HoverExplanation | null>(null);

  const dismissTimeoutRef = useRef<any>(null);

  // Clear hovered option if language changes so new translations render immediately
  useEffect(() => {
    setHoveredOption(null);
  }, [currentLanguage]);

  // Compute personalized greeting exactly matching Picture 1
  const isGeneric = !user?.fullName || user.fullName === 'Valued Patient' || user.fullName === 'Alex Carter' || user.fullName === 'Guest Patient' || user.userId === 'GUEST';
  const patientFirstName = isGeneric ? '' : user.fullName.split(' ')[0];
  const defaultSpeech = patientFirstName
    ? t('mascot.defaultSpeechName', `Hello ${patientFirstName}! 👋 I am Dr. AI, your clinical companion. Select any service below and I'll guide your hospital care visit!`).replace('{name}', patientFirstName)
    : t('mascot.defaultSpeech', "Hello there! 👋 I am Dr. AI, your clinical companion. Select any service below and I'll guide your hospital care visit!");

  // Global hover listener to detect what option the user is examining
  useEffect(() => {
    if (isSleeping) return;

    const resolveElementExplanation = (el: HTMLElement | null): HoverExplanation | null => {
      if (!el) return null;

      // Check explicit data attribute first
      const explicitTip = el.getAttribute('data-robot-tip');
      if (explicitTip) {
        return {
          title: translateText(el.getAttribute('data-robot-title') || el.innerText?.slice(0, 30) || 'CareFlow Option'),
          category: translateText(el.getAttribute('data-robot-cat') || 'Clinical Assistant'),
          description: translateText(explicitTip)
        };
      }

      // Check text content and aria attributes
      const rawText = (el.innerText || el.getAttribute('aria-label') || el.getAttribute('title') || '').toLowerCase().trim();
      if (!rawText) return null;

      const langDict = TRANSLATIONS[currentLanguage]?.mascot;
      const optionsDict = langDict?.options || (langDict?.knowledgeBase as any);

      // Match with knowledge base
      for (const [key, info] of Object.entries(OPTION_KNOWLEDGE_BASE)) {
        if (rawText.includes(key)) {
          if (optionsDict && optionsDict[key]) {
            return {
              title: optionsDict[key].title,
              category: optionsDict[key].category,
              description: optionsDict[key].description
            };
          }
          return {
            title: translateText(info.title),
            category: translateText(info.category),
            description: translateText(info.description)
          };
        }
      }

      // Specialty / Department detection
      if (rawText.includes('cardiology') || rawText.includes('neurology') || rawText.includes('orthopedics') || rawText.includes('pediatrics')) {
        return {
          title: translateText('Specialty Department Filter'),
          category: translateText('Medical Specialties'),
          description: translateText('Filter specialist hospital doctors and OPD consultation clinics by medical specialty.')
        };
      }

      // Input field detection
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        const placeholder = el.getAttribute('placeholder') || 'clinical field';
        return {
          title: translateText('Information Entry Field'),
          category: translateText('Data Input'),
          description: translateText(`Enter your ${placeholder.toLowerCase()} to proceed with your verification or clinical search.`)
        };
      }

      // General button with meaningful text
      if (el.tagName === 'BUTTON' && el.innerText && el.innerText.length < 45 && el.innerText.length > 2) {
        const btnText = el.innerText.trim();
        return {
          title: translateText(btnText),
          category: translateText('Interactive Action'),
          description: translateText(`Click to activate the ${btnText.toLowerCase()} service in your hospital session.`)
        };
      }

      return null;
    };

    const handleMouseOver = (e: MouseEvent) => {
      const targetEl = e.target as HTMLElement;
      if (!targetEl) return;

      if (targetEl.closest('.cf-mascot-station')) {
        return;
      }

      const interactiveEl = targetEl.closest('button, a, [role="button"], .card, .cf-quick-action-btn, .nav-link-btn, input, select') as HTMLElement | null;
      if (!interactiveEl) return;

      const info = resolveElementExplanation(interactiveEl);
      if (info) {
        if (dismissTimeoutRef.current) {
          clearTimeout(dismissTimeoutRef.current);
          dismissTimeoutRef.current = null;
        }
        setHoveredOption(info);
        setIsBubbleDismissed(false);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const targetEl = e.target as HTMLElement;
      if (!targetEl) return;

      const interactiveEl = targetEl.closest('button, a, [role="button"], .card, .cf-quick-action-btn, .nav-link-btn, input, select');
      if (interactiveEl) {
        dismissTimeoutRef.current = setTimeout(() => {
          setHoveredOption(null);
        }, 1200);
      }
    };

    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      if (dismissTimeoutRef.current) clearTimeout(dismissTimeoutRef.current);
    };
  }, [isSleeping, currentLanguage]);

  // Handle direct click on Dr. AI
  const handleDoctorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBubbleDismissed(false);
    setHoveredOption({
      title: t('mascot.companionName', 'Dr. AI • Clinical Concierge'),
      category: t('mascot.statusActive', 'CareFlow Assistant'),
      description: t('mascot.defaultSpeech', "Hello there! 👋 I am Dr. AI, your clinical companion. Select any service below and I'll guide your hospital care visit!")
    });
    if (dismissTimeoutRef.current) clearTimeout(dismissTimeoutRef.current);
    dismissTimeoutRef.current = setTimeout(() => {
      setHoveredOption(null);
    }, 5000);
  };

  const handleSleepToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSleeping(prev => !prev);
  };

  const handleDismissBubble = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBubbleDismissed(true);
  };

  if (isSleeping) {
    return (
      <div 
        className="cf-mascot-docked-pill"
        onClick={handleSleepToggle}
        title="Click to wake Dr. AI Assistant"
      >
        <div className="cf-docked-avatar">
          <img 
            src="/assets/ai_robot_doctor_transparent.png" 
            alt="Dr. AI" 
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/assets/ai_robot_doctor.png';
            }}
          />
        </div>
        <span className="cf-docked-label">{t('mascot.wakeUpTooltip', 'Wake Dr. AI')}</span>
        <Sun size={14} color="#f59e0b" />
      </div>
    );
  }

  return (
    <div className="cf-mascot-station" aria-hidden="false">
      {/* Speech Bubble (Exact design and text from Picture 1) */}
      {!isBubbleDismissed && (
        <div className="cf-mascot-bubble-p1">
          <div className="cf-bubble-p1-row">
            {/* Picture 1 Teal Circular Gradient Message Icon */}
            <div className="cf-bubble-p1-icon">
              <MessageSquare size={17} />
            </div>

            <div className="cf-bubble-p1-content">
              <div className="cf-bubble-p1-header">
                <div className="cf-bubble-p1-title-badge">
                  <span className="cf-bubble-p1-label">
                    {translateText('CareFlow AI Intelligent Concierge')}
                  </span>
                  <span className="cf-bubble-p1-dot" />
                </div>
                <div className="cf-bubble-p1-actions">
                  <button
                    type="button"
                    className="cf-bubble-p1-btn"
                    onClick={handleSleepToggle}
                    title="Put Dr. AI to sleep"
                  >
                    <Moon size={12} />
                  </button>
                  <button
                    type="button"
                    className="cf-bubble-p1-btn"
                    onClick={handleDismissBubble}
                    title="Dismiss message"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>

              {/* Option Title when hovering an option */}
              {hoveredOption && (
                <div className="cf-bubble-p1-opt-title">
                  <span>{hoveredOption.title}</span>
                </div>
              )}

              {/* Dynamic Speech Text (Default from Picture 1 or Option Description) */}
              <p className="cf-bubble-p1-text">
                {hoveredOption ? hoveredOption.description : defaultSpeech}
              </p>

              {hoveredOption && (
                <div className="cf-bubble-p1-hint">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#0d9488', fontWeight: 700 }}>
                    <Sparkles size={11} />
                    <span>{hoveredOption.category}</span>
                  </span>
                  <span>Click option to open</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Static AI Robot Doctor Buddy in Bottom Right Corner (Simple Gentle Float Animation, No 360, No Walking) */}
      <div 
        className="cf-mascot-corner-static"
        onClick={handleDoctorClick}
        title="Dr. AI Clinical Concierge - Hover any option to see what it does!"
      >
        {/* Ambient Ground Pedestal Glow */}
        <div className="cf-corner-pedestal-glow" />

        {/* Synchronized Gentle Breathing Shadow */}
        <div className="cf-corner-ground-shadow" />

        {/* Static Doctor Sprite with Gentle Floating Animation */}
        <div className="cf-corner-static-body">
          <img 
            src="/assets/ai_robot_doctor_transparent.png" 
            alt="Dr. AI Robot Doctor"
            className="cf-corner-static-img"
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src.indexOf('ai_robot_doctor.png') === -1) {
                target.src = '/assets/ai_robot_doctor.png';
              }
            }}
          />
        </div>

        {/* Autonomous Medical AI Status Badge */}
        <div className="cf-doctor-status-badge-p2">
          <span className="cf-bubble-p1-dot" style={{ width: '5px', height: '5px' }} />
          <span>DR. AI ONLINE</span>
        </div>
      </div>
    </div>
  );
};

export default CareFlowMascot;
