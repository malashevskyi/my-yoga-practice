import type { TimerStep } from "./timer";

export interface Preset {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string | null;
  steps: TimerStep[];
  duration_total: number;
}

export interface CreatePresetInput {
  name: string;
  description?: string;
  steps: TimerStep[];
}
