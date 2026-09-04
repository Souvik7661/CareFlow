import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Tv, BellRing, ArrowLeft, Clock, HeartPulse, RefreshCw } from 'lucide-react';

interface WaitingRoomDisplayProps {
  onBack: () => void;
}

export const WaitingRoomDisplay: React.FC<WaitingRoomDisplayProps> = ({ onBack }) => {
  const [board, setBoard] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [lastCalledRoom, setLastCalledRoom] = useState<string | null>(null);

  const fetchBoard = () => {
    api.getDisplayBoard().then(res => {
      setBoard(res.board || []);
    }).catch(() => {});
  };

  useEffect(() => {
    fetchBoard();

    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const clockInterval = setInterval(updateClock, 1000);

    // SSE connection for live updates
    const eventSource = new EventSource('/api/queue/events');
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event === 'PATIENT_CALLED') {
          setLastCalledRoom(data.payload?.roomNo || null);
          playChime();
          fetchBoard();
        } else if (data.event === 'QUEUE_OPTIMIZED') {
          fetchBoard();
        }
      } catch (err) {}
    };

    const boardInterval = setInterval(fetchBoard, 6000);

    return () => {
      eventSource.close();
      clearInterval(clockInterval);
      clearInterval(boardInterval);
    };
  }, []);

  const playChime = () => {
    try {
      // Gentle web audio synthesized chime
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.85);
    } catch (e) {}
  };

  return (
    <div className="tv-display-container">
      {/* TV Header */}
      <div className="tv-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            className="btn btn-outline btn-sm" 
            style={{ background: '#1e293b', color: '#cbd5e1', borderColor: '#334155' }}
            onClick={onBack}
          >
            <ArrowLeft size={16} />
            <span>Exit Fullscreen Display</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="brand-icon-box" style={{ width: '40px', height: '40px' }}>
              <HeartPulse size={24} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>
                CareFlow Apex Multi-Specialty Hospital
              </div>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Outpatient Live Consultation Board</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontSize: '0.85rem', fontWeight: 600 }}>
            <span className="pulse-indicator" />
            <span>LIVE QUEUE ACTIVE</span>
          </div>

          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 700, color: '#f8fafc', background: '#131b2e', padding: '6px 18px', borderRadius: 'var(--radius-md)', border: '1px solid #1e293b' }}>
            {currentTime}
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="tv-board-grid">
        {board.map((item: any) => {
          const isJustCalled = lastCalledRoom === item.room_no || item.isCalling;

          return (
            <div 
              key={item.doctor_id} 
              className={`tv-room-card ${isJustCalled ? 'is-calling' : ''}`}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                      {item.department_name} &bull; {item.room_wing || 'Wing A'}
                    </span>
                    <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginTop: '2px' }}>
                      {item.doctor_name}
                    </h3>
                  </div>

                  <div style={{
                    background: '#1e293b',
                    color: '#38bdf8',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-heading)'
                  }}>
                    {item.room_no}
                  </div>
                </div>

                <div style={{ textAlign: 'center', margin: '20px 0' }}>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                    {item.isCalling ? 'PLEASE PROCEED' : 'NOW SERVING'}
                  </span>
                  <div className="tv-token-large">
                    {item.nowServingToken}
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #1e293b', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.84rem' }}>
                <span style={{ color: '#94a3b8' }}>Next in Line:</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {item.upcomingTokens && item.upcomingTokens.length > 0 ? (
                    item.upcomingTokens.map((tok: string) => (
                      <span key={tok} style={{ background: '#1e293b', color: '#e2e8f0', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, fontSize: '0.8rem' }}>
                        {tok}
                      </span>
                    ))
                  ) : (
                    <span style={{ color: '#64748b' }}>Queue clear</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
