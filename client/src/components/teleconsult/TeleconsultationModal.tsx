import React, { useState, useEffect } from 'react';
import { 
  X, 
  Phone, 
  MessageSquare, 
  Mic, 
  MicOff, 
  Volume2, 
  PhoneOff, 
  Send, 
  CheckCheck, 
  Stethoscope, 
  ShieldCheck,
  HeartPulse
} from 'lucide-react';

interface TeleconsultationModalProps {
  doctorName?: string;
  specialization?: string;
  onClose: () => void;
}

export const TeleconsultationModal: React.FC<TeleconsultationModalProps> = ({
  doctorName = 'Dr. Rahul Mehta',
  specialization = 'Gastroenterologist',
  onClose
}) => {
  const [activeMode, setActiveMode] = useState<'selection' | 'voice' | 'chat'>('selection');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'patient' | 'doctor'; text: string; time: string }>>([
    {
      sender: 'doctor',
      text: `Hello! I'm ${doctorName}. I've received your appointment details. What symptoms or questions do you have before your clinic visit?`,
      time: 'Just now'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // Call timer
  useEffect(() => {
    if (activeMode !== 'voice') return;
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeMode]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg = {
      sender: 'patient' as const,
      text: inputMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, newMsg]);
    setInputMessage('');

    // Doctor automated reply
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'doctor' as const,
          text: `Thank you for sharing that. Keep hydrated and avoid heavy or spicy foods until our scheduled consultation. I will evaluate you thoroughly in clinic!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1200);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '480px', padding: '24px', borderRadius: 'var(--radius-xl)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Selection Screen matching Screen 8 */}
        {activeMode === 'selection' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
              Free Phone Consultation
            </span>

            {/* Doctor Avatar matching Screen 8 in image */}
            <div style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0d9488, #0f766e)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 800,
              margin: '16px auto 12px auto',
              boxShadow: 'var(--shadow-md)'
            }}>
              {doctorName.replace('Dr. ', '').charAt(0)}
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Talk to {doctorName}</h3>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {specialization}
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(13, 148, 136, 0.08)',
              color: '#0d9488',
              fontSize: '0.8rem',
              fontWeight: 700,
              margin: '16px 0 24px 0'
            }}>
              <ShieldCheck size={14} />
              <span>Free Consultation &bull; Valid for this appointment</span>
            </div>

            {/* Voice Call & Chat 2-Button Grid matching Screen 8 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <button
                onClick={() => {
                  setCallDuration(0);
                  setActiveMode('voice');
                }}
                style={{
                  padding: '20px 14px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-color)',
                  background: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'rgba(13, 148, 136, 0.1)',
                  color: '#0d9488',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Phone size={22} />
                </div>
                <strong style={{ fontSize: '0.95rem' }}>Voice Call</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Talk to doctor</span>
              </button>

              <button
                onClick={() => setActiveMode('chat')}
                style={{
                  padding: '20px 14px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-color)',
                  background: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'rgba(2, 132, 199, 0.1)',
                  color: '#0284c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <MessageSquare size={22} />
                </div>
                <strong style={{ fontSize: '0.95rem' }}>Chat</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Text with doctor</span>
              </button>
            </div>

            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '20px' }}>
              Consultation available before your visit &bull; HIPAA Compliant
            </div>
          </div>
        )}

        {/* Voice Call Mode */}
        {activeMode === 'voice' && (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <span className="badge badge-success">Connected</span>

            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: '#0d9488',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.2rem',
              fontWeight: 800,
              margin: '20px auto 14px auto',
              boxShadow: '0 0 20px rgba(13, 148, 136, 0.4)',
              animation: 'pulse 2s infinite'
            }}>
              {doctorName.replace('Dr. ', '').charAt(0)}
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{doctorName}</h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{specialization}</div>

            <div style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'monospace', margin: '20px 0' }}>
              {formatTimer(callDuration)}
            </div>

            {/* Voice Controls */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '24px' }}>
              <button
                onClick={() => setIsMuted(!isMuted)}
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  border: '1px solid var(--border-color)',
                  background: isMuted ? '#ef4444' : 'var(--bg-muted)',
                  color: isMuted ? '#ffffff' : 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
              </button>

              <button
                onClick={() => setActiveMode('selection')}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  border: 'none',
                  background: '#ef4444',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)'
                }}
              >
                <PhoneOff size={26} />
              </button>

              <button
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-muted)',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <Volume2 size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Chat Mode */}
        {activeMode === 'chat' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '420px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <div>
                <strong>{doctorName}</strong>
                <div style={{ fontSize: '0.74rem', color: 'var(--success)' }}>Online &bull; {specialization}</div>
              </div>
              <button onClick={() => setActiveMode('selection')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '14px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    alignSelf: msg.sender === 'patient' ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    background: msg.sender === 'patient' ? '#0d9488' : 'var(--bg-muted)',
                    color: msg.sender === 'patient' ? '#ffffff' : 'var(--text-primary)',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.86rem'
                  }}
                >
                  <div>{msg.text}</div>
                  <div style={{ fontSize: '0.68rem', opacity: 0.75, textAlign: 'right', marginTop: '4px' }}>
                    {msg.time}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Type your question..."
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0 16px', background: '#0d9488' }}>
                <Send size={16} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
