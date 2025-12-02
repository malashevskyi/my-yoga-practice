import type { Preset, CreatePresetInput } from "../types/preset";
import * as firebaseFunctions from "../lib/firebaseFunctions";

export async function getPresets(): Promise<Preset[]> {
  const { presets } = await firebaseFunctions.getPresets();
  return presets;
}

export async function createPreset(input: CreatePresetInput): Promise<Preset> {
  const totalDuration = input.steps.reduce(
    (sum, step) => sum + step.duration,
    0,
  );

  const { preset } = await firebaseFunctions.createPreset({
    name: input.name,
    description: input.description,
    steps: input.steps,
    duration_total: totalDuration,
  });

  return preset;
}

export async function deletePreset(id: string): Promise<void> {
  await firebaseFunctions.deletePreset(id);
}
