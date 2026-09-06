import React from 'react';
import { 
  Sparkles, 
  Stethoscope, 
  UserCheck, 
  Calendar, 
  Ticket, 
  Tv, 
  ClipboardList, 
  ShieldCheck,
  Ambulance
} from 'lucide-react';
import { User } from '../../types';
import { platform } from '../../platforms/PlatformDetector';
import { useLanguage } from '../../context/LanguageContext';

interface DockItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; color?: string; className?: string }>;
  active: boolean;
  isAccent?: boolean;
  authRequired?: boolean;
}

interface MobileBottomDockProps {
  currentUser: User | null;
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

export const MobileBottomDock: React.FC<MobileBottomDockProps> = ({
  currentUser,
  currentView,
  onNavigate,
  onOpenAuth
}) => {
  const { t } = useLanguage();

  const handleItemClick = (view: string, authPrompt: boolean = false) => {
    platform.triggerHaptic('light');
    if (authPrompt && !currentUser && onOpenAuth) {
      onOpenAuth('login');
      return;
    }
    onNavigate(view);
  };

  // 1. Patient / Public Unauthenticated Dock Items
  if (!currentUser || currentUser.role === 'PATIENT') {
    const items: DockItem[] = [
      {
        id: 'welcome-hub',
        label: t('nav.services', 'Services'),
        icon: Sparkles,
        active: currentView === 'welcome-hub'
      },
      {
        id: 'ai-triage',
        label: t('nav.teleconsultation', 'Triage'),
        icon: Stethoscope,
        active: currentView === 'ai-triage' || currentView === 'find-doctor' || currentView === 'recommendation'
      },
      {
        id: 'doctor-list',
        label: t('nav.doctors', 'Doctors'),
        icon: UserCheck,
        active: currentView === 'doctor-list' || currentView === 'find-doctors'
      },
      {
        id: 'my-appointments',
        label: t('nav.myAppointments', 'Bookings'),
        icon: Calendar,
        active: currentView === 'my-appointments',
        authRequired: true
      },
      {
        id: 'token-window',
        label: 'Token',
        icon: Ticket,
        active: currentView === 'token-window',
        isAccent: true
      }
    ];

    return (
      <nav className="cf-mobile-bottom-dock" aria-label="Mobile Bottom Navigation">
        <div className="cf-mobile-dock-inner">
          {items.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                className={`cf-mobile-dock-btn ${item.active ? 'active' : ''} ${item.isAccent ? 'is-accent' : ''}`}
                onClick={() => handleItemClick(item.id, item.authRequired)}
                aria-current={item.active ? 'page' : undefined}
              >
                <div className="cf-mobile-dock-icon-wrap">
                  <Icon size={19} />
                </div>
                <span className="cf-mobile-dock-label">{item.label}</span>
                {item.active && <div className="cf-mobile-dock-indicator" />}
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  // 2. Doctor Role Dock Items
  if (currentUser.role === 'DOCTOR') {
    const items: DockItem[] = [
      {
        id: 'doctor-dashboard',
        label: 'Clinic Room',
        icon: Stethoscope,
        active: currentView === 'doctor-dashboard'
      },
      {
        id: 'waiting-tv',
        label: 'Queue TV',
        icon: Tv,
        active: currentView === 'waiting-tv'
      },
      {
        id: 'token-window',
        label: 'My Token',
        icon: Ticket,
        active: currentView === 'token-window',
        isAccent: true
      }
    ];

    return (
      <nav className="cf-mobile-bottom-dock" aria-label="Doctor Mobile Dock">
        <div className="cf-mobile-dock-inner">
          {items.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                className={`cf-mobile-dock-btn ${item.active ? 'active' : ''} ${item.isAccent ? 'is-accent' : ''}`}
                onClick={() => handleItemClick(item.id)}
              >
                <div className="cf-mobile-dock-icon-wrap">
                  <Icon size={19} />
                </div>
                <span className="cf-mobile-dock-label">{item.label}</span>
                {item.active && <div className="cf-mobile-dock-indicator" />}
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  // 3. Receptionist Role Dock Items
  if (currentUser.role === 'RECEPTIONIST') {
    const items: DockItem[] = [
      {
        id: 'reception-dashboard',
        label: 'Triage Desk',
        icon: ClipboardList,
        active: currentView === 'reception-dashboard'
      },
      {
        id: 'waiting-tv',
        label: 'Lobby Display',
        icon: Tv,
        active: currentView === 'waiting-tv'
      },
      {
        id: 'token-window',
        label: 'Live Passes',
        icon: Ticket,
        active: currentView === 'token-window',
        isAccent: true
      }
    ];

    return (
      <nav className="cf-mobile-bottom-dock" aria-label="Receptionist Mobile Dock">
        <div className="cf-mobile-dock-inner">
          {items.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                className={`cf-mobile-dock-btn ${item.active ? 'active' : ''} ${item.isAccent ? 'is-accent' : ''}`}
                onClick={() => handleItemClick(item.id)}
              >
                <div className="cf-mobile-dock-icon-wrap">
                  <Icon size={19} />
                </div>
                <span className="cf-mobile-dock-label">{item.label}</span>
                {item.active && <div className="cf-mobile-dock-indicator" />}
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  // 4. Admin Role Dock Items
  if (currentUser.role === 'ADMIN') {
    const items: DockItem[] = [
      {
        id: 'admin-dashboard',
        label: 'Analytics',
        icon: ShieldCheck,
        active: currentView === 'admin-dashboard'
      },
      {
        id: 'waiting-tv',
        label: 'Lobby Board',
        icon: Tv,
        active: currentView === 'waiting-tv'
      },
      {
        id: 'ambulance',
        label: 'Ambulance 24/7',
        icon: Ambulance,
        active: currentView === 'ambulance'
      }
    ];

    return (
      <nav className="cf-mobile-bottom-dock" aria-label="Admin Mobile Dock">
        <div className="cf-mobile-dock-inner">
          {items.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                className={`cf-mobile-dock-btn ${item.active ? 'active' : ''} ${item.isAccent ? 'is-accent' : ''}`}
                onClick={() => handleItemClick(item.id)}
              >
                <div className="cf-mobile-dock-icon-wrap">
                  <Icon size={19} />
                </div>
                <span className="cf-mobile-dock-label">{item.label}</span>
                {item.active && <div className="cf-mobile-dock-indicator" />}
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  return null;
};
