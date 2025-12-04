import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {
  getSupabaseClient,
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
} from "../lib/supabase";
import { serializeError } from "serialize-error";

interface UserSettings {
  id: string;
  user: string;
  tracking_project_name: string | null;
  created_at: string;
  updated_at: string | null;
}

export const getUserSettings = onCall(
  { secrets: [SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY] },
  async (request) => {
    try {
      if (!request.auth) {
        throw new HttpsError("unauthenticated", "User must be authenticated");
      }

      const userId = request.auth.uid;
      const supabase = getSupabaseClient();

      const { data: settings } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user", userId)
        .maybeSingle<UserSettings>()
        .throwOnError();

      if (settings) return { settings };

      const { data: newSettings } = await supabase
        .from("user_settings")
        .insert({ user: userId })
        .select()
        .single<UserSettings>()
        .throwOnError();

      return { settings: newSettings };
    } catch (error) {
      const message = serializeError(error);
      logger.error("Error getting user settings:", message);
      throw new HttpsError(
        "internal",
        `Failed to get user settings: ${message}`,
      );
    }
  },
);
