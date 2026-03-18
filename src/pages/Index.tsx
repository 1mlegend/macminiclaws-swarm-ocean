import { useState, useCallback } from 'react';
import { OceanScene } from '@/components/three/OceanScene';
import { SwarmOverlay } from '@/components/ui/SwarmOverlay';
import { MetricsDashboard } from '@/components/ui/MetricsDashboard';

import { NodeTooltip } from '@/components/ui/NodeTooltip';
import { NodeDetailPanel } from '@/components/ui/NodeDetailPanel';
import { BuildingPopup } from '@/components/ui/BuildingPopup';
import { ContractPopup } from '@/components/ui/ContractPopup';
import { JobSubmitPanel } from '@/components/ui/JobSubmitPanel';
import { CrabNode } from '@/data/nodes';
import { useNodes } from '@/hooks/useNetworkData';
import { useSwarmStore } from '@/stores/swarmStore';

const Index = () => {
  const { data: nodes } = useNodes();
  const [hoveredNode, setHoveredNode] = useState<CrabNode | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [devTooltip, setDevTooltip] = useState<{ x: number; y: number } | null>(null);
  const [jobPanelOpen, setJobPanelOpen] = useState(false);
  const { selectedNodeId, setSelectedNodeId, buildingOpen, setBuildingOpen, contractOpen, setContractOpen } = useSwarmStore();

  const handleNodeHover = useCallback((node: CrabNode | null, pos: { x: number; y: number } | null) => {
    setHoveredNode(node);
    setTooltipPos(pos);
  }, []);

  const handleNodeClick = useCallback((node: CrabNode) => {
    setSelectedNodeId(node.id);
  }, [setSelectedNodeId]);

  const handleDevHover = useCallback((pos: { x: number; y: number }) => {
    setDevTooltip(pos);
  }, []);

  const handleDevUnhover = useCallback(() => {
    setDevTooltip(null);
  }, []);

  const selectedNode = selectedNodeId ? (nodes || []).find(n => n.id === selectedNodeId) ?? null : null;

  return (
    <div className="w-screen h-screen overflow-hidden bg-background">
      <OceanScene onNodeHover={handleNodeHover} onNodeClick={handleNodeClick} onDevHover={handleDevHover} onDevUnhover={handleDevUnhover} />
      <SwarmOverlay onOpenJobPanel={() => setJobPanelOpen(true)} />
      <MetricsDashboard />
      
      {hoveredNode && tooltipPos && (
        <NodeTooltip node={hoveredNode} position={tooltipPos} />
      )}
      {devTooltip && (
        <div
          className="fixed z-20 pointer-events-none bg-card/90 backdrop-blur-sm border border-primary/30 rounded-md px-3 py-2 glow-box"
          style={{ left: devTooltip.x + 15, top: devTooltip.y - 50 }}
        >
          <p className="font-pixel text-[9px] text-primary">Orpi_ping</p>
          <p className="text-[10px] font-mono text-muted-foreground">Builder</p>
        </div>
      )}
      {selectedNode && (
        <NodeDetailPanel node={selectedNode} onClose={() => setSelectedNodeId(null)} />
      )}
      {buildingOpen && (
        <BuildingPopup onClose={() => setBuildingOpen(false)} />
      )}
      {contractOpen && (
        <ContractPopup onClose={() => setContractOpen(false)} />
      )}
      {jobPanelOpen && (
        <JobSubmitPanel onClose={() => setJobPanelOpen(false)} />
      )}
    </div>
  );
};

export default Index;
