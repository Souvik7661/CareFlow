import React, { useState, useEffect, useRef } from 'react';
import { User, DoctorRecommendation, DiseaseItem, Doctor } from './types';
import { api, DEFAULT_DOCTORS } from './services/api';
import { sessionManager } from './services/session';

const DEFAULT_RECOMMENDATION: any = {
  probableCategory: 'Clinical Specialist Consultation',
  recommendedSpecialty: 'Cardiologist',
  confidenceScore: 94,
  recommendedDepartment: {
    id: 'DEP-CARD',
    name: 'Cardiology',
    description: 'Heart & Vascular Care Center',
    wing: 'Block A • Wing 1'
  },
  recommendedDoctor: DEFAULT_DOCTORS[0],
  alternativeDoctors: DEFAULT_DOCTORS.slice(1, 3),
  emergencyFlag: false,
  explanation: 'Based on reported symptoms and AI clinical analysis, an expert physician consultation is recommended.'
};

import { Navigation } from './components/Navigation';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/auth/AuthModal';

import { PatientDashboard } from './components/patient/PatientDashboard';
import { FindDoctorForm } from './components/patient/FindDoctorForm';
import { RecommendationAndBooking } from './components/patient/RecommendationAndBooking';
import { AppointmentConfirmation } from './components/patient/AppointmentConfirmation';
import { CheckInScreen } from './components/patient/CheckInScreen';
import { LiveQueueScreen } from './components/patient/LiveQueueScreen';
import { MyAppointments } from './components/patient/MyAppointments';
import { MedicalHistory } from './components/patient/MedicalHistory';

// Blueprint New Components
import { DiseaseCatalogGrid } from './components/catalog/DiseaseCatalogGrid';
import { DoctorListScreen } from './components/patient/DoctorListScreen';
import { DirectBookingScreen } from './components/patient/DirectBookingScreen';
import { DoctorProfileScreen } from './components/patient/DoctorProfileScreen';
import { NearestHospitalMap } from './components/hospital/NearestHospitalMap';
import { AmbulanceServiceScreen } from './components/ambulance/AmbulanceServiceScreen';
import { TeleconsultationModal } from './components/teleconsult/TeleconsultationModal';

import { DoctorDashboard } from './components/doctor/DoctorDashboard';
import { ReceptionistDashboard } from './components/reception/ReceptionistDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { WaitingRoomDisplay } from './components/display/WaitingRoomDisplay';
import { HealthStatusScreen } from './components/patient/HealthStatusScreen';

// Core User Flow Components
import { SplashScreen } from './components/splash/SplashScreen';
import { WelcomeServiceHub } from './components/hub/WelcomeServiceHub';
import { RedirectingScreen } from './components/loading/RedirectingScreen';
import { PatientTokenWindow } from './components/patient/PatientTokenWindow';
import { CareFlowMascot } from './components/companion/CareFlowMascot';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { LanguageSelectionModal } from './components/language/LanguageSelectionModal';
import { LanguageTransitionLoader } from './components/language/LanguageTransitionLoader';

interface NavEntry {
  view: string;
  selectedDoctorForProfile?: any;
  bookingDoctorId?: string;
  selectedHospitalForAmbulance?: string;
  prefilledCheckInId?: string | null;
  currentRecommendation?: DoctorRecommendation | null;
}

