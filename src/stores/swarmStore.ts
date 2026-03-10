import { create } from 'zustand';

interface SwarmStore {
  // Swarm mode: active cluster node IDs
  activeCluster: string[];
  swarmActive: boolean;
  setSwarm: (ids: string[], active: boolean) => void;
  // Selected node for detail panel
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
}

export const useSwarmStore = create<SwarmStore>((set) => ({
  activeCluster: [],
  swarmActive: false,
  setSwarm: (ids, active) => set({ activeCluster: ids, swarmActive: active }),
  selectedNodeId: null,
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
}));
