import { useState, useEffect } from 'react';

const LAUNCH_TIME = new Date("2026-03-16T20:00:00Z").getTime();

export function LaunchCountdown() {
  const [remaining, setRemaining] = useState(() => Math.max(0, LAUNCH_TIME - Date.now()));

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Math.max(0, LAUNCH_TIME - Date.now());
      setRemaining(diff);
      if (diff <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isLive = remaining <= 0;
  const totalSec = Math.floor(remaining / 1000);
  const hh = String(Math.floor(totalSec / 3600)).padStart(2, '0');
  const mm = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
  const ss = String(totalSec % 60).padStart(2, '0');

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center pointer-events-none select-none">
      <div className="bg-card/70 backdrop-blur-sm border border-primary/30 rounded-md px-6 py-3 glow-box text-center">
        <p className="font-pixel text-[9px] text-secondary tracking-widest uppercase mb-2">
          $MMC LAUNCH
        </p>
        {isLive ? (
          <p className="font-pixel text-lg text-primary glow-red animate-pulse-glow tracking-wider">
            $MMC LIVE
          </p>
        ) : (
          <p className="font-pixel text-lg text-primary glow-red tracking-[0.3em]"
             style={{ animationName: 'pulse', animationDuration: '2s', animationIterationCount: 'infinite', animationTimingFunction: 'ease-in-out' }}>
            {hh} : {mm} : {ss}
          </p>
        )}
      </div>
    </div>
  );
}
