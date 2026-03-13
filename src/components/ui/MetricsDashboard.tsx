import { useNetworkMetrics, useBackendStatus } from '@/hooks/useNetworkData';
import { Activity, Cpu, Server, Zap, Clock, Layers } from 'lucide-react';

export function MetricsDashboard() {
  const { data: metrics } = useNetworkMetrics();
  const { data: backendOnline } = useBackendStatus();

  if (!metrics) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
      {/* Backend status indicator */}
      <div className="flex items-center gap-1.5 bg-card/70 backdrop-blur-sm border border-border rounded-md px-3 py-2">
        <span className={`w-1.5 h-1.5 rounded-full ${backendOnline ? 'bg-green-400 animate-pulse' : 'bg-muted-foreground'}`} />
        <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider">
          {backendOnline ? 'Live' : 'Mock'}
        </span>
      </div>

      {/* Metrics pills */}
      <MetricPill icon={<Server size={11} />} label="Nodes" value={metrics.onlineNodes} suffix={`/${metrics.totalNodes}`} />
      <MetricPill icon={<Cpu size={11} />} label="Compute" value={metrics.totalCompute} suffix=" cores" />
      <MetricPill icon={<Layers size={11} />} label="Clusters" value={metrics.activeClusters} />
      <MetricPill icon={<Zap size={11} />} label="Jobs" value={metrics.activeJobs} />
      <MetricPill icon={<Clock size={11} />} label="Latency" value={metrics.avgLatency} suffix="ms" />
    </div>
  );
}

function MetricPill({ icon, label, value, suffix }: { icon: React.ReactNode; label: string; value: number; suffix?: string }) {
  return (
    <div className="flex items-center gap-2 bg-card/70 backdrop-blur-sm border border-border rounded-md px-3 py-2 glow-box">
      <span className="text-primary">{icon}</span>
      <div className="flex flex-col">
        <span className="text-[8px] text-muted-foreground uppercase tracking-wider">{label}</span>
        <span className="text-xs font-mono text-foreground">
          {value.toLocaleString()}{suffix || ''}
        </span>
      </div>
    </div>
  );
}
