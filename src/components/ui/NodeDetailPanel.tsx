import { CrabNode } from '@/data/nodes';
import { X } from 'lucide-react';

interface NodeDetailPanelProps {
  node: CrabNode;
  onClose: () => void;
}

function randomHex(len: number) {
  return Array.from({ length: len }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

export function NodeDetailPanel({ node, onClose }: NodeDetailPanelProps) {
  const jobs = Math.floor(50 + Math.random() * 500);
  const uptime = (95 + Math.random() * 4.9).toFixed(1);
  const ram = [8, 16, 32, 64][Math.floor(Math.random() * 4)];
  const wallet = `0x${randomHex(4)}...${randomHex(4)}`;

  return (
    <div className="fixed top-0 right-0 h-full w-80 z-30 bg-card/90 backdrop-blur-md border-l-2 border-primary/50 p-6 font-mono text-sm animate-in slide-in-from-right duration-300 overflow-y-auto">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition-colors"
      >
        <X size={18} />
      </button>

      <h2 className="font-pixel text-[9px] text-primary glow-red tracking-wider mb-4">
        CLAW NODE DETAILS
      </h2>
      <div className="w-full h-px bg-primary/30 mb-4" />

      <div className="space-y-3 text-xs">
        <Row label="Node ID" value={node.id} />
        <Row label="Status" value={node.status.toUpperCase()} highlight={node.status === 'online'} />
        <Row label="Cores" value={`${node.cores}`} />
        <Row label="RAM" value={`${ram} GB`} />
        <Row label="Reputation" value={`${node.reputation}%`} />
        <Row label="Jobs done" value={`${jobs}`} />
        <Row label="Uptime" value={`${uptime}%`} />
        <Row label="Network" value="Base" />
        <Row label="Wallet" value={wallet} />
      </div>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className={highlight ? 'text-green-400' : 'text-foreground'}>{value}</span>
    </div>
  );
}
