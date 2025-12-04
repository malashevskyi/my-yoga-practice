import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {
  getSupabaseClient,
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
} from "../lib/supabase";
import { z } from "zod";
import {
  findOrCreateProject,
  findOrCreateTask,
  createTimeEntry,
} from "../lib/clockify";
import { serializeError } from "serialize-error";

interface UserSettings {
  id: string;
  user: string;
  tracking_project_name: string | null;
  clockify_api_key: string | null;
  clockify_workspace_id: string | null;
}

const trackTimeSchema = z.object({
  taskName: z.string().min(1, "Task name is required"),
  duration: z.number().int().positive("Duration must be a positive integer"), // Duration in seconds
});

export const trackTime = onCall(
  { secrets: [SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY] },
  async (request) => {
    try {
      if (!request.auth) {
        /**
         * unexpected error, the function should not be called without authentication
         */
        throw new HttpsError("unauthenticated", "User must be authenticated");
      }

      const userId = request.auth.uid;

      const parseInputResult = trackTimeSchema.safeParse(request.data);

      if (!parseInputResult.success) {
        throw new HttpsError(
          "invalid-argument",
          `Invalid request data: ${serializeError(parseInputResult.error)}`,
        );
      }

      const { taskName, duration } = parseInputResult.data;

      const supabase = getSupabaseClient();

      const { data: settings } = await supabase
        .from("user_settings")
        .select(
          "tracking_project_name, clockify_api_key, clockify_workspace_id",
        )
        .eq("user", userId)
        .maybeSingle<UserSettings>()
        .throwOnError();

      if (
        !settings?.tracking_project_name ||
        !settings?.clockify_api_key ||
        !settings?.clockify_workspace_id
      ) {
        throw new HttpsError(
          "failed-precondition",
          "Clockify settings not configured. Please configure API key, workspace ID, and project name in settings.",
        );
      }

      const apiKey = settings.clockify_api_key;
      const workspaceId = settings.clockify_workspace_id;

      const project = await findOrCreateProject(
        apiKey,
        workspaceId,
        settings.tracking_project_name,
      );

      const task = await findOrCreateTask(
        apiKey,
        workspaceId,
        project.id,
        taskName,
      );

      const endTime = new Date();
      const startTime = new Date(endTime.getTime() - duration * 1000);

      const timeEntry = await createTimeEntry(
        apiKey,
        workspaceId,
        project.id,
        task.id,
        taskName,
        startTime,
        endTime,
      );

      return {
        success: true,
        timeEntry: {
          id: timeEntry.id,
          taskName,
          duration,
          start: startTime.toISOString(),
          end: endTime.toISOString(),
        },
      };
    } catch (error) {
      const message = serializeError(error);
      logger.error("Error tracking time:", message);
      throw new HttpsError("internal", `Failed to track time: ${message}`);
    }
  },
);
