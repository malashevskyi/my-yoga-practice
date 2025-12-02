import { create } from "zustand";
import type { TimerStep, TimerStatus } from "../types/timer";
import { useHistoryStore } from "./historyStore";

interface TimerStore {
  queue: TimerStep[];
  activeTimerIndex: number;
  timeLeft: number;
  status: TimerStatus;
  isLooping: boolean;
  totalProgress: number;
  startTime: number | null; // Timestamp when current step started
  pausedTime: number; // Accumulated paused time
  gongToPlay: string | null; // URL of gong to play
  isTransitioning: boolean; // True during 3-second pause between timers

  // Actions
  setQueue: (steps: TimerStep[]) => void;
  start: () => void;
  pause: () => void;
  resetCurrent: () => void;
  clearAll: () => void; // Clear all timers and reset to initial state
  skipNext: () => void;
  updateTime: () => void; // Renamed from tick - updates based on real time
  setIsLooping: (value: boolean) => void;
  clearGong: () => void;
}

export const useTimerStore = create<TimerStore>((set, get) => ({
  queue: [],
  activeTimerIndex: 0,
  timeLeft: 0,
  status: "idle",
  isLooping: false,
  totalProgress: 0,
  startTime: null,
  pausedTime: 0,
  gongToPlay: null,
  isTransitioning: false,

  setQueue: (steps) => {
    set({
      queue: steps,
      activeTimerIndex: 0,
      timeLeft: steps.length > 0 ? steps[0].duration : 0,
      status: "idle",
      totalProgress: 0,
      startTime: null,
      pausedTime: 0,
    });
  },

  start: () => {
    const { queue, timeLeft, startTime } = get();
    if (queue.length === 0) return;

    // If starting from completed or first time, ensure timeLeft is set
    if (timeLeft === 0 && queue.length > 0) {
      set({
        timeLeft: queue[0].duration,
        activeTimerIndex: 0,
        status: "running",
        startTime: Date.now(),
        pausedTime: 0,
      });
    } else {
      // Resuming from pause
      set({
        status: "running",
        startTime: startTime || Date.now(),
      });
    }
  },

  pause: () => {
    const { startTime, pausedTime } = get();
    if (startTime) {
      const elapsed = Date.now() - startTime;
      set({
        status: "paused",
        pausedTime: pausedTime + elapsed,
        startTime: null,
      });
    }
  },

  resetCurrent: () => {
    const { queue, activeTimerIndex } = get();
    if (queue[activeTimerIndex]) {
      set({
        timeLeft: queue[activeTimerIndex].duration,
        totalProgress: 0,
        startTime: null,
        pausedTime: 0,
        status: "paused",
        isTransitioning: false,
        gongToPlay: null,
      });
    }
  },

  skipNext: () => {
    const { queue, activeTimerIndex, isLooping } = get();
    const nextIndex = activeTimerIndex + 1;

    if (nextIndex < queue.length) {
      // Move to next step
      set({
        activeTimerIndex: nextIndex,
        timeLeft: queue[nextIndex].duration,
        totalProgress: 0,
        startTime: Date.now(),
        pausedTime: 0,
      });
    } else {
      // End of queue
      if (isLooping && queue.length > 0) {
        // Loop back to start
        set({
          activeTimerIndex: 0,
          timeLeft: queue[0].duration,
          totalProgress: 0,
          startTime: Date.now(),
          pausedTime: 0,
        });
      } else {
        // Complete
        set({
          status: "completed",
          totalProgress: 100,
          startTime: null,
          pausedTime: 0,
        });
      }
    }
  },

  updateTime: () => {
    const {
      status,
      queue,
      activeTimerIndex,
      isLooping,
      startTime,
      pausedTime,
      isTransitioning,
    } = get();

    // Don't update if paused, not started, or transitioning between timers
    if (status !== "running" || !startTime || isTransitioning) return;

    const currentStep = queue[activeTimerIndex];
    if (!currentStep) return;

    // Calculate elapsed time based on real timestamps
    const MS_PER_SECOND = 1000;
    const totalElapsed = pausedTime + (Date.now() - startTime);
    const elapsedSeconds = Math.floor(totalElapsed / MS_PER_SECOND);
    const newTimeLeft = Math.max(0, currentStep.duration - elapsedSeconds);
    const progress = (elapsedSeconds / currentStep.duration) * 100;

    // Update time left and progress
    set({
      timeLeft: newTimeLeft,
      totalProgress: Math.min(progress, 100),
    });

    // Check if step is complete
    if (newTimeLeft === 0) {
      const nextIndex = activeTimerIndex + 1;
      const hasMoreSteps = nextIndex < queue.length || isLooping;

      // Determine which gong to play:
      // - two-gongs.mp3: after each timer except the last one
      // - one-gong.mp3: after the very last timer
      const gongUrl = hasMoreSteps
        ? "/gongs/two-gongs.mp3"
        : "/gongs/one-gong.mp3";

      // Add completed timer to history
      useHistoryStore.getState().addCompletedTimer(currentStep);

      // ALWAYS play gong first and mark as transitioning
      // Add timestamp to force new gong even if same file
      const gongUrlWithTimestamp = `${gongUrl}?t=${Date.now()}`;

      set({
        gongToPlay: gongUrlWithTimestamp,
        isTransitioning: true,
        timeLeft: 0, // Keep it at 0 during transition
      });

      if (nextIndex < queue.length) {
        // Move to next step after 3 second pause
        setTimeout(() => {
          const currentState = get();
          // Only proceed if we're still on the same step (user didn't skip/reset)
          if (
            currentState.activeTimerIndex === activeTimerIndex &&
            currentState.isTransitioning
          ) {
            set({
              activeTimerIndex: nextIndex,
              timeLeft: queue[nextIndex].duration,
              totalProgress: 0,
              startTime: Date.now(),
              pausedTime: 0,
              // DON'T clear gongToPlay - let it finish playing
              isTransitioning: false,
            });
          }
        }, 3000); // 3 second pause between timers
      } else {
        // End of queue
        if (isLooping && queue.length > 0) {
          // Loop back to start after 3 second pause
          setTimeout(() => {
            const currentState = get();
            if (
              currentState.activeTimerIndex === activeTimerIndex &&
              currentState.isTransitioning
            ) {
              set({
                activeTimerIndex: 0,
                timeLeft: queue[0].duration,
                totalProgress: 0,
                startTime: Date.now(),
                pausedTime: 0,
                // DON'T clear gongToPlay - let it finish playing
                isTransitioning: false,
              });
            }
          }, 3000);
        } else {
          // Complete - keep gong playing, don't clear it
          set({
            status: "completed",
            totalProgress: 100,
            startTime: null,
            pausedTime: 0,
            isTransitioning: false,
          });
        }
      }
    }
  },

  setIsLooping: (value) => {
    set({ isLooping: value });
  },

  clearGong: () => {
    set({ gongToPlay: null });
  },

  clearAll: () => {
    set({
      queue: [],
      activeTimerIndex: 0,
      timeLeft: 0,
      status: "idle",
      totalProgress: 0,
      startTime: null,
      pausedTime: 0,
      isTransitioning: false,
      gongToPlay: null,
    });
  },
}));
