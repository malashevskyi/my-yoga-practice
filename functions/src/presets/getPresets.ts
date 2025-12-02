import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {
  getSupabaseClient,
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
} from "../lib/supabase";
import { Preset } from "./types";

export const getPresets = onCall(
  { secrets: [SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const userId = request.auth.uid;
    const supabase = getSupabaseClient();

    try {
      const { data, error } = await supabase
        .from("presets")
        .select("*")
        .eq("user", userId)
        .order("created_at", { ascending: false })
        .returns<Preset[]>();

      if (error) throw error;
      return { presets: data || [] };
    } catch (error) {
      logger.error("Error fetching presets:", error);
      throw new HttpsError("internal", "Failed to fetch presets");
    }
  },
);
