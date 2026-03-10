import { useState, useCallback } from 'react';
import { OceanScene } from '@/components/three/OceanScene';
import { SwarmOverlay } from '@/components/ui/SwarmOverlay';
import { NodeTooltip } from '@/components/ui/NodeTooltip';
import { NodeDetailPanel } from '@/components/ui/NodeDetailPanel';
import { CrabNode, swarmNodes } from '@/data/nodes';
import { useSwarmStore } from '@/stores/swarmStore';

const Index = () => {
  const [hoveredNode, setHoveredNode] = useState<CrabNode | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const { selectedNodeId, setSelectedNodeId } = useSwarmStore();

  const handleNodeHover = useCallback((node: CrabNode | null, pos: { x: number; y: number } | null) => {
    setHoveredNode(node);
    setTooltipPos(pos);
  }, []);

  const handleNodeClick = useCallback((node: CrabNode) => {
    setSelectedNodeId(node.id);
  }, [setSelectedNodeId]);

  const selectedNode = selectedNodeId ? swarmNodes.find(n => n.id === selectedNodeId) ?? null : null;

  return (
    <div className="w-screen h-screen overflow-hidden bg-background">
      <OceanScene onNodeHover={handleNodeHover} onNodeClick={handleNodeClick} />
      <SwarmOverlay />
      {hoveredNode && tooltipPos && (
        <NodeTooltip node={hoveredNode} position={tooltipPos} />
      )}
      {selectedNode && (
        <NodeDetailPanel node={selectedNode} onClose={() => setSelectedNodeId(null)} />
      )}
    </div>
  );
};

export default Index;
