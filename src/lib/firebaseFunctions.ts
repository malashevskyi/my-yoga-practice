import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";
import type { Database } from "../types/supabase";
import type { TimerStep } from "../types/timer";

type Preset = Database["public"]["Tables"]["presets"]["Row"];
type Video = Database["public"]["Tables"]["videos"]["Row"];
type User = Database["public"]["Tables"]["users"]["Row"];

// Auth
export async function createOrUpdateUser() {
  const fn = httpsCallable(functions, "createOrUpdateUser");
  const result = await fn();
  return result.data as { user: User };
}

// Presets
export async function getPresets() {
  const fn = httpsCallable(functions, "getPresets");
  const result = await fn();
  return result.data as { presets: Preset[] };
}

export async function createPreset(data: {
  name: string;
  description?: string;
  steps: TimerStep[];
  duration_total: number;
}) {
  const fn = httpsCallable(functions, "createPreset");
  const result = await fn(data);
  return result.data as { preset: Preset };
}

export async function deletePreset(presetId: string) {
  const fn = httpsCallable(functions, "deletePreset");
  const result = await fn({ presetId });
  return result.data as { success: boolean };
}

// Videos
export async function getVideos() {
  const fn = httpsCallable(functions, "getVideos");
  const result = await fn();
  return result.data as { videos: Video[] };
}

export async function createVideo(data: { title: string; url: string }) {
  const fn = httpsCallable(functions, "createVideo");
  const result = await fn(data);
  return result.data as { video: Video };
}
