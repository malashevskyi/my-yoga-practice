export type TimerType = "timer" | "break" | "video";

export interface TimerStep {
  id: string;
  duration: number; // in seconds
  label: string;
  type: TimerType;
  videoUrl?: string;
}

export interface Preset {
  id: string;
  name: string;
  steps: TimerStep[];
}

export type TimerStatus = "idle" | "running" | "paused" | "completed";
