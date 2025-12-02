import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {
  getSupabaseClient,
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
} from "../lib/supabase";
import { Preset, PresetStep } from "./types";

interface CreatePresetData {
  name: string;
  description?: string;
  steps: PresetStep[];
  duration_total: number;
}

export const createPreset = onCall(
  { secrets: [SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const userId = request.auth.uid;
    const { name, description, steps, duration_total } =
      request.data as CreatePresetData;

    if (!name || !steps || !duration_total) {
      throw new HttpsError("invalid-argument", "Missing required fields");
    }

    const supabase = getSupabaseClient();

    try {
      const { data, error } = await supabase
        .from("presets")
        .insert({
          user: userId,
          name,
          description: description || null,
          steps,
          duration_total,
        })
        .select()
        .single<Preset>();

      if (error) throw error;
      return { preset: data };
    } catch (error) {
      logger.error("Error creating preset:", error);
      throw new HttpsError("internal", "Failed to create preset");
    }
  },
);
