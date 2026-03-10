import { CrabNode } from '@/data/nodes';

interface NodeTooltipProps {
  node: CrabNode;
  position: { x: number; y: number };
}

export function NodeTooltip({ node, position }: NodeTooltipProps) {
  return (
    <div
      className="fixed z-20 pointer-events-none bg-card/90 backdrop-blur-sm border border-primary/30 rounded-md p-3 glow-box"
      style={{
        left: position.x + 15,
        top: position.y - 60,
      }}
    >
      <p className="font-pixel text-[8px] text-primary mb-2">{node.id}</p>
      <div className="space-y-1 text-[11px] font-mono">
        <div className="flex justify-between gap-6">
          <span className="text-muted-foreground">Status</span>
          <span className={node.status === 'online' ? 'text-green-400' : 'text-red-400'}>
            {node.status.toUpperCase()}
          </span>
        </div>
        <div className="flex justify-between gap-6">
          <span className="text-muted-foreground">Power</span>
          <span className="text-foreground">{node.cores} cores</span>
        </div>
        <div className="flex justify-between gap-6">
          <span className="text-muted-foreground">Reputation</span>
          <span className="text-foreground">{node.reputation}%</span>
        </div>
      </div>
    </div>
  );
}
