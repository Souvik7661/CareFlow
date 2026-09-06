import React, { useState } from 'react';
import { User } from '../../types';
import { 
  Stethoscope, 
  Calendar, 
  Headphones, 
  ArrowRight, 
  MessageSquare, 
  Heart, 
  Clock, 
  ShieldCheck,
  UserCheck,
  Activity,
  Building2,
  Tv,
  Ambulance,
  CalendarPlus,
  Ticket
} from 'lucide-react';
import { Doctor360CenterStage } from './Doctor360CenterStage';
import { useLanguage } from '../../context/LanguageContext';

interface WelcomeServiceHubProps {
  user: User;
  onSelectService: (service: 'doctors' | 'book-appointment' | 'support') => void;
  onOpenTokenWindow: () => void;
  onNavigate?: (view: string) => void;
}

export const WelcomeServiceHub: React.FC<WelcomeServiceHubProps> = ({
  user,
  onSelectService,
  onOpenTokenWindow,
  onNavigate
}) => {
  const { t } = useLanguage();
  const [hoveredService, setHoveredService] = useState<'doctors' | 'book-appointment' | 'support' | null>(null);

  const isGeneric = !user.fullName || user.fullName === 'Valued Patient' || user.fullName === 'Guest Patient' || user.userId === 'GUEST';
  const patientFirstName = isGeneric ? '' : user.fullName.split(' ')[0];

  return (
    <div className="cf-welcome-hub-container">
      {/* Welcome Greeting Header */}
      <div style={{ textAlign: 'center', maxWidth: '850px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginBottom: '4px' }}>
        <h1 className="cf-welcome-heading">
          {patientFirstName ? `${t('hub.welcomeGreeting', 'Welcome')}, ${patientFirstName} 👋` : `${t('hub.welcomeGreeting', 'Welcome to CareFlow')} 👋`}
        </h1>

        <p style={{
          fontSize: '0.98rem',
          fontWeight: 600,
          color: 'var(--text-secondary)',
          marginTop: '6px'
        }}>
          {t('hub.subGreeting', 'What service do you require today?')}
        </p>
      </div>

      {/* 360° Rotating Doctor Buddy in Still/Fixed Place (Every Angle 0°-315°) */}
      <Doctor360CenterStage 
        userName={patientFirstName || 'there'} 
        onDoctorClick={() => onSelectService('doctors')}
      />

      {/* The 3 Core Options */}
      <div className="cf-services-grid">
        {/* Option 1: DOCTORS */}
        <div 
          className="card cf-service-card"
          style={{
            border: hoveredService === 'doctors' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
            transform: hoveredService === 'doctors' ? 'translateY(-4px) scale(1.01)' : 'translateY(0)',
            boxShadow: hoveredService === 'doctors' ? '0 16px 30px -6px rgba(20, 184, 166, 0.35)' : 'var(--shadow-md)',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onMouseEnter={() => setHoveredService('doctors')}
          onMouseLeave={() => setHoveredService(null)}
          onClick={() => onSelectService('doctors')}
        >
          <div className="cf-service-icon-box" style={{
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            boxShadow: '0 6px 14px rgba(20, 184, 166, 0.2)'
          }}>
            <Stethoscope size={28} />
          </div>

          <div className="cf-service-content">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
              {t('hub.specialistCardTitle', 'Doctors')}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
              {t('hub.specialistCardDesc', 'AI Clinical Diagnosis & Specialist Recommendation')}
            </p>
          </div>

          <div className="cf-service-action-link" style={{ color: 'var(--primary)' }}>
            <span>{t('hub.findSpecialistAction', 'Find Specialist')}</span>
            <ArrowRight size={15} />
          </div>
        </div>

        {/* Option 2: BOOK APPOINTMENT */}
        <div 
          className="card cf-service-card"
          style={{
            border: hoveredService === 'book-appointment' ? '2px solid var(--secondary)' : '1px solid var(--border-color)',
            transform: hoveredService === 'book-appointment' ? 'translateY(-4px) scale(1.01)' : 'translateY(0)',
            boxShadow: hoveredService === 'book-appointment' ? '0 16px 30px -6px rgba(56, 189, 248, 0.35)' : 'var(--shadow-md)',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onMouseEnter={() => setHoveredService('book-appointment')}
          onMouseLeave={() => setHoveredService(null)}
          onClick={() => onSelectService('book-appointment')}
        >
          <div className="cf-service-icon-box" style={{
            background: 'var(--secondary-light)',
            color: 'var(--secondary)',
            boxShadow: '0 6px 14px rgba(56, 189, 248, 0.2)'
          }}>
            <Calendar size={28} />
          </div>

          <div className="cf-service-content">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
              {t('hub.bookCardTitle', 'Book Appt')}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
              {t('hub.bookCardDesc', 'Doctor OPD Schedules & Immediate Time Slots')}
            </p>
          </div>

          <div className="cf-service-action-link" style={{ color: 'var(--secondary)' }}>
            <span>{t('hub.bookSlotAction', 'Choose Slot')}</span>
            <ArrowRight size={15} />
          </div>
        </div>

        {/* Option 3: 24/7 CUSTOMER SERVICE */}
        <div 
          className="card cf-service-card"
          style={{
            border: hoveredService === 'support' ? '2px solid var(--danger)' : '1px solid var(--border-color)',
            transform: hoveredService === 'support' ? 'translateY(-4px) scale(1.01)' : 'translateY(0)',
            boxShadow: hoveredService === 'support' ? '0 16px 30px -6px rgba(244, 63, 94, 0.35)' : 'var(--shadow-md)',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onMouseEnter={() => setHoveredService('support')}
          onMouseLeave={() => setHoveredService(null)}
          onClick={() => onSelectService('support')}
        >
          <div className="cf-service-icon-box" style={{
            background: 'var(--danger-bg)',
            color: 'var(--danger)',
            boxShadow: '0 6px 14px rgba(244, 63, 94, 0.2)'
          }}>
            <Headphones size={28} />
          </div>

          <div className="cf-service-content">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
              {t('hub.supportCardTitle', '24/7 Support')}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
              {t('hub.supportCardDesc', 'Emergency Ambulance, Hotline & Hospital Care')}
            </p>
          </div>

          <div className="cf-service-action-link" style={{ color: 'var(--danger)' }}>
            <span>{t('hub.supportAction', 'Emergency Care')}</span>
            <ArrowRight size={15} />
          </div>
        </div>
      </div>

      {/* Quick Access to Active Token Banner */}
      <div 
        className="card cf-active-token-banner"
        onClick={onOpenTokenWindow}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
          <div style={{
            width: '38px',
            height: '38px',
            minWidth: '38px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: '0.92rem',
            boxShadow: '0 4px 12px rgba(13, 148, 136, 0.4)',
            flexShrink: 0
          }}>
            #
          </div>
          <div style={{ minWidth: 0 }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--brand-teal, #2dd4bf)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {t('hub.activeTokenBanner', 'Active Token & Assigned Doctor')}
            </span>
            <span style={{ fontSize: '0.86rem', color: 'var(--text-primary)', fontWeight: 700, display: 'block', wordBreak: 'break-word' }}>
              {t('hub.clickToViewToken', 'Click here or tap the CareFlow logo anytime to view your live token')}
            </span>
          </div>
        </div>

        <span className="badge badge-primary" style={{ padding: '6px 14px', fontSize: '0.78rem', flexShrink: 0 }}>
          {t('hub.viewTokenBadge', 'View Token →')}
        </span>
      </div>

      {/* Direct Quick Actions Self-Service Grid */}
      <div style={{ width: '100%', marginTop: '6px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '4px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {t('hub.quickHospitalActions', 'Quick Hospital Actions')}
          </span>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            {t('hub.instantSelfService', 'Instant self-service tools')}
          </span>
        </div>

        <div className="cf-quick-actions-grid">
          {/* Action 1: Self Check-In */}
          <button
            type="button"
            className="card cf-quick-action-btn"
            onClick={() => onNavigate && onNavigate('checkin')}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <UserCheck size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                {t('hub.hospitalCheckIn', 'Hospital Check-In')}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {t('hub.arrivalVerification', 'Arrival verification')}
              </div>
            </div>
          </button>

          {/* Action 2: Live Queue Monitor */}
          <button
            type="button"
            className="card cf-quick-action-btn"
            onClick={() => onNavigate && onNavigate('live-queue')}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'var(--secondary-light)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Activity size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                {t('hub.liveQueueStatus', 'Live Queue Status')}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {t('hub.waitTimesAndTurns', 'Wait times & turns')}
              </div>
            </div>
          </button>

          {/* Action 3: Hospital Network */}
          <button
            type="button"
            className="card cf-quick-action-btn"
            onClick={() => onNavigate && onNavigate('hospitals-map')}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(234, 179, 8, 0.15)', color: '#ca8a04', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Building2 size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                {t('hub.hospitalNetwork', 'Hospital Network')}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {t('hub.nearbyIcuOpd', 'Nearby ICU & OPD')}
              </div>
            </div>
          </button>

          {/* Action 5: My Consultations */}
          <button
            type="button"
            className="card cf-quick-action-btn"
            onClick={() => onNavigate && onNavigate('my-appointments')}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Calendar size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                {t('hub.myConsultations', 'My Consultations')}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {t('hub.bookedPasses', 'Passes & history')}
              </div>
            </div>
          </button>

          {/* Action 6: Direct Book Slot */}
          <button
            type="button"
            className="card cf-quick-action-btn"
            onClick={() => onNavigate && onNavigate('direct-booking')}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CalendarPlus size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                {t('hub.directBookSlot', 'Direct Book Slot')}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {t('hub.chooseDoctorDate', 'Choose doctor & date')}
              </div>
            </div>
          </button>

          {/* Action 7: Emergency Ambulance */}
          <button
            type="button"
            className="card cf-quick-action-btn"
            onClick={() => onNavigate && onNavigate('ambulance')}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'var(--danger-bg)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Ambulance size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                {t('hub.emergencyAmbulance', 'Emergency Ambulance')}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {t('hub.gpsDispatch', 'GPS dispatch & 108')}
              </div>
            </div>
          </button>

          {/* Action 8: Waiting Room TV */}
          <button
            type="button"
            className="card cf-quick-action-btn"
            onClick={() => onNavigate && onNavigate('waiting-tv')}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Tv size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                {t('hub.lobbyDisplay', 'Lobby Display')}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {t('hub.publicWaitingTv', 'Public waiting TV')}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Official Native App Installers & Extensions */}
      <div style={{ width: '100%', marginTop: '10px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '4px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {t('hub.nativeInstallersTitle', 'Official Native Installers & Packages')}
          </span>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            {t('hub.nativeInstallersSubtitle', 'Direct device packages (.apk • .mobileconfig • .dmg • .exe)')}
          </span>
        </div>

        <div className="cf-platform-apps-grid">
          {/* Android .APK */}
          <a
            href="/downloads/CareFlow.apk"
            download="CareFlow.apk"
            className="card"
            style={{
              padding: '16px 14px',
              borderRadius: '18px',
              textDecoration: 'none',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '12px',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: 'rgba(61, 220, 132, 0.15)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#10b981">
                  <path d="M17.523 15.341c-.551 0-1-.448-1-1 0-.551.449-1 1-1 .552 0 1 .449 1 1 0 .552-.448 1-1 1zm-11.046 0c-.551 0-1-.448-1-1 0-.551.449-1 1-1 .552 0 1 .449 1 1 0 .552-.448 1-1 1zm11.405-6.02l1.997-3.46a.416.416 0 00-.152-.567.416.416 0 00-.568.152l-2.023 3.504C15.59 8.358 13.853 8 12 8s-3.59.358-5.136.95L4.841 5.446a.417.417 0 00-.569-.152.416.416 0 00-.151.567l1.997 3.46C2.688 11.286 0 15.338 0 20h24c0-4.662-2.688-8.714-6.118-10.679z" />
                </svg>
              </div>
              <span className="badge badge-primary" style={{ fontSize: '10px', padding: '2px 7px' }}>.APK</span>
            </div>

            <div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Android App</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.35 }}>
                Native package with offline cache &amp; touch haptics
              </div>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)' }}>
              <span>Download .APK</span>
              <ArrowRight size={13} />
            </div>
          </a>

          {/* Apple iOS .MOBILESYNC / .IPA */}
          <a
            href="/downloads/CareFlow-Apple-iOS.mobileconfig"
            download="CareFlow-Apple-iOS.mobileconfig"
            className="card"
            style={{
              padding: '16px 14px',
              borderRadius: '18px',
              textDecoration: 'none',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '12px',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: 'rgba(56, 189, 248, 0.15)',
                color: 'var(--secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <svg width="20" height="20" viewBox="0 0 170 170" fill="currentColor">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.6-7.83-11.72-14.36-5.83-9.15-10.37-19.46-13.62-29.93-3.25-10.47-4.88-20.48-4.88-30.04 0-14.93 3.65-27.24 10.96-36.93 7.31-9.69 16.7-14.67 28.18-14.94 4.58 0 9.8 1.16 15.65 3.49 5.86 2.33 9.47 3.55 10.85 3.66 1.83-.24 5.63-1.57 11.41-3.99 5.78-2.43 10.74-3.52 14.88-3.29 11.9.84 21.36 5.3 28.38 13.38-10.47 6.33-15.59 15.11-15.35 26.33.24 8.79 3.64 16.14 10.2 22.05 6.56 5.91 14.35 9.46 23.36 10.66-2.12 6.31-4.7 12.83-7.75 19.56zm-36.8-105.74c.03 3.77-1.3 7.57-3.99 11.41-2.69 3.84-6.27 6.78-10.74 8.81-.59-3.73.53-7.64 3.36-11.73 2.83-4.09 6.6-7.07 11.37-8.49z" />
                </svg>
              </div>
              <span className="badge badge-secondary" style={{ fontSize: '10px', padding: '2px 7px' }}>.MOBILESYNC</span>
            </div>

            <div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Apple iOS</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.35 }}>
                Apple Profile &amp; WebClip package for iPhone/iPad
              </div>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--secondary)' }}>
              <span>Install Profile</span>
              <ArrowRight size={13} />
            </div>
          </a>

          {/* Apple macOS .DMG */}
          <a
            href="/downloads/CareFlow-Mac.dmg"
            download="CareFlow-Mac.dmg"
            className="card"
            style={{
              padding: '16px 14px',
              borderRadius: '18px',
              textDecoration: 'none',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '12px',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#6366f1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <svg width="20" height="20" viewBox="0 0 170 170" fill="currentColor">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.6-7.83-11.72-14.36-5.83-9.15-10.37-19.46-13.62-29.93-3.25-10.47-4.88-20.48-4.88-30.04 0-14.93 3.65-27.24 10.96-36.93 7.31-9.69 16.7-14.67 28.18-14.94 4.58 0 9.8 1.16 15.65 3.49 5.86 2.33 9.47 3.55 10.85 3.66 1.83-.24 5.63-1.57 11.41-3.99 5.78-2.43 10.74-3.52 14.88-3.29 11.9.84 21.36 5.3 28.38 13.38-10.47 6.33-15.59 15.11-15.35 26.33.24 8.79 3.64 16.14 10.2 22.05 6.56 5.91 14.35 9.46 23.36 10.66-2.12 6.31-4.7 12.83-7.75 19.56zm-36.8-105.74c.03 3.77-1.3 7.57-3.99 11.41-2.69 3.84-6.27 6.78-10.74 8.81-.59-3.73.53-7.64 3.36-11.73 2.83-4.09 6.6-7.07 11.37-8.49z" />
                </svg>
              </div>
              <span className="badge badge-primary" style={{ fontSize: '10px', padding: '2px 7px' }}>.DMG</span>
            </div>

            <div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Apple macOS</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.35 }}>
                Disk image installer for Apple Silicon &amp; Intel Macs
              </div>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)' }}>
              <span>Download .DMG</span>
              <ArrowRight size={13} />
            </div>
          </a>

          {/* Windows .EXE */}
          <a
            href="/downloads/CareFlow-Windows.exe"
            download="CareFlow-Windows.exe"
            className="card"
            style={{
              padding: '16px 14px',
              borderRadius: '18px',
              textDecoration: 'none',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '12px',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: 'rgba(0, 120, 212, 0.15)',
                color: '#0078d4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#0078D4">
                  <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.949-1.8" />
                </svg>
              </div>
              <span className="badge badge-primary" style={{ fontSize: '10px', padding: '2px 7px' }}>.EXE</span>
            </div>

            <div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Windows PC</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.35 }}>
                64-bit executable launcher for Windows 10/11
              </div>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)' }}>
              <span>Download .EXE</span>
              <ArrowRight size={13} />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};
