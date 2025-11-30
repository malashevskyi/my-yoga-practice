import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CompletedTimer, TimerSession } from "../types/history";
import type { TimerStep } from "../types/timer";

interface HistoryStore {
  sessions: TimerSession[];
  currentSessionId: string | null;

  // Actions
  startSession: () => void;
  addCompletedTimer: (step: TimerStep) => void;
  clearHistory: () => void;
  getRecentTimers: (limit?: number) => CompletedTimer[];
}

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSessionId: null,

      startSession: () => {
        const sessionId = `session-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        const newSession: TimerSession = {
          id: sessionId,
          startedAt: Date.now(),
          completedTimers: [],
        };

        set({
          currentSessionId: sessionId,
          sessions: [...get().sessions, newSession],
        });
      },

      addCompletedTimer: (step: TimerStep) => {
        const { currentSessionId, sessions } = get();

        if (!currentSessionId) {
          // Start a new session if none exists
          get().startSession();
          return get().addCompletedTimer(step);
        }

        const completedTimer: CompletedTimer = {
          id: `timer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          step,
          completedAt: Date.now(),
          sessionId: currentSessionId,
        };

        const updatedSessions = sessions.map((session) =>
          session.id === currentSessionId
            ? {
                ...session,
                completedTimers: [...session.completedTimers, completedTimer],
              }
            : session,
        );

        set({ sessions: updatedSessions });
      },

      clearHistory: () => {
        set({
          sessions: [],
          currentSessionId: null,
        });
      },

      getRecentTimers: (limit = 10) => {
        const allTimers: CompletedTimer[] = [];

        get().sessions.forEach((session) => {
          allTimers.push(...session.completedTimers);
        });

        // Sort by completedAt descending (most recent first)
        return allTimers
          .sort((a, b) => b.completedAt - a.completedAt)
          .slice(0, limit);
      },
    }),
    {
      name: "yoga-timer-history",
    },
  ),
);
