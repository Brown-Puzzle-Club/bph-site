import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface BPHState {
  bluenoirOpen: boolean;
  bluenoirText: string;
  bluenoirPositionPercentage: { x: number; y: number };
  votingModalOpen: boolean;
}

const TOP_LEFT = { x: 0.04, y: 0.13 } as const;
const TOP_RIGHT = { x: 0.94, y: 0.15 } as const;
const BOTTOM_LEFT = { x: 0.04, y: 0.9 } as const;
const BOTTOM_RIGHT = { x: 0.94, y: 0.9 } as const;
const CENTER = { x: 0.5, y: 0.5 } as const;

interface Position {
  x: number;
  y: number;
}

type SnappablePosition =
  | typeof TOP_LEFT
  | typeof TOP_RIGHT
  | typeof BOTTOM_LEFT
  | typeof BOTTOM_RIGHT
  | typeof CENTER;

interface BPHActions {
  toggleBluenoirOpen: () => void;
  setBluenoirOpen: (open: boolean) => void;
  bluenoirSpeak: (text: string, forceOpen?: boolean) => void;
  getBluenoirPosition: () => Position;
  setBluenoirPosition: (position: SnappablePosition) => void;
  getNearestSnapPoint: (position?: Position) => SnappablePosition;
  toggleVotingModalOpen: () => void;
  setVotingModalOpen: (open: boolean) => void;
}

const initialBPHState: BPHState = {
  bluenoirOpen: false,
  votingModalOpen: false,
  bluenoirPositionPercentage: TOP_LEFT,
  bluenoirText: "Hello!",
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
      const snapPoints = [TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT];
      const orderedSnapPoints = snapPoints.sort(
        (a, b) => distSq(a, normalizedPosition) - distSq(b, normalizedPosition),
      );

      return orderedSnapPoints[0];
    },
    toggleVotingModalOpen: () => set((state) => ({ votingModalOpen: !state.bluenoirOpen })),
    setVotingModalOpen: (open) => set({ votingModalOpen: open }),
    bluenoirSpeak: (text, forceOpen = false) =>
      set({ bluenoirText: text, bluenoirOpen: get().bluenoirOpen || forceOpen }),
  })),
);

export default useBPHStore;
