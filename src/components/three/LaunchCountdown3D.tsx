import { useState, useEffect } from 'react';
import { Html } from '@react-three/drei';

const LAUNCH_TIME = new Date("2026-03-16T20:00:00Z").getTime();

export function LaunchCountdown3D() {
  const [remaining, setRemaining] = useState(() => Math.max(0, LAUNCH_TIME - Date.now()));

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(Math.max(0, LAUNCH_TIME - Date.now()));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isLive = remaining <= 0;
  const totalSec = Math.floor(remaining / 1000);
  const hh = String(Math.floor(totalSec / 3600)).padStart(2, '0');
  const mm = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
  const ss = String(totalSec % 60).padStart(2, '0');

  return (
    <group position={[0, 8, 0]}>
      <Html center distanceFactor={15} style={{ pointerEvents: 'none', userSelect: 'none' }}>
        <div style={{
          textAlign: 'center',
          background: 'rgba(20, 8, 4, 0.75)',
          border: '1px solid rgba(200, 60, 30, 0.4)',
          borderRadius: '8px',
          padding: '12px 24px',
          backdropFilter: 'blur(6px)',
          boxShadow: '0 0 20px rgba(200, 60, 30, 0.3), 0 0 40px rgba(200, 60, 30, 0.1), inset 0 0 15px rgba(200, 60, 30, 0.05)',
          minWidth: '200px',
        }}>
          <div style={{
            fontFamily: "'Press Start 2P', cursive",
            fontSize: '8px',
            color: '#d97706',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            marginBottom: '8px',
            textShadow: '0 0 8px rgba(217, 119, 6, 0.6)',
          }}>
            $MMC LAUNCH
          </div>
          {isLive ? (
            <div style={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: '16px',
              color: '#ef4444',
              textShadow: '0 0 15px rgba(239, 68, 68, 0.8), 0 0 30px rgba(239, 68, 68, 0.4)',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}>
              $MMC LIVE
            </div>
          ) : (
            <div style={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: '18px',
              color: '#ef4444',
              letterSpacing: '4px',
              textShadow: '0 0 10px rgba(239, 68, 68, 0.8), 0 0 30px rgba(239, 68, 68, 0.4)',
            }}>
              {hh} : {mm} : {ss}
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}
