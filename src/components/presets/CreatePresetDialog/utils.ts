import type { TimerStep } from "../../../types/timer";
import i18n from "../../../i18n";

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

export function validatePresetForm(values: PresetFormValues) {
  const errors: { name?: string; steps?: string } = {};

  if (!values.name.trim()) {
    errors.name = i18n.t("createPreset.nameRequired");
  }

  const invalidStep = values.steps.find(
    (s) => !s.label.trim() || s.duration <= 0,
  );
  if (invalidStep) {
    errors.steps = i18n.t("createPreset.stepsInvalid");
  }

  return errors;
}
