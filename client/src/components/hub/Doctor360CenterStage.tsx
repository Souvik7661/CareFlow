import React, { useEffect, useRef, useState } from 'react';

const ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

interface Doctor360CenterStageProps {
  userName?: string;
  onDoctorClick?: () => void;
}

export const Doctor360CenterStage: React.FC<Doctor360CenterStageProps> = ({
  userName = 'there',
  onDoctorClick
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  const currentAngleRef = useRef<number>(0);
  const targetAngleRef = useRef<number>(0);
  const currentTiltXRef = useRef<number>(0);
  const currentTiltYRef = useRef<number>(0);
  const targetTiltXRef = useRef<number>(0);
  const targetTiltYRef = useRef<number>(0);
  const lastMousePosRef = useRef<{ x: number; y: number } | null>(null);

  const isDraggingRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const dragStartAngleRef = useRef<number>(0);

  // 1. Preload all 8 high-resolution pristine angle frames in memory
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    ANGLES.forEach((angle, idx) => {
      const img = new Image();
      img.src = `/assets/doctor_360/frame_${angle}.png`;
      img.onload = () => {
        // Trigger initial draw if front frame is ready
        if (idx === 0 && canvasRef.current) {
          draw60HzFrame(currentAngleRef.current);
        }
      };
      loadedImages[idx] = img;
    });
    imagesRef.current = loadedImages;
  }, []);

  // 2. Continuous 60Hz Dual-Buffer Canvas Render Pipeline
  const draw60HzFrame = (angle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const normAngle = ((angle % 360) + 360) % 360;
    const frameFloat = normAngle / 45;
    const indexA = Math.floor(frameFloat) % 8;
    const indexB = (indexA + 1) % 8;
    const rawT = frameFloat - Math.floor(frameFloat); // 0.0 to 1.0

    // Smoothstep cubic easing: t * t * (3 - 2 * t) for 60Hz fluid pixel blending
    const blend = rawT * rawT * (3 - 2 * rawT);

    const imgA = imagesRef.current[indexA];
    const imgB = imagesRef.current[indexB];

    if (!imgA || !imgB || !imgA.complete || !imgB.complete) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Render base frame A
    ctx.globalAlpha = 1;
    ctx.drawImage(imgA, 0, 0, canvas.width, canvas.height);

    // Cross-dissolve blending frame B continuously at 60Hz
    if (blend > 0.005) {
      ctx.globalAlpha = blend;
      ctx.drawImage(imgB, 0, 0, canvas.width, canvas.height);
    }
  };

  // 3. Hardware-Accelerated 60/120Hz Animation Loop
  useEffect(() => {
    let animId: number;

    const renderLoop = () => {
      // Shortest circular path interpolation (-180° to +180°)
      let diff = targetAngleRef.current - currentAngleRef.current;
      diff = ((diff + 180) % 360 + 360) % 360 - 180;

      // Silky-smooth lerp damping (0.18 gives responsive, fluid 60Hz glide)
      if (Math.abs(diff) > 0.02) {
        currentAngleRef.current = (currentAngleRef.current + diff * 0.18 + 360) % 360;
      } else {
        currentAngleRef.current = targetAngleRef.current;
      }

      // Smooth 3D tilt interpolation towards cursor
      currentTiltXRef.current += (targetTiltXRef.current - currentTiltXRef.current) * 0.15;
      currentTiltYRef.current += (targetTiltYRef.current - currentTiltYRef.current) * 0.15;

      const angle = currentAngleRef.current;

      // Render the dual-buffer frame on the canvas at 60Hz
      draw60HzFrame(angle);

      // Apply subtle 3D perspective tilt
      if (canvasRef.current) {
        canvasRef.current.style.transform = `perspective(850px) rotateX(${currentTiltXRef.current.toFixed(2)}deg) rotateY(${currentTiltYRef.current.toFixed(2)}deg)`;
      }

      // Synchronize rotating telemetry floor ring exactly with Dr. AI's feet at 60Hz
      if (ringRef.current) {
        ringRef.current.style.transform = `translateX(-50%) rotateX(68deg) rotateZ(${angle.toFixed(1)}deg)`;
      }

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // 4. Cursor movement tracking: Dr. AI rotates smoothly 360° with cursor movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) return;

      if (!stageRef.current) return;
      const rect = stageRef.current.getBoundingClientRect();
      const stageCenterY = rect.top + rect.height / 2;

      if (lastMousePosRef.current) {
        const dx = e.clientX - lastMousePosRef.current.x;
        
        // Continuous 360° horizontal rotation driven by cursor movement
        // Sensitivity: moving 380px horizontally traverses all 360° smoothly
        const sensitivity = 0.95;
        targetAngleRef.current = (targetAngleRef.current + dx * sensitivity + 360000) % 360;

        // Subtle 3D perspective pitch based on cursor height relative to doctor
        const relY = Math.max(-1, Math.min(1, (e.clientY - stageCenterY) / 300));
        targetTiltXRef.current = -relY * 6;
      }

      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // 5. Interactive drag and swipe support on stage
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartAngleRef.current = targetAngleRef.current;
  };

  const handleGlobalMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleStageMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const diffX = e.clientX - dragStartXRef.current;
    targetAngleRef.current = (dragStartAngleRef.current + diffX * 1.1 + 360000) % 360;
  };

  // 6. Mouse wheel scrub support over doctor
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    targetAngleRef.current = (targetAngleRef.current + e.deltaY * 0.4 + 360000) % 360;
  };

  // 7. Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      dragStartXRef.current = e.touches[0].clientX;
      dragStartAngleRef.current = targetAngleRef.current;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      const diffX = e.touches[0].clientX - dragStartXRef.current;
      targetAngleRef.current = (dragStartAngleRef.current + diffX * 1.0 + 360000) % 360;
    }
  };

  return (
    <div 
      className="cf-doctor-360-center-stage"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '720px',
        margin: '2px 0 8px 0',
        userSelect: 'none'
      }}
      onMouseUp={handleGlobalMouseUp}
      onMouseLeave={handleGlobalMouseUp}
    >
      {/* 360° Turntable Stage Container */}
      <div 
        ref={stageRef}
        className="cf-robot-doctor-stage"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          handleGlobalMouseUp();
        }}
        onClick={onDoctorClick}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleStageMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        style={{
          cursor: 'ew-resize',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingBottom: '6px'
        }}
      >
        {/* Ambient Ground Pedestal Glow */}
        <div className="cf-robot-pedestal-glow" />

        {/* Synchronized Breathing Ground Shadow */}
        <div className="cf-robot-ground-shadow" />

        {/* Rotating Holographic Telemetry Floor Ring from Picture 2 */}
        <div 
          ref={ringRef}
          className="cf-robot-hologram-ring" 
          style={{ willChange: 'transform' }}
        />

        {/* 60Hz Retina Canvas for Buttery Smooth Continuous 360 Rotation */}
        <div 
          className="cf-robot-360-frame-container"
          title="Move cursor left/right or drag to rotate Dr. AI in 360°!"
          style={{
            position: 'relative',
            width: '170px',
            height: '210px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transformStyle: 'preserve-3d',
            willChange: 'transform'
          }}
        >
          <canvas
            ref={canvasRef}
            width={280}
            height={400}
            style={{
              width: '140px',
              height: '200px',
              display: 'block',
              filter: 'drop-shadow(0 14px 28px rgba(13, 148, 136, 0.38))',
              willChange: 'transform',
              pointerEvents: 'none'
            }}
          />
        </div>

        {/* Status Badge (NO DEGREE INDICATOR) */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '6px',
          background: 'var(--bg-card, #ffffff)',
          border: '1px solid var(--border-color, #e2e8f0)',
          padding: '4px 14px',
          borderRadius: '9999px',
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
          zIndex: 4
        }}>
          <span style={{ 
            width: '7px', 
            height: '7px', 
            borderRadius: '50%', 
            background: '#10b981', 
            boxShadow: '0 0 8px #10b981',
            animation: 'cf-pulse-glow 2s infinite' 
          }} />
          <span style={{ 
            fontSize: '0.72rem', 
            fontWeight: 800, 
            color: 'var(--primary, #0d9488)', 
            letterSpacing: '0.05em', 
            textTransform: 'uppercase' 
          }}>
            Dr. AI Clinical Concierge Online
          </span>
        </div>
      </div>
    </div>
  );
};

export default Doctor360CenterStage;
