import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { z } from "zod";
import {
  getSupabaseClient,
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
} from "../lib/supabase";
import {
  getCurrentUser,
  getTimeEntries,
  findOrCreateProject,
  ClockifyTimeEntry,
} from "../lib/clockify";
import { serializeError } from "serialize-error";
import { getHistoryFromEntries } from "./getHistoryFromEntries";

const DEFAULT_PAGE_SIZE = 30;

const GetHistorySchema = z
  .object({
    lastDate: z.string().optional(), // Date of last loaded entry
    pageSize: z.number().min(1).max(100).optional(),
  })
  .optional()
  .nullable();

interface UserSettings {
  id: string;
  user: string;
  tracking_project_name: string | null;
  clockify_api_key: string | null;
  clockify_workspace_id: string | null;
}

export const getHistory = onCall(
  { secrets: [SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY] },
  async (request) => {
    if (!request.auth) {
      /**
       * unexpected error, the function should not be called without authentication
       */
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const userId = request.auth.uid;

    const parseInputResult = GetHistorySchema.safeParse(request.data);
    if (!parseInputResult.success) {
      throw new HttpsError(
        "invalid-argument",
        `Invalid request data: ${serializeError(parseInputResult.error)}`,
      );
    }

    const { lastDate, pageSize = DEFAULT_PAGE_SIZE } =
      parseInputResult.data || {};

    const supabase = getSupabaseClient();

    try {
      const { data: settings } = await supabase
        .from("user_settings")
        .select(
          "tracking_project_name, clockify_api_key, clockify_workspace_id",
        )
        .eq("user", userId)
        .maybeSingle<UserSettings>()
        .throwOnError();

      // If no settings or required fields not configured
      if (
        !settings ||
        !settings.tracking_project_name ||
        !settings.clockify_api_key ||
        !settings.clockify_workspace_id
      ) {
        return { history: [], needsConfiguration: true };
      }

      const apiKey = settings.clockify_api_key;
      const workspaceId = settings.clockify_workspace_id;
      const projectName = settings.tracking_project_name;

      const clockifyUser = await getCurrentUser(apiKey);

      const project = await findOrCreateProject(
        apiKey,
        workspaceId,
        projectName,
      );

      const endDate = lastDate ? new Date(lastDate) : new Date();

      // Search backwards up to 1 year, trying each month
      const MAX_MONTHS_BACK = 12;
      let allEntries: ClockifyTimeEntry[] = [];

      for (let monthsBack = 0; monthsBack < MAX_MONTHS_BACK; monthsBack++) {
        const searchEndDate = new Date(endDate);
        searchEndDate.setMonth(searchEndDate.getMonth() - monthsBack);

        const searchStartDate = new Date(searchEndDate);
        searchStartDate.setMonth(searchStartDate.getMonth() - 1);

        const timeEntries = await getTimeEntries(
          apiKey,
          workspaceId,
          clockifyUser.id,
          project.id,
          searchStartDate,
          searchEndDate,
          pageSize,
        );

        if (timeEntries.length > 0) {
          allEntries = timeEntries;
          // Stop searching once we find data
          break;
        }
      }

      if (allEntries.length === 0) return { history: [] };

      // Transform to frontend format
      const history = await getHistoryFromEntries(
        allEntries,
        apiKey,
        workspaceId,
        project.id,
        settings.tracking_project_name,
      );

      return { history };
    } catch (error) {
      const message = serializeError(error);
      logger.error("Error getting history:", message);
      throw new HttpsError("internal", `Failed to get history: ${message}`);
    }
  },
);
