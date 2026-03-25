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
  const [jobPanelOpen, setJobPanelOpen] = useState(false);
  const { selectedNodeId, setSelectedNodeId, buildingOpen, setBuildingOpen, contractOpen, setContractOpen } = useSwarmStore();

  const handleNodeHover = useCallback((node: CrabNode | null, pos: { x: number; y: number } | null) => {
    setHoveredNode(node);
    setTooltipPos(pos);
  }, []);

  const handleNodeClick = useCallback((node: CrabNode) => {
    setSelectedNodeId(node.id);
  }, [setSelectedNodeId]);

  const selectedNode = selectedNodeId ? (nodes || []).find(n => n.id === selectedNodeId) ?? null : null;

  return (
    <div className="w-screen h-screen overflow-hidden bg-background">
      <OceanScene onNodeHover={handleNodeHover} onNodeClick={handleNodeClick} />
      <SwarmOverlay onOpenJobPanel={() => setJobPanelOpen(true)} />
      <MetricsDashboard />
      
      {hoveredNode && tooltipPos && (
        <NodeTooltip node={hoveredNode} position={tooltipPos} />
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