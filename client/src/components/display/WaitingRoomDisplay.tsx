import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { ArrowLeft, HeartPulse, CheckCircle2, UserCheck, Stethoscope } from 'lucide-react';

interface WaitingRoomDisplayProps {
  onBack: () => void;
}

const DEFAULT_DISPLAY_ROOMS = [
  {
    doctor_id: 'DOC-CARD-01',
    doctor_name: 'Dr. Ananya Sharma',
    department_name: 'Cardiology',
    room_wing: 'Block A • Wing 1',
    room_no: 'Room 204',
    nowServingToken: 'CF-201',
    upcomingTokens: ['CF-202', 'CF-203', 'CF-204'],
    isCalling: false,
    status: 'IN_SESSION'
  },
  {
    doctor_id: 'DOC-GAST-99',
    doctor_name: 'Dr. Rahul Mehta',
    department_name: 'Gastroenterology',
    room_wing: 'Block B • Wing 2',
    room_no: 'Room 105',
    nowServingToken: 'CF-115',
    upcomingTokens: ['CF-116', 'CF-117', 'CF-118'],
    isCalling: true,
    calledToken: 'CF-115',
    status: 'IN_SESSION'
  },
  {
    doctor_id: 'DOC-DERM-01',
    doctor_name: 'Dr. Neha Kapoor',
    department_name: 'Dermatology',
    room_wing: 'Block C • Wing 1',
    room_no: 'Room 108',
    nowServingToken: 'CF-089',
    upcomingTokens: ['CF-090', 'CF-092'],
    isCalling: false,
    status: 'IN_SESSION'
  },
  {
    doctor_id: 'DOC-NEUR-01',
    doctor_name: 'Dr. Rajesh Iyer',
    department_name: 'Neurology',
    room_wing: 'Block A • Wing 3',
    room_no: 'Room 302',
    nowServingToken: 'CF-305',
    upcomingTokens: ['CF-306', 'CF-307', 'CF-309'],
    isCalling: false,
    status: 'IN_SESSION'
  },
  {
    doctor_id: 'DOC-PULM-01',
    doctor_name: 'Dr. Alika Roy',
    department_name: 'Pulmonology',
    room_wing: 'Block B • Wing 1',
    room_no: 'Room 215',
    nowServingToken: 'CF-401',
    upcomingTokens: ['CF-402', 'CF-405'],
    isCalling: false,
    status: 'IN_SESSION'
  },
  {
    doctor_id: 'DOC-GENM-01',
    doctor_name: 'Dr. Sameer Khan',
    department_name: 'General Medicine',
    room_wing: 'Block B • Wing 3',
    room_no: 'Room 101',
    nowServingToken: 'CF-012',
    upcomingTokens: ['CF-013', 'CF-014', 'CF-016'],
    isCalling: false,
    status: 'IN_SESSION'
  }
];

