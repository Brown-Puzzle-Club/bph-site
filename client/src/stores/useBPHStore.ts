import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface BPHState {
  bluenoirOpen: boolean;
  votingModalOpen: boolean;
  bluenoirText: string;
}

interface BPHActions {
  toggleBluenoirOpen: () => void;
  setBluenoirOpen: (open: boolean) => void;
  bluenoirSpeak: (text: string, forceOpen?: boolean) => void;
  toggleVotingModalOpen: () => void;
  setVotingModalOpen: (open: boolean) => void;
}

const initialBPHState: BPHState = {
  bluenoirOpen: false,
  votingModalOpen: false,
  bluenoirText: "Hello!",
};

const useBPHStore = create<BPHState & BPHActions>()(
  immer((set, get) => ({
    ...initialBPHState,
    toggleBluenoirOpen: () => set((state) => ({ bluenoirOpen: !state.bluenoirOpen })),
    setBluenoirOpen: (open) => set({ bluenoirOpen: open }),
    toggleVotingModalOpen: () => set((state) => ({ votingModalOpen: !state.bluenoirOpen })),
    setVotingModalOpen: (open) => set({ votingModalOpen: open }),
    bluenoirSpeak: (text, forceOpen = false) =>
      set({ bluenoirText: text, bluenoirOpen: get().bluenoirOpen || forceOpen }),
  })),
);

export default useBPHStore;
