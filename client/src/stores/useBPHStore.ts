import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface BPHState {
  bluenoirOpen: boolean;
  votingModalOpen: boolean;
}

interface BPHActions {
  toggleBluenoirOpen: () => void;
  setBluenoirOpen: (open: boolean) => void;
  toggleVotingModalOpen: () => void;
  setVotingModalOpen: (open: boolean) => void;
}

const useBPHStore = create<BPHState & BPHActions>()(
  immer((set) => ({
    bluenoirOpen: false,
    votingModalOpen: false,
    toggleBluenoirOpen: () => set((state) => ({ ...state, bluenoirOpen: !state.bluenoirOpen })),
    setBluenoirOpen: (open) => set((state) => ({ ...state, bluenoirOpen: open })),
    toggleVotingModalOpen: () =>
      set((state) => ({ ...state, votingModalOpen: !state.bluenoirOpen })),
    setVotingModalOpen: (open) => set((state) => ({ ...state, votingModalOpen: open })),
  })),
);

export default useBPHStore;
