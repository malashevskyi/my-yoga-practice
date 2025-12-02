import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {
  getSupabaseClient,
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
} from "../lib/supabase";

interface DeletePresetData {
  presetId: string;
}

interface PresetUser {
  user: string;
}

export const deletePreset = onCall(
  { secrets: [SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const userId = request.auth.uid;
    const { presetId } = request.data as DeletePresetData;

    if (!presetId) {
      throw new HttpsError("invalid-argument", "Preset ID is required");
    }

    const supabase = getSupabaseClient();

    try {
      const { data: preset } = await supabase
        .from("presets")
        .select("user")
        .eq("id", presetId)
        .single<PresetUser>();

      if (!preset || preset.user !== userId) {
        throw new HttpsError(
          "permission-denied",
          "You don't have permission to delete this preset",
        );
      }

      const { error } = await supabase
        .from("presets")
        .delete()
        .eq("id", presetId)
        .eq("user", userId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      logger.error("Error deleting preset:", error);
      throw new HttpsError("internal", "Failed to delete preset");
    }
  },
);
