import type { TimerStep } from "./timer";

export interface CompletedTimer {
  id: string; // Unique ID for each completion
  step: TimerStep; // The timer step that was completed
  completedAt: number; // Timestamp when completed
  sessionId: string; // ID of the session (to group timers from same session)
}

export interface TimerSession {
  id: string; // Session ID
  startedAt: number; // When session started
  completedTimers: CompletedTimer[]; // All completed timers in this session
}
