import { serializeError } from "serialize-error";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { z } from "zod";
import {
  getSupabaseClient,
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
} from "../lib/supabase";

const UpdateUserSettingsSchema = z.object({
  tracking_project_name: z.string().optional().nullable(),
  clockify_api_key: z.string().optional().nullable(),
  clockify_workspace_id: z.string().optional().nullable(),
});

interface UserSettings {
  id: string;
  user: string;
  tracking_project_name: string | null;
  clockify_api_key: string | null;
  clockify_workspace_id: string | null;
  created_at: string;
  updated_at: string | null;
}

export const updateUserSettings = onCall(
  { secrets: [SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const userId = request.auth.uid;

    const parseInputResult = UpdateUserSettingsSchema.safeParse(request.data);

    if (!parseInputResult.success) {
      throw new HttpsError(
        "invalid-argument",
        `Invalid request data: ${serializeError(parseInputResult.error)}`,
      );
    }

    const { tracking_project_name, clockify_api_key, clockify_workspace_id } =
      parseInputResult.data;

    const supabase = getSupabaseClient();

    try {
      const upsertData: Partial<UserSettings> & { user: string } = {
        user: userId,
      };

      if (tracking_project_name) {
        upsertData.tracking_project_name = tracking_project_name.trim();
      }
      if (clockify_api_key) {
        upsertData.clockify_api_key = clockify_api_key.trim();
      }
      if (clockify_workspace_id) {
        upsertData.clockify_workspace_id = clockify_workspace_id.trim();
      }

      const { data: settings, error } = await supabase
        .from("user_settings")
        .upsert(upsertData)
        .select()
        .single<UserSettings>();

      if (error) throw error;

      return { settings };
    } catch (error) {
      const message = serializeError(error);
      logger.error("Error updating user settings:", message);
      throw new HttpsError(
        "internal",
        `Failed to update user settings: ${message}`,
      );
    }
  },
);
