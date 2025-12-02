import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {
  getSupabaseClient,
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
} from "../lib/supabase";

interface User {
  id: string;
  email: string;
  display_name: string | null;
  created_at?: string;
  updated_at?: string;
}

export const createOrUpdateUser = onCall(
  { secrets: [SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const { uid, email, name: displayName } = request.auth.token;
    const supabase = getSupabaseClient();

    try {
      const { data: existingUser } = await supabase
        .from("users")
        .select("*")
        .eq("id", uid)
        .single<User>();

      if (existingUser) {
        const { data, error } = await supabase
          .from("users")
          .update({
            email: email || "",
            display_name: displayName || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", uid)
          .select()
          .single<User>();

        if (error) throw error;
        return { user: data };
      } else {
        const { data, error } = await supabase
          .from("users")
          .insert({
            id: uid,
            email: email || "",
            display_name: displayName || null,
          })
          .select()
          .single<User>();

        if (error) throw error;
        return { user: data };
      }
    } catch (error) {
      logger.error("Error creating/updating user:", error);
      throw new HttpsError("internal", "Failed to create/update user");
    }
  },
);
