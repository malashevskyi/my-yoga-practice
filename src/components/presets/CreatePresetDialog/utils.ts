import type { TimerStep } from "../../../types/timer";

export interface PresetFormValues {
  name: string;
  description: string;
  steps: TimerStep[];
}

const DEFAULT_STEP: Omit<TimerStep, "id"> = {
  type: "timer",
  label: "",
  duration: 300, // 5 minutes in seconds
};

export function createDefaultStep(): TimerStep {
  return {
    id: crypto.randomUUID(),
    ...DEFAULT_STEP,
  };
}
