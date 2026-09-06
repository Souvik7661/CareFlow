import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { 
  X, 
  Ticket, 
  ExternalLink, 
  Copy, 
  Check, 
  Download, 
  QrCode, 
  Sparkles,
  Stethoscope,
  MapPin,
  Calendar,
  Clock,
  Smartphone
} from 'lucide-react';

interface PatientQRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: any;
  onViewDigitalPass: () => void;
}

export const PatientQRCodeModal: React.FC<PatientQRCodeModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onViewDigitalPass
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Extract appointment fields with dynamic fallbacks
  const apptId = appointment?.appointmentId || appointment?.appointment_id || 'APT-2026-88129';
  const patName = appointment?.patientName || appointment?.patient_name || 'Valued Patient';
  const patId = appointment?.patientId || appointment?.patient_id || 'PAT-2026-38372';
  const docName = appointment?.doctorName || appointment?.doctor_name || 'Assigned Specialist';
  const deptName = appointment?.departmentName || appointment?.department_name || 'Specialty Care';
  const roomNumber = appointment?.roomNo || appointment?.room_no || 'Room 204';
  const roomWing = appointment?.wing || appointment?.room_wing || appointment?.roomWing || 'Block A • OPD Wing';
  const apptDate = appointment?.appointmentDate || appointment?.appointment_date || new Date().toISOString().split('T')[0];
  const apptTime = appointment?.appointmentTime || appointment?.appointment_time || '10:00 AM';
  const rawToken = appointment?.tokenNumber || appointment?.token_number || '#CF-201';
  const displayToken = (rawToken || '').startsWith('#') ? rawToken : `#${rawToken}`;
  const reason = appointment?.reason || appointment?.reasonForVisit || 'Routine health consultation & checkup';

  // Construct dynamic deep-link that any mobile phone can open
  const passUrl = `${window.location.origin}${window.location.pathname}#digital-pass?id=${encodeURIComponent(apptId)}&token=${encodeURIComponent(displayToken)}&doc=${encodeURIComponent(docName)}&dept=${encodeURIComponent(deptName)}&room=${encodeURIComponent(roomNumber)}&wing=${encodeURIComponent(roomWing)}&pat=${encodeURIComponent(patName)}&patId=${encodeURIComponent(patId)}&date=${encodeURIComponent(apptDate)}&time=${encodeURIComponent(apptTime)}&reason=${encodeURIComponent(reason)}`;

  useEffect(() => {
    if (!isOpen) return;

    // Render QR Code onto the canvas
    const timer = setTimeout(() => {
      if (canvasRef.current) {
        QRCode.toCanvas(
          canvasRef.current,
          passUrl,
          {
            width: 220,
            margin: 2,
            color: {
              dark: '#042f2e', // Deep hospital pine
              light: '#ffffff'
            },
            errorCorrectionLevel: 'M'
          },
          (err) => {
            if (err) console.error('[QR] Render error:', err);
          }
        );
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [isOpen, passUrl]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(passUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (e) {
      console.warn('Clipboard copy error:', e);
    }
  };

  const handleDownloadQr = () => {
    if (!canvasRef.current) return;
    try {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `CareFlow-Pass-${displayToken.replace('#', '')}-${docName.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2200);
    } catch (e) {
      console.warn('QR download error:', e);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px',
        animation: 'welcome-fade-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '460px',
          background: 'var(--bg-card)',
          borderRadius: '26px',
          border: '1px solid var(--border-color)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh',
          animation: 'scale-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '20px 22px 16px 22px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-card)'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', animation: 'cf-pulse-glow 1.8s infinite' }} />
              <span>Official Digital Patient Pass</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '2px 0 0 0', color: 'var(--text-primary)' }}>
              Consultation QR Code
            </h3>
          </div>

          <button 
            onClick={onClose}
            className="apple-circle-action-btn"
            style={{ width: '36px', height: '36px' }}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{
          padding: '20px 22px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          {/* Dynamic Token & Doctor Badge */}
          <div style={{
            width: '100%',
            background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--primary-light) 100%)',
            border: '1.5px solid var(--primary-border)',
            borderRadius: '18px',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.1rem',
                flexShrink: 0,
                boxShadow: '0 4px 10px rgba(20, 184, 166, 0.3)'
              }}>
                {(docName.replace('Dr. ', '') || 'D').charAt(0)}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {docName}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700 }}>
                  {deptName} • {roomNumber}
                </div>
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #0d9488, #0f766e)',
              color: '#ffffff',
              padding: '6px 12px',
              borderRadius: '12px',
              fontSize: '0.86rem',
              fontWeight: 900,
              letterSpacing: '0.02em',
              boxShadow: '0 4px 10px rgba(13, 148, 136, 0.35)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              flexShrink: 0
            }}>
              <Ticket size={14} />
              <span>{displayToken}</span>
            </div>
          </div>

          {/* QR Code Container with Frame */}
          <div style={{
            background: '#ffffff',
            padding: '16px',
            borderRadius: '22px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
            border: '2px solid rgba(20, 184, 166, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <canvas 
              ref={canvasRef}
              style={{
                display: 'block',
                maxWidth: '220px',
                height: 'auto',
                borderRadius: '12px'
              }}
            />

            <div style={{
              marginTop: '8px',
              fontSize: '0.72rem',
              fontWeight: 800,
              color: '#0f766e',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              <Sparkles size={12} />
              <span>Verified Hospital Pass #{displayToken.replace('#', '')}</span>
            </div>
          </div>

          {/* Scannable Prompt & Mobile Instructions */}
          <div style={{
            textAlign: 'center',
            maxWidth: '380px'
          }}>
            <p style={{
              fontSize: '0.84rem',
              color: 'var(--text-secondary)',
              margin: '0 0 6px 0',
              lineHeight: 1.4,
              fontWeight: 500
            }}>
              Scan with your smartphone camera to access your digital token and assigned room pass.
            </p>
            <div style={{
              fontSize: '0.76rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}>
              <Smartphone size={13} />
              <span>Works 100% offline &bull; No app download required</span>
            </div>
          </div>

          {/* Primary Action Button: Open Digital Pass Now */}
          <button
            onClick={() => {
              onClose();
              onViewDigitalPass();
            }}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '13px 20px',
              fontSize: '0.96rem',
              fontWeight: 800,
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 6px 18px rgba(20, 184, 166, 0.4)',
              cursor: 'pointer'
            }}
          >
            <span>Open Digital Pass Now</span>
            <ExternalLink size={17} />
          </button>

          {/* Secondary Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%' }}>
            <button
              onClick={handleCopyLink}
              className="btn btn-outline"
              style={{
                padding: '9px 12px',
                fontSize: '0.8rem',
                fontWeight: 700,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              {copied ? (
                <>
                  <Check size={14} color="#10b981" />
                  <span style={{ color: '#10b981' }}>Pass Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy Pass Link</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadQr}
              className="btn btn-outline"
              style={{
                padding: '9px 12px',
                fontSize: '0.8rem',
                fontWeight: 700,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              {downloadSuccess ? (
                <>
                  <Check size={14} color="#10b981" />
                  <span style={{ color: '#10b981' }}>Saved!</span>
                </>
              ) : (
                <>
                  <Download size={14} />
                  <span>Download QR</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
