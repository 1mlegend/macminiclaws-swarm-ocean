import { create } from 'zustand';

interface SwarmStore {
  activeCluster: string[];
  swarmActive: boolean;
  setSwarm: (ids: string[], active: boolean) => void;
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  buildingOpen: boolean;
  setBuildingOpen: (open: boolean) => void;
  contractOpen: boolean;
  setContractOpen: (open: boolean) => void;
}

export const useSwarmStore = create<SwarmStore>((set) => ({
  activeCluster: [],
  swarmActive: false,
  setSwarm: (ids, active) => set({ activeCluster: ids, swarmActive: active }),
  selectedNodeId: null,
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  buildingOpen: false,
  setBuildingOpen: (open) => set({ buildingOpen: open }),
  contractOpen: false,
  setContractOpen: (open) => set({ contractOpen: open }),
}));
