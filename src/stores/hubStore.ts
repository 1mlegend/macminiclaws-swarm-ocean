import { create } from 'zustand';

interface HubStore {
  position: [number, number, number];
  setPosition: (pos: [number, number, number]) => void;
}

export const useHubStore = create<HubStore>((set) => ({
  position: [0, 0.8, 0],
  setPosition: (pos) => set({ position: pos }),
}));
