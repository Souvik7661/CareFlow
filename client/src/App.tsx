import React, { useState, useEffect } from 'react';
import { User, DoctorRecommendation, DiseaseItem, Doctor } from './types';
import { api } from './services/api';

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

export const App: React.FC = () => {
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

  // Sync theme to DOM & localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('careflow_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Initialize session on load
  useEffect(() => {
    const token = localStorage.getItem('careflow_token');
    if (token) {
      api.getMe()
        .then(res => {
          setCurrentUser(res.user);
          if (res.user.role === 'DOCTOR') setCurrentView('doctor-dashboard');
          else if (res.user.role === 'RECEPTIONIST') setCurrentView('reception-dashboard');
          else if (res.user.role === 'ADMIN') setCurrentView('admin-dashboard');
          else setCurrentView('welcome-hub');
        })
        .catch(() => {
          localStorage.removeItem('careflow_token');
          setCurrentView('welcome-hub');
        });
    } else {
      setCurrentView('welcome-hub');
    }
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
    const token = localStorage.getItem('careflow_token');
    if (!token && !currentUser) {
      setAuthModal({ isOpen: true, mode: 'login' });
    }
  };

  const handleAuthSuccess = (user: User, token: string) => {
    setCurrentUser(user);
    setAuthModal({ isOpen: false, mode: 'login' });
    if (user.role === 'DOCTOR') setCurrentView('doctor-dashboard');
    else if (user.role === 'RECEPTIONIST') setCurrentView('reception-dashboard');
    else if (user.role === 'ADMIN') setCurrentView('admin-dashboard');
    else setCurrentView('welcome-hub');
  };

  // Instant 1-Click Role Switcher Handler
  const handleRoleSwitch = async (role: string, doctorId?: string) => {
    try {
      const res = await api.demoLogin(role, doctorId);
      localStorage.setItem('careflow_token', res.token);
      setCurrentUser(res.user);

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
    localStorage.removeItem('careflow_token');
    setCurrentUser(null);
    setCurrentView('welcome-hub');
    setAuthModal({ isOpen: true, mode: 'login' });
  };

  const handleRedirectComplete = () => {
    const service = redirectingService;
    setRedirectingService(null);
    if (service === 'doctors') {
      setCurrentView('doctor-list');
    } else if (service === 'book-appointment') {
      setBookingDoctorId(undefined);
      setCurrentView('direct-booking');
    } else if (service === 'support') {
      setCurrentView('ambulance');
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
        onBack={() => setCurrentView(currentUser ? (currentUser.role === 'DOCTOR' ? 'doctor-dashboard' : (currentUser.role === 'RECEPTIONIST' ? 'reception-dashboard' : (currentUser.role === 'ADMIN' ? 'admin-dashboard' : 'welcome-hub'))) : 'welcome-hub')} 
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
        onNavigate={setCurrentView}
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
        {/* Welcome Hub with AI Animated Doctor & 3 Service Options */}
        {(currentView === 'welcome-hub' || currentView === 'landing') && (
          <WelcomeServiceHub 
            user={currentUser || { userId: 'USR-PAT-01', patientId: 'PAT-2026-00101', fullName: 'Alex Carter', email: 'alex.carter@careflow.com', role: 'PATIENT' }}
            onSelectService={(srv) => setRedirectingService(srv)}
            onOpenTokenWindow={() => setCurrentView('token-window')}
          />
        )}

        {/* Patient Token & Assigned Doctor Window (Opened on Logo Click) */}
        {currentView === 'token-window' && (
          <PatientTokenWindow 
            user={currentUser || { userId: 'USR-PAT-01', patientId: 'PAT-2026-00101', fullName: 'Alex Carter', email: 'alex.carter@careflow.com', role: 'PATIENT' }}
            onBack={() => setCurrentView('welcome-hub')}
            onGoToLiveQueue={() => setCurrentView('live-queue')}
            onBookNew={() => setCurrentView('find-doctor')}
          />
        )}

        {/* Doctor List (Screen 3: Find Doctors) */}
        {(currentView === 'doctor-list' || currentView === 'find-doctors') && (
          <DoctorListScreen 
            onSelectDoctor={(doc) => {
              setSelectedDoctorForProfile(doc);
              setCurrentView('doctor-profile');
            }}
            onBookDoctor={(doc) => {
              setBookingDoctorId(doc.doctor_id || (doc as any).doctorId);
              setCurrentView('direct-booking');
            }}
            onBack={() => setCurrentView('welcome-hub')}
          />
        )}

        {/* Dedicated Appointment Booking Screen (Direct booking flow) */}
        {currentView === 'direct-booking' && (
          <DirectBookingScreen 
            currentUser={currentUser}
            initialDoctorId={bookingDoctorId}
            onBack={() => setCurrentView('welcome-hub')}
            onBookingSuccess={(appt) => {
              setLatestAppointment(appt);
              setCurrentView('confirmation');
            }}
          />
        )}

        {/* Doctor Profile & Schedule (Screen 4 of Blueprint: Book Appointment) */}
        {currentView === 'doctor-profile' && selectedDoctorForProfile && currentUser && (
          <DoctorProfileScreen 
            doctor={selectedDoctorForProfile}
            user={currentUser}
            onBack={() => setCurrentView('find-doctors')}
            onBookSlot={async (slot) => {
              try {
                const todayStr = new Date().toISOString().split('T')[0];
                const res = await api.bookAppointment({
                  patientId: currentUser.patientId || 'PAT-DEMO',
                  doctorId: selectedDoctorForProfile.doctorId || selectedDoctorForProfile.doctor_id,
                  departmentId: selectedDoctorForProfile.departmentId || selectedDoctorForProfile.department_id || 'DEP-GAST',
                  appointmentDate: todayStr,
                  appointmentTime: slot,
                  reason: `Consultation with ${selectedDoctorForProfile.name}`
                });
                setLatestAppointment(res.appointment);
                setCurrentView('confirmation');
              } catch (err: any) {
                alert('Booking failed: ' + err.message);
              }
            }}
            onOpenTeleconsult={() => setIsTeleconsultOpen(true)}
            onOpenHospitalMap={() => setCurrentView('hospitals-map')}
          />
        )}

        {/* Nearest Hospitals Map (Screen 6 of Blueprint) */}
        {currentView === 'hospitals-map' && (
          <NearestHospitalMap 
            onBack={() => setCurrentView(currentUser ? 'dashboard' : 'landing')}
            onOpenAmbulance={(hospId) => {
              setSelectedHospitalForAmbulance(hospId);
              setCurrentView('ambulance');
            }}
          />
        )}

        {/* Emergency Ambulance Service (Screen 7 of Blueprint) */}
        {currentView === 'ambulance' && (
          <AmbulanceServiceScreen 
            defaultHospitalId={selectedHospitalForAmbulance}
            onBack={() => setCurrentView(currentUser ? 'dashboard' : 'landing')}
          />
        )}

        {/* Patient Dashboard */}
        {currentView === 'dashboard' && currentUser && (
          <PatientDashboard 
            user={currentUser}
            onNavigate={setCurrentView}
          />
        )}

        {/* AI Health-Problem Form (Screen 1 & 2 of Blueprint) */}
        {currentView === 'find-doctor' && currentUser && (
          <FindDoctorForm 
            user={currentUser}
            onRecommendationReceived={(rec) => {
              setCurrentRecommendation(rec);
              setSelectedDoctorForProfile(rec.recommendedDoctor);
              setCurrentView('recommendation');
            }}
            onCancel={() => setCurrentView('dashboard')}
          />
        )}

        {/* AI Recommendation (Screen 3 of Blueprint) */}
        {currentView === 'recommendation' && currentUser && currentRecommendation && (
          <RecommendationAndBooking 
            user={currentUser}
            recommendation={currentRecommendation}
            onProceedToProfile={(doc) => {
              setSelectedDoctorForProfile(doc);
              setCurrentView('doctor-profile');
            }}
            onViewAllDoctors={() => setCurrentView('doctor-list')}
            onBack={() => setCurrentView('find-doctor')}
          />
        )}

        {/* Appointment Confirmation */}
        {currentView === 'confirmation' && latestAppointment && (
          <AppointmentConfirmation 
            appointment={latestAppointment}
            onGoToCheckIn={() => {
              setPrefilledCheckInId(latestAppointment.appointmentId);
              setCurrentView('checkin');
            }}
            onGoToMyAppointments={() => setCurrentView('my-appointments')}
            onGoToDashboard={() => setCurrentView('dashboard')}
          />
        )}

        {/* Manual Hospital Check-In */}
        {currentView === 'checkin' && currentUser && (
          <CheckInScreen 
            user={currentUser}
            onCheckInSuccess={() => setCurrentView('live-queue')}
          />
        )}

        {/* Live Queue Radar Screen */}
        {currentView === 'live-queue' && currentUser && (
          <LiveQueueScreen 
            user={currentUser}
            onGoToCheckIn={() => setCurrentView('checkin')}
          />
        )}

        {/* Patient Appointments */}
        {currentView === 'my-appointments' && currentUser && (
          <MyAppointments 
            user={currentUser}
            onBookNew={() => setCurrentView('disease-catalog')}
            onGoToCheckIn={(aptId) => {
              if (aptId) setPrefilledCheckInId(aptId);
              setCurrentView('checkin');
            }}
            onGoToLiveQueue={() => setCurrentView('live-queue')}
          />
        )}

        {/* Health Status (Screen 5 of Blueprint) */}
        {currentView === 'health-status' && (
          <HealthStatusScreen 
            onBack={() => setCurrentView('dashboard')}
            onNavigate={setCurrentView}
          />
        )}

        {/* Patient Medical History & Prescriptions (Screen 6 of Blueprint) */}
        {currentView === 'medical-history' && currentUser && (
          <MedicalHistory 
            user={currentUser}
            onBack={() => setCurrentView('dashboard')}
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

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
        onSuccess={(user) => {
          setCurrentUser(user);
          if (user.role === 'DOCTOR') setCurrentView('doctor-dashboard');
          else if (user.role === 'RECEPTIONIST') setCurrentView('reception-dashboard');
          else if (user.role === 'ADMIN') setCurrentView('admin-dashboard');
          else setCurrentView('dashboard');
        }}
      />

      {/* Free Teleconsultation Modal (Screen 8 of Blueprint) */}
      {isTeleconsultOpen && (
        <TeleconsultationModal 
          doctorName={selectedDoctorForProfile?.name || 'Dr. Rahul Mehta'}
          specialization={selectedDoctorForProfile?.specialization || 'Gastroenterologist'}
          onClose={() => setIsTeleconsultOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
