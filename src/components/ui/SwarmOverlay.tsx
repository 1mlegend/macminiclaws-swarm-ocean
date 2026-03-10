import { getSwarmStats } from '@/data/nodes';

export function SwarmOverlay() {
  const stats = getSwarmStats();

  return (
    <>
      {/* Top Left - Logo */}
      <div className="fixed top-6 left-6 z-10">
        <h1 className="font-pixel text-sm text-primary glow-blue tracking-wider">
          MACMINICLAWS
        </h1>
        <p className="text-[10px] text-muted-foreground mt-1 tracking-widest uppercase">
          Swarm Compute Network
        </p>
      </div>

      {/* Top Right - Wallet */}
      <div className="fixed top-6 right-6 z-10">
        <button className="px-4 py-2 border border-primary/40 rounded-md text-xs text-primary bg-card/80 backdrop-blur-sm hover:bg-primary/10 transition-all glow-box font-mono">
          Connect Wallet
        </button>
      </div>

      {/* Bottom Left - Stats */}
      <div className="fixed bottom-6 left-6 z-10 bg-card/70 backdrop-blur-sm border border-border rounded-md p-4 glow-box">
        <p className="font-pixel text-[8px] text-primary mb-3 tracking-wider">SWARM STATUS</p>
        <div className="space-y-1.5 text-xs font-mono">
          <div className="flex justify-between gap-8">
            <span className="text-muted-foreground">Nodes online</span>
            <span className="text-foreground">{stats.online}</span>
          </div>
          <div className="flex justify-between gap-8">
            <span className="text-muted-foreground">Active swarms</span>
            <span className="text-foreground">{stats.clusters} clusters</span>
          </div>
          <div className="flex justify-between gap-8">
            <span className="text-muted-foreground">Total compute</span>
            <span className="text-foreground">{stats.totalCores.toLocaleString()} cores</span>
          </div>
        </div>
      </div>
    </>
  );
}
