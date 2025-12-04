import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";
import type { Database } from "../types/supabase";
import type { TimerStep } from "../types/timer";

type Preset = Database["public"]["Tables"]["presets"]["Row"];
type Video = Database["public"]["Tables"]["videos"]["Row"];
type User = Database["public"]["Tables"]["users"]["Row"];
type UserSettings = Database["public"]["Tables"]["user_settings"]["Row"];

// Auth
export async function createOrUpdateUser() {
  const fn = httpsCallable(functions, "createOrUpdateUser");
  const result = await fn();
  return result.data as { user: User };
}

// Settings
export async function getUserSettings() {
  const fn = httpsCallable(functions, "getUserSettings");
  const result = await fn();
  return result.data as { settings: UserSettings };
}

export async function updateUserSettings(data: {
  tracking_project_name?: string | null;
  clockify_api_key?: string | null;
  clockify_workspace_id?: string | null;
}) {
  const fn = httpsCallable(functions, "updateUserSettings");
  const result = await fn(data);
  return result.data as { settings: UserSettings };
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

export async function trackTime(data: { taskName: string; duration: number }) {
  const fn = httpsCallable(functions, "trackTime");
  const result = await fn(data);
  return result.data as {
    success: boolean;
    timeEntry: {
      id: string;
      taskName: string;
      duration: number;
      start: string;
      end: string;
    };
  };
}

export async function getHistory(data?: {
  lastDate?: string;
  pageSize?: number;
}) {
  const fn = httpsCallable(functions, "getHistory");
  const result = await fn(data || null);
  return result.data as {
    history: {
      id: string;
      label: string;
      duration: number;
      completedAt: string;
      projectName: string | null;
    }[];
    needsConfiguration?: boolean;
  };
}
