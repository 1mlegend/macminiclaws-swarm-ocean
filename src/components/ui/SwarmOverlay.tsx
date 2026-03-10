import { useState, useEffect } from 'react';
import { getSwarmStats } from '@/data/nodes';
import { useSwarmStore } from '@/stores/swarmStore';
import { useWallet } from '@/hooks/useWallet';

export function SwarmOverlay() {
  const baseStats = getSwarmStats();
  const { swarmActive, activeCluster } = useSwarmStore();
  const { shortAddress, wrongNetwork, hasEthereum, connect, switchToBase } = useWallet();

  // Animated fluctuating stats
  const [onlineFlux, setOnlineFlux] = useState(0);
  const [coreFlux, setCoreFlux] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineFlux(Math.floor(Math.random() * 5) - 2);
      setCoreFlux(Math.floor(Math.random() * 65) - 32);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const walletLabel = shortAddress
    ? wrongNetwork
      ? 'Switch to Base'
      : shortAddress
    : hasEthereum
      ? 'Connect Wallet'
      : 'Install MetaMask';

  const handleWalletClick = () => {
    if (shortAddress && wrongNetwork) {
      switchToBase();
    } else {
      connect();
    }
  };

  return (
    <>
      {/* Top Left — Logo */}
      <div className="fixed top-6 left-6 z-10">
        <h1 className="font-pixel text-sm text-primary glow-red tracking-wider">
          MACMINICLAWS
        </h1>
        <p className="text-[10px] text-muted-foreground mt-1 tracking-widest uppercase">
          Swarm Compute Network
        </p>
      </div>

      {/* Top Right — Wallet */}
      <div className="fixed top-6 right-6 z-10">
        <button
          onClick={handleWalletClick}
          className="px-4 py-2 border border-primary/40 rounded-md text-xs text-primary bg-card/80 backdrop-blur-sm hover:bg-primary/20 hover:shadow-[0_0_15px_hsl(0_75%_55%/0.4)] transition-all glow-box font-mono"
        >
          {walletLabel}
        </button>
      </div>

      {/* Bottom Left — Animated Stats */}
      <div className="fixed bottom-6 left-6 z-10 bg-card/70 backdrop-blur-sm border border-border rounded-md p-4 glow-box">
        <div className="flex items-center gap-2 mb-3">
          {/* Live indicator dot */}
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
          <p className="font-pixel text-[8px] text-primary tracking-wider">SWARM STATUS</p>
        </div>
        <div className="space-y-1.5 text-xs font-mono">
          <div className="flex justify-between gap-8">
            <span className="text-muted-foreground">Nodes online</span>
            <span className="text-foreground">{baseStats.online + onlineFlux}</span>
          </div>
          <div className="flex justify-between gap-8">
            <span className="text-muted-foreground">Active swarms</span>
            <span className="text-foreground">{baseStats.clusters} clusters</span>
          </div>
          <div className="flex justify-between gap-8">
            <span className="text-muted-foreground">Total compute</span>
            <span className="text-foreground">{(baseStats.totalCores + coreFlux).toLocaleString()} cores</span>
          </div>
        </div>
        {/* Swarm mode indicator */}
        {swarmActive && (
          <div className="mt-3 pt-2 border-t border-primary/20">
            <p className="font-pixel text-[7px] text-primary glow-red animate-pulse-glow">
              SWARM ACTIVE — {activeCluster.length} nodes
            </p>
          </div>
        )}
      </div>

      {/* Bottom Right — Controls hint */}
      <div className="fixed bottom-6 right-6 z-10 bg-card/50 backdrop-blur-sm border border-border/50 rounded-md px-4 py-3 text-center">
        <div className="flex items-center gap-1 justify-center mb-1.5">
          <kbd className="px-1.5 py-0.5 rounded border border-border/60 bg-card/80 text-[10px] text-muted-foreground font-mono">↑</kbd>
        </div>
        <div className="flex items-center gap-1 justify-center">
          <kbd className="px-1.5 py-0.5 rounded border border-border/60 bg-card/80 text-[10px] text-muted-foreground font-mono">←</kbd>
          <kbd className="px-1.5 py-0.5 rounded border border-border/60 bg-card/80 text-[10px] text-muted-foreground font-mono">↓</kbd>
          <kbd className="px-1.5 py-0.5 rounded border border-border/60 bg-card/80 text-[10px] text-muted-foreground font-mono">→</kbd>
        </div>
        <p className="text-[9px] text-muted-foreground mt-1.5 tracking-wide">Move camera</p>
      </div>
    </>
  );
}
