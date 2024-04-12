import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { BluenoirReaction, type Dialogue } from "@/utils/bluenoir_dialogue";

export const TOP_LEFT = { x: 0.05, y: 0.13 } as const;
export const BOTTOM_LEFT = { x: 0.05, y: 0.85 } as const;
export const CENTER = { x: 0.4, y: 0.4 } as const;

export interface Position {
  x: number;
  y: number;
}
interface BluenoirState {
  bluenoirOpen: boolean;
  bluenoirDialogue: Dialogue;
  bluenoirPreviousPosition: Position;
  bluenoirCurrentPosition: Position;
  bluenoirCentered: boolean;
  bluenoirIdleDialogueFunction: (() => Dialogue) | null;
  bluenoirIntervalId: NodeJS.Timeout | null;
}

interface BluenoirActions {
  setBluenoirOpen: (open: boolean) => void;
  toggleBluenoirOpen: () => void;
  bluenoirSpeak: (text?: Dialogue) => void;
  setRandomDialogueFunction: (dialogueFunction: () => Dialogue) => void;
  getPreviousPosition: () => Position;
  getBluenoirPosition: () => Position;
  setBluenoirPosition: (position: Position) => void;
  getNearestSnapPoint: (position?: Position) => Position;
  toggleBluenoirCentered: () => void;
  startIdleTimer: (callback: () => void, duration: number) => void;
  stopIdleTimer: () => void;
  restartIdleTimer: (callback: () => void, duration: number) => void;
}

interface VotingState {
  votingModalOpen: boolean;
}

interface VotingActions {
  toggleVotingModalOpen: () => void;
  setVotingModalOpen: (open: boolean) => void;
}

interface BPHState extends BluenoirState, VotingState {}

interface BPHActions extends BluenoirActions, VotingActions {}

const initialBluenoirState: BluenoirState = {
  bluenoirOpen: false,
  bluenoirDialogue: {
    text: "Heya kiddo, these cases are starting to get out of hand... I'll talk to you at the funeral.",
    reaction: BluenoirReaction.NEUTRAL,
  },
  bluenoirCurrentPosition: TOP_LEFT,
  bluenoirPreviousPosition: TOP_LEFT,
  bluenoirCentered: false,
  bluenoirIdleDialogueFunction: null,
  bluenoirIntervalId: null,
};

const initialVotingState: VotingState = {
  votingModalOpen: false,
};

const initialBPHState: BPHState = {
  ...initialBluenoirState,
  ...initialVotingState,
};

const distSq = (p1: Position, p2: Position) => (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2;

const useBPHStore = create<BPHState & BPHActions>()(
  immer((set, get) => ({
    ...initialBPHState,
    setBluenoirOpen: (open) => set({ bluenoirOpen: open }),
    toggleBluenoirOpen: () => set((state) => ({ bluenoirOpen: !state.bluenoirOpen })),
    bluenoirSpeak: (text) => {
      const dialogueGenerator = get().bluenoirIdleDialogueFunction;
      set((state) => ({
        bluenoirDialogue:
          text ?? (dialogueGenerator ? dialogueGenerator() : state.bluenoirDialogue),
        bluenoirOpen: true,
      }));
    },
    setRandomDialogueFunction: (dialogueFunction) =>
      set({ bluenoirIdleDialogueFunction: dialogueFunction }),
    getPreviousPosition: () => get().bluenoirPreviousPosition,
    getBluenoirPosition: () => ({
      x: get().bluenoirCurrentPosition.x * window.innerWidth,
      y: get().bluenoirCurrentPosition.y * window.innerHeight,
    }),
    setBluenoirPosition: (position) => {
      set((state) => ({
        bluenoirCurrentPosition: position,
        bluenoirPreviousPosition:
          position === state.bluenoirCurrentPosition
            ? state.bluenoirPreviousPosition
            : state.bluenoirCurrentPosition,
      }));
    },
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
    toggleBluenoirCentered: () => {
      console.log("toggling centered");
      set((state) => ({ bluenoirCentered: !state.bluenoirCentered }));
    },
    startIdleTimer: (callback, duration) => {
      if (get().bluenoirIntervalId) return;
      const intervalId = setInterval(() => {
        callback();
      }, duration);

      set({ bluenoirIntervalId: intervalId });
    },
    stopIdleTimer: () => {
      const intervalId = get().bluenoirIntervalId;
      if (!intervalId) return;
      clearInterval(intervalId);
      set({ bluenoirIntervalId: null });
    },
    restartIdleTimer: (callback, duration) => {
      const intervalId = get().bluenoirIntervalId;
      if (intervalId) clearInterval(intervalId);
      const newIntervalId = setInterval(() => {
        callback();
      }, duration);

      set({ bluenoirIntervalId: newIntervalId });
    },
    setVotingModalOpen: (open) => set({ votingModalOpen: open }),
    toggleVotingModalOpen: () => set((state) => ({ votingModalOpen: !state.votingModalOpen })),
  })),
);

export default useBPHStore;
