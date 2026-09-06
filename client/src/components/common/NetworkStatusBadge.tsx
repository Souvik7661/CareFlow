import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2, Download, AlertTriangle } from 'lucide-react';
import { syncManager } from '../../services/syncManager';

export const NetworkStatusBadge: React.FC = () => {
  const [status, setStatus] = useState(syncManager.getStatus());
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showHttpNotice, setShowHttpNotice] = useState(false);

  useEffect(() => {
    const unsubscribe = syncManager.subscribe((newStatus) => {
      setStatus(newStatus);
    });

    const handleSynced = (e: any) => {
      const count = e.detail?.count || 1;
      setToastMessage(`Synced ${count} offline booking${count > 1 ? 's' : ''} with hospital database!`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    };

    window.addEventListener('careflow:synced', handleSynced);

    // Listen for PWA installation prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Check if on insecure HTTP over LAN (where mobile blocks Service Worker)
    if (!window.isSecureContext && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      setShowHttpNotice(true);
    }

    return () => {
      unsubscribe();
      window.removeEventListener('careflow:synced', handleSynced);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleManualSync = () => {
    if (status.isOnline) {
      syncManager.syncPendingBookings();
    }
  };

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* PWA Install Button when browser supports it */}
        {isInstallable && (
          <button
            onClick={handleInstallApp}
            className="cf-install-btn"
            title="Install CareFlow to Home Screen for 100% Zero-Network Offline Access"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '0.74rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #0d9488 0%, #059669 100%)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(13, 148, 136, 0.4)'
            }}
          >
            <Download size={12} />
            <span>Install App</span>
          </button>
        )}

        {/* Network & Offline Status Pill */}
        <div
          className="cf-network-status-badge"
          onClick={handleManualSync}
          title={
            status.isOnline
              ? 'Connected to Hospital Cloud • Click to check sync'
              : 'Rural Offline Mode • All patient records & sequential tokens saved locally'
          }
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 9px',
            borderRadius: '9999px',
            fontSize: '0.74rem',
            fontWeight: 700,
            cursor: status.isOnline ? 'pointer' : 'default',
            transition: 'all 0.25s ease',
            flexShrink: 0,
            background: status.isOnline 
              ? 'rgba(16, 185, 129, 0.1)' 
              : 'rgba(245, 158, 11, 0.16)',
            border: status.isOnline 
              ? '1px solid rgba(16, 185, 129, 0.35)' 
              : '1px solid rgba(245, 158, 11, 0.55)',
            color: status.isOnline ? '#10b981' : '#f59e0b',
            boxShadow: status.isOnline 
              ? '0 2px 8px rgba(16, 185, 129, 0.12)' 
              : '0 2px 12px rgba(245, 158, 11, 0.25)'
          }}
        >
          {status.isSyncing ? (
            <>
              <RefreshCw size={12} className="spin" style={{ color: '#2dd4bf' }} />
              <span style={{ color: '#2dd4bf' }}>Syncing...</span>
            </>
          ) : status.isOnline ? (
            <>
              <span 
                style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  background: '#10b981', 
                  boxShadow: '0 0 6px #10b981' 
                }} 
              />
              <span className="cf-network-label">Live Network</span>
            </>
          ) : (
            <>
              <WifiOff size={13} style={{ color: '#f59e0b' }} />
              <span>Rural Offline</span>
              {status.pendingCount > 0 && (
                <span
                  style={{
                    background: '#f59e0b',
                    color: '#000',
                    padding: '1px 5px',
                    borderRadius: '9999px',
                    fontSize: '0.68rem',
                    fontWeight: 800
                  }}
                >
                  {status.pendingCount}
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {/* Insecure HTTP Notice for mobile users on LAN */}
      {showHttpNotice && (
        <div
          style={{
            position: 'fixed',
            top: '68px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9998,
            background: 'rgba(245, 158, 11, 0.95)',
            color: '#000',
            padding: '8px 16px',
            borderRadius: '12px',
            fontSize: '0.8rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            maxWidth: '92vw'
          }}
        >
          <AlertTriangle size={15} />
          <span>
            Mobile Offline Notice: Open via{' '}
            <a
              href={`https://${window.location.hostname}:5173`}
              style={{ color: '#000', textDecoration: 'underline', fontWeight: 800 }}
            >
              https://{window.location.hostname}:5173
            </a>{' '}
            to allow phone offline storage!
          </span>
          <button
            onClick={() => setShowHttpNotice(false)}
            style={{
              background: 'transparent',
              border: 'none',
              fontWeight: 800,
              cursor: 'pointer',
              marginLeft: '4px'
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Sync Success Toast Notification */}
      {showToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '85px',
            right: '25px',
            zIndex: 9999,
            background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.95) 0%, rgba(4, 120, 87, 0.95) 100%)',
            border: '1px solid rgba(52, 211, 153, 0.5)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(16, 185, 129, 0.3)',
            borderRadius: '16px',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#ffffff',
            fontSize: '0.88rem',
            fontWeight: 600,
            backdropFilter: 'blur(16px)',
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <CheckCircle2 size={18} color="#34d399" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
};