const AppContent: React.FC = () => {
  const { isLanguageModalOpen, openLanguageModal, closeLanguageModal } = useLanguage();
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('careflow_theme') as 'light' | 'dark') || 'light';
  });
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<string>('welcome-hub');
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'register' }>({
    isOpen: false,
    mode: 'login'
  });
  const [redirectingService, setRedirectingService] = useState<'doctors' | 'book-appointment' | 'support' | null>(null);

  const [currentRecommendation, setCurrentRecommendation] = useState<DoctorRecommendation | null>(null);
  const [latestAppointment, setLatestAppointment] = useState<any | null>(null);
  const [prefilledCheckInId, setPrefilledCheckInId] = useState<string | null>(null);

  // Blueprint state
  const [selectedDoctorForProfile, setSelectedDoctorForProfile] = useState<any | null>(null);
  const [bookingDoctorId, setBookingDoctorId] = useState<string | undefined>(undefined);
  const [selectedHospitalForAmbulance, setSelectedHospitalForAmbulance] = useState<string>('HOSP-01');
  const [isTeleconsultOpen, setIsTeleconsultOpen] = useState(false);

  // Navigation History Stack
  const [historyStack, setHistoryStack] = useState<NavEntry[]>([]);
  const historyStackRef = useRef<NavEntry[]>([]);
  historyStackRef.current = historyStack;
  const currentViewRef = useRef<string>(currentView);
  currentViewRef.current = currentView;

  // Sync theme to DOM & localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('careflow_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const getDefaultHome = (user: User | null = currentUser) => {
    if (!user) return 'welcome-hub';
    if (user.role === 'DOCTOR') return 'doctor-dashboard';
    if (user.role === 'RECEPTIONIST') return 'reception-dashboard';
    if (user.role === 'ADMIN') return 'admin-dashboard';
    return 'welcome-hub';
  };

  const navigateTo = (nextView: string, extra: Partial<NavEntry> = {}, replace: boolean = false) => {
    if (nextView === currentViewRef.current) return;

    if (!replace) {
      const currentEntry: NavEntry = {
        view: currentViewRef.current,
        selectedDoctorForProfile,
        bookingDoctorId,
        selectedHospitalForAmbulance,
        prefilledCheckInId,
        currentRecommendation
      };
      setHistoryStack(prev => [...prev, currentEntry]);
    }

    try {
      window.history.pushState({ view: nextView, ...extra }, '', `#${nextView}`);
    } catch (e) {}

    if (extra.selectedDoctorForProfile !== undefined) setSelectedDoctorForProfile(extra.selectedDoctorForProfile);
    if (extra.bookingDoctorId !== undefined) setBookingDoctorId(extra.bookingDoctorId);
    if (extra.selectedHospitalForAmbulance !== undefined) setSelectedHospitalForAmbulance(extra.selectedHospitalForAmbulance);
    if (extra.prefilledCheckInId !== undefined) setPrefilledCheckInId(extra.prefilledCheckInId);
    if (extra.currentRecommendation !== undefined) setCurrentRecommendation(extra.currentRecommendation);

    setCurrentView(nextView);
  };

  const goBack = (fromPopState: boolean = false) => {
    const stack = historyStackRef.current;
    if (stack.length > 0) {
      const prevEntry = stack[stack.length - 1];
      setHistoryStack(prev => prev.slice(0, -1));

      if (prevEntry.selectedDoctorForProfile !== undefined) setSelectedDoctorForProfile(prevEntry.selectedDoctorForProfile);
      if (prevEntry.bookingDoctorId !== undefined) setBookingDoctorId(prevEntry.bookingDoctorId);
      if (prevEntry.selectedHospitalForAmbulance !== undefined) setSelectedHospitalForAmbulance(prevEntry.selectedHospitalForAmbulance);
      if (prevEntry.prefilledCheckInId !== undefined) setPrefilledCheckInId(prevEntry.prefilledCheckInId);
      if (prevEntry.currentRecommendation !== undefined) setCurrentRecommendation(prevEntry.currentRecommendation);

      setCurrentView(prevEntry.view);

      if (!fromPopState) {
        try {
          window.history.pushState({ view: prevEntry.view }, '', `#${prevEntry.view}`);
        } catch (e) {}
      }
    } else {
      const home = getDefaultHome();
      setCurrentView(home);
      if (!fromPopState) {
        try {
          window.history.pushState({ view: home }, '', `#${home}`);
        } catch (e) {}
      }
    }
  };

  const handleGoBack = () => {
    goBack(false);
  };

  // Browser back / forward button listener
  useEffect(() => {
    const handlePopState = () => {
      goBack(true);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Initialize session on load
  useEffect(() => {
    const token = sessionManager.getToken();
    if (token) {
      api.getMe()
        .then(res => {
          setCurrentUser(res.user);
          sessionManager.setUser(res.user);
          if (res.user.role === 'DOCTOR') setCurrentView('doctor-dashboard');
          else if (res.user.role === 'RECEPTIONIST') setCurrentView('reception-dashboard');
          else if (res.user.role === 'ADMIN') setCurrentView('admin-dashboard');
          else setCurrentView('welcome-hub');
        })
        .catch(() => {
          sessionManager.clearSession();
          setCurrentUser(null);
          setCurrentView('welcome-hub');
        });
    } else {
      sessionManager.clearSession();
      setCurrentUser(null);
      setCurrentView('welcome-hub');
    }
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
    const token = sessionManager.getToken();
    if (!token && !currentUser) {
      // Per specification: before entering the login screen/popup, language selection popup appears
      openLanguageModal();
    }
  };

  const handleAuthSuccess = (user: User, token: string, remember: boolean = false) => {
    sessionManager.setToken(token, remember);
    sessionManager.setUser(user, remember);
    setCurrentUser(user);
    setAuthModal({ isOpen: false, mode: 'login' });
    setHistoryStack([]);
    if (user.role === 'DOCTOR') setCurrentView('doctor-dashboard');
    else if (user.role === 'RECEPTIONIST') setCurrentView('reception-dashboard');
    else if (user.role === 'ADMIN') setCurrentView('admin-dashboard');
    else setCurrentView('welcome-hub');
  };

  // Instant 1-Click Role Switcher Handler
  const handleRoleSwitch = async (role: string, doctorId?: string) => {
    try {
      const res = await api.demoLogin(role, doctorId);
      sessionManager.setToken(res.token, false);
      sessionManager.setUser(res.user, false);
      setCurrentUser(res.user);
      setHistoryStack([]);

      if (role === 'PATIENT') {
        setCurrentView('welcome-hub');
      } else if (role === 'DOCTOR') {
        setCurrentView('doctor-dashboard');
      } else if (role === 'RECEPTIONIST') {
        setCurrentView('reception-dashboard');
      } else if (role === 'ADMIN') {
        setCurrentView('admin-dashboard');
      }
    } catch (err) {
      console.error('Failed to switch role:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (err) {}
    sessionManager.clearSession();
    setCurrentUser(null);
    setHistoryStack([]);
    setCurrentView('welcome-hub');
    setAuthModal({ isOpen: false, mode: 'login' });
  };

  const handleRedirectComplete = () => {
    const service = redirectingService;
    setRedirectingService(null);
    if (service === 'doctors') {
      navigateTo('doctor-list');
    } else if (service === 'book-appointment') {
      setBookingDoctorId(undefined);
      navigateTo('direct-booking');
    } else if (service === 'support') {
      navigateTo('ambulance');
    }
  };

  // 2-Second Dedicated Logo Splash Screen on Opening (Zero background leakage)
  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  // If waiting room TV mode is active, render full-screen monitor view
  if (currentView === 'waiting-tv') {
    return (
      <WaitingRoomDisplay 
        onBack={goBack} 
      />
    );
  }

  return (
    <div className="app-container">

      {/* 2-Second Redirection Loading Screen */}
      {redirectingService && (
        <RedirectingScreen 
          targetService={redirectingService}
          onComplete={handleRedirectComplete}
        />
      )}

      {/* Navigation Header */}
      <Navigation 
        currentUser={currentUser}
        currentView={currentView}
        theme={theme}
        onToggleTheme={toggleTheme}
        onNavigate={(v) => navigateTo(v)}
        onRoleSwitch={handleRoleSwitch}
        onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })}
        onLogout={handleLogout}
      />

      {/* Auth Modal for Login / Sign In */}
      <AuthModal 
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
        onSuccess={handleAuthSuccess}
      />

      {/* Main View Area */}
      <main className="main-content">
        {/* Welcome Hub with AI Animated Doctor & Direct Quick Actions */}
        {(currentView === 'welcome-hub' || currentView === 'landing' || currentView === 'dashboard') && (
          <WelcomeServiceHub 
            user={currentUser || { userId: 'GUEST', fullName: 'Guest Patient', email: '', role: 'PATIENT' }}
            onSelectService={(srv) => setRedirectingService(srv)}
            onOpenTokenWindow={() => {
              if (!currentUser) {
                setAuthModal({ isOpen: true, mode: 'login' });
              } else {
                navigateTo('token-window');
              }
            }}
            onNavigate={(v) => navigateTo(v)}
          />
        )}

        {/* Patient Token & Assigned Doctor Window (Opened on Logo Click) */}
        {currentView === 'token-window' && (
          currentUser ? (
            <PatientTokenWindow 
              user={currentUser}
              onBack={handleGoBack}
              onGoToLiveQueue={() => navigateTo('live-queue')}
              onBookNew={() => navigateTo('direct-booking')}
            />
          ) : (
            <div style={{ maxWidth: '600px', margin: '60px auto', textAlign: 'center', padding: '30px', background: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>Sign in to View Your Digital Token</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Please sign in with your account to view your active OPD token pass and live queue position.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button className="btn btn-primary" onClick={() => setAuthModal({ isOpen: true, mode: 'login' })}>
                  Sign In
                </button>
                <button className="btn btn-outline" onClick={handleGoBack}>
                  Go Back
                </button>
              </div>
            </div>
          )
        )}

        {/* Doctor List (Screen 3: Find Doctors) */}
        {(currentView === 'doctor-list' || currentView === 'find-doctors') && (
          <DoctorListScreen 
            onSelectDoctor={(doc) => {
              navigateTo('doctor-profile', { selectedDoctorForProfile: doc });
            }}
            onBookDoctor={(doc) => {
              const docId = doc.doctor_id || (doc as any).doctorId;
              navigateTo('direct-booking', { bookingDoctorId: docId });
            }}
            onBack={handleGoBack}
          />
        )}

        {/* Dedicated Appointment Booking Screen (Direct booking flow) */}
        {currentView === 'direct-booking' && (
          <DirectBookingScreen 
            currentUser={currentUser}
            initialDoctorId={bookingDoctorId}
            onBack={handleGoBack}
            onBookingSuccess={(appt) => {
              setLatestAppointment(appt);
              navigateTo('confirmation');
            }}
          />
        )}

        {/* Doctor Profile & Schedule (Screen 4 of Blueprint: Book Appointment) */}
        {currentView === 'doctor-profile' && selectedDoctorForProfile && (
          <DoctorProfileScreen 
            doctor={selectedDoctorForProfile}
            user={currentUser || { userId: 'GUEST', fullName: 'Guest Patient', email: '', role: 'PATIENT' }}
            onBack={handleGoBack}
            onBookSlot={async (slot) => {
              if (!currentUser) {
                setAuthModal({ isOpen: true, mode: 'login' });
                return;
              }
              try {
                const todayStr = new Date().toISOString().split('T')[0];
                const patientId = currentUser.patientId || `PAT-2026-${Math.floor(10000 + Math.random() * 90000)}`;
                const patientName = currentUser.fullName || 'Patient';
                const doctorName = selectedDoctorForProfile.name || 'Dr. Ananya Sharma';
                const departmentName = selectedDoctorForProfile.departmentName || selectedDoctorForProfile.department_name || 'Cardiology';
                const roomNo = selectedDoctorForProfile.roomNo || selectedDoctorForProfile.room_no || 'Room 204';
                const roomWing = selectedDoctorForProfile.roomWing || selectedDoctorForProfile.room_wing || selectedDoctorForProfile.wing || 'Block A • OPD Wing';

                const res = await api.bookAppointment({
                  patientId,
                  patientName,
                  doctorId: selectedDoctorForProfile.doctorId || selectedDoctorForProfile.doctor_id || 'DOC-CARD-01',
                  departmentId: selectedDoctorForProfile.departmentId || selectedDoctorForProfile.department_id || 'DEP-CARD',
                  appointmentDate: todayStr,
                  appointmentTime: slot,
                  reason: `Consultation with ${doctorName}`
                });

                const fullAppt = {
                  ...res.appointment,
                  appointmentId: res.appointment?.appointmentId || res.appointment?.appointment_id || `APT-2026-${Math.floor(10000 + Math.random() * 90000)}`,
                  appointment_id: res.appointment?.appointmentId || res.appointment?.appointment_id || `APT-2026-${Math.floor(10000 + Math.random() * 90000)}`,
                  patientId,
                  patient_id: patientId,
                  patientName,
                  patient_name: patientName,
                  doctorId: selectedDoctorForProfile.doctorId || selectedDoctorForProfile.doctor_id,
                  doctor_id: selectedDoctorForProfile.doctorId || selectedDoctorForProfile.doctor_id,
                  doctorName,
                  doctor_name: doctorName,
                  departmentName,
                  department_name: departmentName,
                  roomNo,
                  room_no: roomNo,
                  wing: roomWing,
                  room_wing: roomWing,
                  appointmentDate: todayStr,
                  appointment_date: todayStr,
                  appointmentTime: slot,
                  appointment_time: slot,
                  tokenNumber: res.appointment?.tokenNumber || res.appointment?.token_number || '#1',
                  token_number: res.appointment?.tokenNumber || res.appointment?.token_number || '#1',
                  status: 'CONFIRMED'
                };

                try {
                  localStorage.setItem('careflow_latest_appointment', JSON.stringify(fullAppt));
                } catch (e) {}

                setLatestAppointment(fullAppt);
                navigateTo('confirmation');
              } catch (err: any) {
                alert('Booking failed: ' + (err.message || 'Unknown error'));
              }
            }}
            onOpenTeleconsult={() => setIsTeleconsultOpen(true)}
            onOpenHospitalMap={() => navigateTo('hospitals-map')}
          />
        )}

        {/* Nearest Hospitals Map (Screen 6 of Blueprint) */}
        {currentView === 'hospitals-map' && (
          <NearestHospitalMap 
            onBack={handleGoBack}
            onOpenAmbulance={(hospId) => {
              navigateTo('ambulance', { selectedHospitalForAmbulance: hospId });
            }}
            onBookDoctor={(doc) => {
              const docId = doc.doctor_id || (doc as any).doctorId;
              navigateTo('direct-booking', { bookingDoctorId: docId });
            }}
          />
        )}

        {/* Emergency Ambulance Service (Screen 7 of Blueprint) */}
        {currentView === 'ambulance' && (
          <AmbulanceServiceScreen 
            defaultHospitalId={selectedHospitalForAmbulance}
            onBack={handleGoBack}
          />
        )}

        {/* AI Health-Problem Form / AI Triage & Match (Screen 1 & 2 of Blueprint) */}
        {(currentView === 'find-doctor' || currentView === 'ai-triage') && (
          <FindDoctorForm 
            user={currentUser || { userId: 'GUEST', fullName: 'Guest Patient', email: '', role: 'PATIENT' }}
            onRecommendationReceived={(rec) => {
              const matchedDoc = rec?.recommendedDoctor || rec?.recommendedDoctors?.[0] || DEFAULT_DOCTORS[0];
              navigateTo('recommendation', {
                currentRecommendation: rec,
                selectedDoctorForProfile: matchedDoc
              });
            }}
            onCancel={handleGoBack}
          />
        )}

        {/* AI Recommendation (Screen 3 of Blueprint) */}
        {currentView === 'recommendation' && (
          <RecommendationAndBooking 
            user={currentUser || { userId: 'GUEST', fullName: 'Guest Patient', email: '', role: 'PATIENT' }}
            recommendation={currentRecommendation || DEFAULT_RECOMMENDATION}
            onProceedToProfile={(doc) => {
              navigateTo('doctor-profile', { selectedDoctorForProfile: doc || DEFAULT_DOCTORS[0] });
            }}
            onViewAllDoctors={() => navigateTo('doctor-list')}
            onBack={handleGoBack}
          />
        )}

        {/* Appointment Confirmation */}
        {currentView === 'confirmation' && latestAppointment && (
          <AppointmentConfirmation 
            appointment={latestAppointment}
            onGoToCheckIn={() => {
              const aptId = latestAppointment.appointmentId || latestAppointment.appointment_id;
              navigateTo('checkin', { prefilledCheckInId: aptId });
            }}
            onGoToMyAppointments={() => navigateTo('my-appointments')}
            onGoToLiveQueue={() => navigateTo('live-queue')}
            onGoToDashboard={() => navigateTo(getDefaultHome())}
          />
        )}

        {/* Manual Hospital Check-In */}
        {currentView === 'checkin' && (
          currentUser ? (
            <CheckInScreen 
              user={currentUser}
              initialAppointmentId={prefilledCheckInId}
              onBack={handleGoBack}
              onCheckInSuccess={() => navigateTo('live-queue')}
            />
          ) : (
            <div style={{ maxWidth: '600px', margin: '60px auto', textAlign: 'center', padding: '30px', background: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>Sign in to Check In</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Please sign in with your account to check in for your scheduled hospital appointment.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button className="btn btn-primary" onClick={() => setAuthModal({ isOpen: true, mode: 'login' })}>
                  Sign In
                </button>
                <button className="btn btn-outline" onClick={handleGoBack}>
                  Go Back
                </button>
              </div>
            </div>
          )
        )}

        {/* Live Queue Radar Screen */}
        {currentView === 'live-queue' && (
          currentUser ? (
            <LiveQueueScreen 
              user={currentUser}
              onBack={handleGoBack}
              onGoToCheckIn={() => navigateTo('checkin')}
            />
          ) : (
            <div style={{ maxWidth: '600px', margin: '60px auto', textAlign: 'center', padding: '30px', background: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>Sign in to View Live Queue</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Please sign in to track your queue position and projected consultation time.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button className="btn btn-primary" onClick={() => setAuthModal({ isOpen: true, mode: 'login' })}>
                  Sign In
                </button>
                <button className="btn btn-outline" onClick={handleGoBack}>
                  Go Back
                </button>
              </div>
            </div>
          )
        )}

        {/* Patient Appointments */}
        {currentView === 'my-appointments' && (
          currentUser ? (
            <MyAppointments 
              user={currentUser}
              onBookNew={() => navigateTo('direct-booking')}
              onGoToCheckIn={(aptId) => {
                if (aptId) setPrefilledCheckInId(aptId);
                navigateTo('checkin');
              }}
              onGoToLiveQueue={() => navigateTo('live-queue')}
              onBack={handleGoBack}
            />
          ) : (
            <div style={{ maxWidth: '600px', margin: '60px auto', textAlign: 'center', padding: '30px', background: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>Sign in to View Appointments</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Please sign in to access your previous appointment records and hospital passes.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button className="btn btn-primary" onClick={() => setAuthModal({ isOpen: true, mode: 'login' })}>
                  Sign In
                </button>
                <button className="btn btn-outline" onClick={handleGoBack}>
                  Go Back
                </button>
              </div>
            </div>
          )
        )}

        {/* Health Status (Screen 5 of Blueprint) */}
        {currentView === 'health-status' && (
          <HealthStatusScreen 
            onBack={handleGoBack}
            onNavigate={(v) => navigateTo(v)}
          />
        )}

        {/* Patient Medical History & Prescriptions (Screen 6 of Blueprint) */}
        {currentView === 'medical-history' && currentUser && (
          <MedicalHistory 
            user={currentUser}
            onBack={handleGoBack}
          />
        )}

        {/* Doctor Dashboard */}
        {currentView === 'doctor-dashboard' && currentUser && (
          <DoctorDashboard 
            user={currentUser}
            onDoctorSwitch={(newDocId) => {
              setCurrentUser(prev => prev ? { ...prev, doctorId: newDocId } : null);
            }}
          />
        )}

        {/* Receptionist Dashboard */}
        {currentView === 'reception-dashboard' && currentUser && (
          <ReceptionistDashboard 
            user={currentUser}
          />
        )}

        {/* Admin Dashboard */}
        {currentView === 'admin-dashboard' && currentUser && (
          <AdminDashboard 
            user={currentUser}
          />
        )}
      </main>

      {/* Free Teleconsultation Modal (Screen 8 of Blueprint) */}
      {isTeleconsultOpen && (
        <TeleconsultationModal 
          doctorName={selectedDoctorForProfile?.name || 'Dr. Rahul Mehta'}
          specialization={selectedDoctorForProfile?.specialization || 'Gastroenterologist'}
          onClose={() => setIsTeleconsultOpen(false)}
        />
      )}

      {/* Multilingual Selection Modal */}
      <LanguageSelectionModal 
        isOpen={isLanguageModalOpen}
        onClose={closeLanguageModal}
        allowClose={Boolean(currentUser)}
        onSelectLanguage={() => {
          closeLanguageModal();
          setCurrentView('welcome-hub');
          setAuthModal({ isOpen: false, mode: 'login' });
        }}
      />

      {/* 1-Second Multilingual Transition Loading Screen */}
      <LanguageTransitionLoader />

      {/* CareFlow AI 360° Stationed Doctor & Hover Assistant */}
      <CareFlowMascot user={currentUser} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;
