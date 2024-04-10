import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { BluenoirReaction, type Dialogue } from "@/utils/bluenoir_dialogue";

interface BPHState {
  bluenoirOpen: boolean;
  bluenoirDialogue: Dialogue;
  bluenoirPositionPercentage: { x: number; y: number };
  randomDialogueFunction: () => Dialogue;

  votingModalOpen: boolean;
}

const TOP_LEFT = { x: 0.05, y: 0.13 } as const;
const BOTTOM_LEFT = { x: 0.05, y: 0.85 } as const;
const CENTER = { x: 0.5, y: 0.5 } as const;

interface Position {
  x: number;
  y: number;
}

type SnappablePosition = typeof TOP_LEFT | typeof BOTTOM_LEFT | typeof CENTER;

interface BPHActions {
  toggleBluenoirOpen: () => void;
  setBluenoirOpen: (open: boolean) => void;
  bluenoirSpeak: (text?: Dialogue, forceOpen?: boolean) => void;
  getBluenoirPosition: () => Position;
  setBluenoirPosition: (position: SnappablePosition) => void;
  getNearestSnapPoint: (position?: Position) => SnappablePosition;
  setRandomDialogueFunction: (dialogueFunction: () => Dialogue) => void;
  getRandomDialogue: () => Dialogue;
  toggleVotingModalOpen: () => void;
  setVotingModalOpen: (open: boolean) => void;
}

const initialBPHState: BPHState = {
  bluenoirOpen: false,
  votingModalOpen: false,
  bluenoirPositionPercentage: TOP_LEFT,
  bluenoirDialogue: { text: "Hello!", reaction: BluenoirReaction.HAPPY },
  randomDialogueFunction: () => ({ text: "Hello!", reaction: BluenoirReaction.HAPPY }),
};

const distSq = (p1: Position, p2: Position) => (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2;

const useBPHStore = create<BPHState & BPHActions>()(
  immer((set, get) => ({
    ...initialBPHState,
    toggleBluenoirOpen: () => set((state) => ({ bluenoirOpen: !state.bluenoirOpen })),
    setBluenoirOpen: (open) => set({ bluenoirOpen: open }),
    getBluenoirPosition: () => ({
      x: get().bluenoirPositionPercentage.x * window.innerWidth,
      y: get().bluenoirPositionPercentage.y * window.innerHeight,
    }),
    setBluenoirPosition: (position) => set({ bluenoirPositionPercentage: position }),
    getNearestSnapPoint: (position) => {
      const pos = position ?? get().getBluenoirPosition();
      const normalizedPosition = { x: pos.x / window.innerWidth, y: pos.y / window.innerHeight };

      // find the closest snap point
      const snapPoints = [TOP_LEFT, BOTTOM_LEFT];
      const orderedSnapPoints = snapPoints.sort(
        (a, b) => distSq(a, normalizedPosition) - distSq(b, normalizedPosition),
      );

      return orderedSnapPoints[0];
    },
    toggleVotingModalOpen: () => set((state) => ({ votingModalOpen: !state.bluenoirOpen })),
    setVotingModalOpen: (open) => set({ votingModalOpen: open }),
    bluenoirSpeak: (text, forceOpen = false) => {
      set({
        bluenoirDialogue: text ?? get().randomDialogueFunction(),
        bluenoirOpen: get().bluenoirOpen || forceOpen,
      });
    },
    setRandomDialogueFunction: (dialogueFunction) =>
      set({ randomDialogueFunction: dialogueFunction }),
    getRandomDialogue: () => get().randomDialogueFunction(),
  })),
);

export default useBPHStore;
