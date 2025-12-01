import { supabase, getSupabaseAdmin, isDevMode } from "../lib/supabase";
import type { Preset, CreatePresetInput } from "../types/preset";
import type { Database } from "../types/supabase";

type PresetRow = Database["public"]["Tables"]["presets"]["Row"];

export async function getPresets(): Promise<Preset[]> {
  const { data, error } = await supabase.from("presets").select("*");

  if (error) {
    throw new Error(`Failed to fetch presets: ${error.message}`);
  }

  return (data as PresetRow[]) || [];
}

export async function createPreset(input: CreatePresetInput): Promise<Preset> {
  if (!isDevMode) {
    throw new Error("Admin access required to create presets");
  }

  const client = getSupabaseAdmin();

  const totalDuration = input.steps.reduce(
    (sum, step) => sum + step.duration,
    0,
  );

  const { data, error } = await client
    .from("presets")
    .insert({
      name: input.name,
      description: input.description || null,
      steps: input.steps,
      duration_total: totalDuration,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create preset: ${error.message}`);
  }

  if (!data) {
    throw new Error("No data returned from insert");
  }

  return data as PresetRow;
}

export async function deletePreset(id: string): Promise<void> {
  if (!isDevMode) {
    throw new Error("Admin access required to delete presets");
  }

  const client = getSupabaseAdmin();

  const { error } = await client.from("presets").delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete preset: ${error.message}`);
  }
}