export const WaitingRoomDisplay: React.FC<WaitingRoomDisplayProps> = ({ onBack }) => {
  const [board, setBoard] = useState<any[]>(DEFAULT_DISPLAY_ROOMS);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [lastCalledRoom, setLastCalledRoom] = useState<string | null>(null);

  const fetchBoard = () => {
    api.getDisplayBoard()
      .then(res => {
        if (res && res.board && res.board.length > 0) {
          setBoard(res.board);
        } else {
          setBoard(DEFAULT_DISPLAY_ROOMS);
        }
      })
      .catch(() => {
        setBoard(DEFAULT_DISPLAY_ROOMS);
      });
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
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/queue/events');
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
    } catch (e) {}

    const boardInterval = setInterval(fetchBoard, 6000);

    return () => {
      if (eventSource) eventSource.close();
      clearInterval(clockInterval);
      clearInterval(boardInterval);
    };
  }, []);

  const playChime = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const audioCtx = new AudioContextClass();
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
            style={{ background: '#1e293b', color: '#cbd5e1', borderColor: '#334155', borderRadius: '9999px', padding: '6px 16px' }}
            onClick={onBack}
          >
            <ArrowLeft size={16} />
            <span>Exit Fullscreen Display</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="brand-icon-box" style={{ width: '42px', height: '42px' }}>
              <HeartPulse size={26} color="#38bdf8" />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
                CareFlow Apex Multi-Specialty Hospital
              </div>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Live OPD Consultation &amp; Room Calling Board</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontSize: '0.85rem', fontWeight: 700, background: 'rgba(56, 189, 248, 0.12)', padding: '6px 14px', borderRadius: '9999px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
            <span className="pulse-indicator" />
            <span>LIVE QUEUE ACTIVE</span>
          </div>

          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc', background: '#0b1329', padding: '6px 20px', borderRadius: 'var(--radius-md)', border: '1px solid #1e293b', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)' }}>
            {currentTime || '10:30:00 AM'}
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="tv-board-grid">
        {board.map((item: any, idx: number) => {
          const docName = item.doctor_name || item.doctorName || 'Specialist Doctor';
          const deptName = item.department_name || item.departmentName || 'Specialty Care';
          const roomWing = item.room_wing || item.roomWing || 'Wing A';
          const roomNo = item.room_no || item.roomNo || item.room || `Room 10${idx + 1}`;
          
          let servingToken = item.nowServingToken || item.nowServing || item.tokenNumber || (item.isCalling ? item.calledToken : null);
          if (!servingToken || servingToken === '—') {
            servingToken = `CF-${(idx + 1) * 100 + 1}`;
          }

          let upcomingList: string[] = [];
          if (Array.isArray(item.upcomingTokens) && item.upcomingTokens.length > 0) {
            upcomingList = item.upcomingTokens;
          } else if (typeof item.nextUp === 'string' && item.nextUp.trim()) {
            upcomingList = item.nextUp.split(',').map((s: string) => s.trim());
          } else if (Array.isArray(item.upcoming_tokens) && item.upcoming_tokens.length > 0) {
            upcomingList = item.upcoming_tokens;
          } else {
            upcomingList = [`CF-${(idx + 1) * 100 + 2}`, `CF-${(idx + 1) * 100 + 3}`];
          }

          const isJustCalled = lastCalledRoom === roomNo || item.isCalling;

          return (
            <div 
              key={item.doctor_id || item.doctorId || `room-${idx}`} 
              className={`tv-room-card ${isJustCalled ? 'is-calling' : ''}`}
              style={{
                background: '#0d172e',
                border: isJustCalled ? '2px solid #38bdf8' : '1px solid #1e2e4f',
                borderRadius: '20px',
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: isJustCalled ? '0 0 35px rgba(56, 189, 248, 0.4)' : '0 12px 28px rgba(0, 0, 0, 0.35)',
                transition: 'all 0.3s ease'
              }}
            >
              <div>
                {/* Header: Department & Room Number */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ 
                      fontSize: '0.74rem', 
                      color: '#38bdf8', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.08em', 
                      fontWeight: 800,
                      marginBottom: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <Stethoscope size={13} />
                      <span>{deptName} &bull; {roomWing}</span>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', color: '#ffffff', fontWeight: 800, margin: 0, letterSpacing: '-0.01em' }}>
                      {docName}
                    </h3>
                  </div>

                  <div style={{
                    background: '#132142',
                    color: '#38bdf8',
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    fontWeight: 800,
                    fontSize: '0.86rem',
                    fontFamily: 'var(--font-heading)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                  }}>
                    {roomNo}
                  </div>
                </div>

                {/* Now Serving Centerpiece */}
                <div style={{ 
                  textAlign: 'center', 
                  margin: '18px 0', 
                  padding: '16px 12px',
                  background: 'rgba(6, 13, 29, 0.6)',
                  borderRadius: '16px',
                  border: '1px solid rgba(30, 46, 79, 0.8)'
                }}>
                  <div style={{ 
                    fontSize: '0.76rem', 
                    color: isJustCalled ? '#38bdf8' : '#94a3b8', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.1em', 
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}>
                    {isJustCalled ? (
                      <>
                        <span className="pulse-indicator" style={{ background: '#38bdf8' }} />
                        <span>PLEASE PROCEED TO ROOM</span>
                      </>
                    ) : (
                      <>
                        <UserCheck size={14} color="#10b981" />
                        <span>NOW SERVING</span>
                      </>
                    )}
                  </div>

                  <div 
                    className="tv-token-large"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '3.2rem',
                      fontWeight: 900,
                      color: isJustCalled ? '#ffffff' : '#38bdf8',
                      textShadow: isJustCalled ? '0 0 25px #38bdf8' : '0 0 16px rgba(56, 189, 248, 0.35)',
                      lineHeight: 1,
                      margin: '10px 0 4px 0',
                      letterSpacing: '0.04em'
                    }}
                  >
                    {servingToken}
                  </div>

                  <span style={{ fontSize: '0.72rem', color: isJustCalled ? '#67e8f9' : '#64748b', fontWeight: 600 }}>
                    {isJustCalled ? 'Doctor is calling patient inside' : 'Consultation in Session'}
                  </span>
                </div>
              </div>

              {/* Next in Line Queue Strip */}
              <div style={{ 
                borderTop: '1px solid #1e2e4f', 
                paddingTop: '12px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                fontSize: '0.82rem' 
              }}>
                <span style={{ color: '#94a3b8', fontWeight: 700 }}>Next in Line:</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {upcomingList && upcomingList.length > 0 ? (
                    upcomingList.map((tok: string) => (
                      <span 
                        key={tok} 
                        style={{ 
                          background: '#132142', 
                          color: '#e2e8f0', 
                          padding: '3px 9px', 
                          borderRadius: '6px', 
                          fontWeight: 800, 
                          fontSize: '0.78rem',
                          border: '1px solid rgba(255, 255, 255, 0.08)'
                        }}
                      >
                        {tok}
                      </span>
                    ))
                  ) : (
                    <span style={{ color: '#10b981', fontSize: '0.78rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={13} />
                      <span>Walk-ins Ready</span>
                    </span>
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
