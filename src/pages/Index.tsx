import { useState, useCallback } from 'react';
import { OceanScene } from '@/components/three/OceanScene';
import { SwarmOverlay } from '@/components/ui/SwarmOverlay';
import { NodeTooltip } from '@/components/ui/NodeTooltip';
import { CrabNode } from '@/data/nodes';

const Index = () => {
  const [hoveredNode, setHoveredNode] = useState<CrabNode | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const handleNodeHover = useCallback((node: CrabNode | null, pos: { x: number; y: number } | null) => {
    setHoveredNode(node);
    setTooltipPos(pos);
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-background">
      <OceanScene onNodeHover={handleNodeHover} />
      <SwarmOverlay />
      {hoveredNode && tooltipPos && (
        <NodeTooltip node={hoveredNode} position={tooltipPos} />
      )}
    </div>
  );
};

export default Index;
