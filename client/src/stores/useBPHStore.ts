import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { IDLE_TIMER } from "@/components/bluenoir/Bluenoir";
import { BluenoirStories, getMainPageIdleDialogue, type Dialogue } from "@/utils/bluenoir_dialogue";
import type { VotingInfo } from "@/utils/django_types";

export const TOP_LEFT = { x: 0.05, y: 0.13 } as const;
export const BOTTOM_LEFT = { x: 0.05, y: 0.85 } as const;
export const CENTER = { x: 0.4, y: 0.4 } as const;
export const BOTTOM_CENTER = { x: 0.4, y: 0.75 } as const;
export const VERDICT_CENTER = { x: 0.493, y: 0.48 } as const;

export interface Position {
  x: number;
  y: number;
}
interface BluenoirState {
  bluenoirOpen: boolean;
  bluenoirDialogue: Dialogue;
  bluenoirPreviousPosition: Position;
  bluenoirCurrentPosition: Position;
  bluenoirCentered: typeof CENTER | typeof BOTTOM_CENTER | null;
  bluenoirIdleDialogueFunction: (() => Dialogue) | null;
  bluenoirIntervalId: NodeJS.Timeout | null;
  bluenoirStorylineSlug: string;
  bluenoirStorylineIndex: number;
}

interface BluenoirActions {
  setBluenoirOpen: (open: boolean) => void;
  toggleBluenoirOpen: () => void;
  bluenoirSpeak: (text?: Dialogue) => void;
  setRandomDialogueFunction: (dialogueFunction: () => Dialogue) => void;
  getPreviousPosition: () => Position;
  getBluenoirPosition: () => Position;
  setBluenoirPosition: (position: Position) => void;
  getNearestSnapPoint: (position?: Position, includeCenter?: boolean) => Position;
  setBluenoirCentered: (centered: typeof CENTER | typeof BOTTOM_CENTER | null) => void;
  toggleBluenoirCentered: () => void;
  startIdleTimer: (callback: () => void, duration: number) => void;
  stopIdleTimer: () => void;
  restartIdleTimer: (callback: () => void, duration: number) => void;
  setStoryline: (slug: string, centerOption?: typeof CENTER | typeof BOTTOM_CENTER) => void;
  nextStoryline: () => void;
  prevStoryline: () => void;
  stopStoryline: () => void;
}

interface VotingState {
  votingModalOpen: boolean;
  votingInfo: VotingInfo;
}

interface VotingActions {
  toggleVotingModalOpen: () => void;
  setVotingModalOpen: (open: boolean) => void;
  setVotingInfo: (votingInfo: VotingInfo) => void;
}

interface BPHState extends BluenoirState, VotingState {}

interface BPHActions extends BluenoirActions, VotingActions {}

const initialBluenoirState: BluenoirState = {
  bluenoirOpen: true,
  bluenoirDialogue: (() => getMainPageIdleDialogue())(),
  bluenoirCurrentPosition: BOTTOM_LEFT,
  bluenoirPreviousPosition: BOTTOM_LEFT,
  bluenoirCentered: null,
  bluenoirIdleDialogueFunction: getMainPageIdleDialogue,
  bluenoirIntervalId: null,
  bluenoirStorylineSlug: "",
  bluenoirStorylineIndex: 0,
};

const initialVotingState: VotingState = {
  votingModalOpen: false,
  votingInfo: {
    id: 0,
    cases: {},
    expiration_time: null,
    max_choices: 0,
  },
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
          position === state.bluenoirCurrentPosition || position === CENTER
            ? state.bluenoirPreviousPosition
            : state.bluenoirCurrentPosition,
      }));
    },
    getNearestSnapPoint: (position, includeCenter) => {
      const pos = position ?? get().getBluenoirPosition();
      const normalizedPosition = { x: pos.x / window.innerWidth, y: pos.y / window.innerHeight };

      const snapPoints = includeCenter
        ? [TOP_LEFT, BOTTOM_LEFT, VERDICT_CENTER]
        : [TOP_LEFT, BOTTOM_LEFT];
      console.log(snapPoints);
      // find the closest snap point
      const orderedSnapPoints = snapPoints.sort(
        (a, b) => distSq(a, normalizedPosition) - distSq(b, normalizedPosition),
      );

      return orderedSnapPoints[0];
    },
    setBluenoirCentered: (centered) => {
      set(() => ({ bluenoirCentered: centered }));
    },
    toggleBluenoirCentered: () => {
      set((state) => ({ bluenoirCentered: state.bluenoirCentered ? null : CENTER }));
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
    setStoryline: (slug: string, centerOption = CENTER) => {
      if (!BluenoirStories[slug]) return;
      get().restartIdleTimer(get().nextStoryline, 10 * 1000);
      get().bluenoirSpeak(BluenoirStories[slug].dialogues[0]);
      set(() => {
        return {
          bluenoirStorylineSlug: slug,
          bluenoirStorylineIndex: 0,
          bluenoirCentered: centerOption,
        };
      });
    },
    nextStoryline: () => {
      if (!get().bluenoirStorylineSlug) return;
      get().restartIdleTimer(get().nextStoryline, 10 * 1000);
      const newIndex = get().bluenoirStorylineIndex + 1;
      if (newIndex === BluenoirStories[get().bluenoirStorylineSlug].dialogues.length) {
        get().stopStoryline();
      } else {
        get().bluenoirSpeak(BluenoirStories[get().bluenoirStorylineSlug].dialogues[newIndex]);
        set({
          bluenoirStorylineIndex: newIndex,
        });
      }
    },
    prevStoryline: () => {
      if (!get().bluenoirStorylineSlug || get().bluenoirStorylineIndex === 0) return;
      get().stopIdleTimer();
      const newIndex = get().bluenoirStorylineIndex - 1;
      get().bluenoirSpeak(BluenoirStories[get().bluenoirStorylineSlug].dialogues[newIndex]);
      set({
        bluenoirStorylineIndex: newIndex,
      });
    },
    stopStoryline: () => {
      get().restartIdleTimer(get().bluenoirSpeak, IDLE_TIMER * 1000);
      set({
        bluenoirStorylineSlug: "",
        bluenoirStorylineIndex: 0,
        bluenoirCentered: null,
      });
    },
    setVotingModalOpen: (open) => {
      console.log("ran voting modal open!!");
      set({ votingModalOpen: open });
    },
    setVotingInfo: (info) => {
      console.log("ran set voting info!!");
      set({ votingInfo: info });
    },
    toggleVotingModalOpen: () => set((state) => ({ votingModalOpen: !state.votingModalOpen })),
  })),
);

export default useBPHStore;
