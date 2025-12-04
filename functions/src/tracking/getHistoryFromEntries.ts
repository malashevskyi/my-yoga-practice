import { logger } from "firebase-functions";
import { ClockifyTimeEntry, getTask } from "../lib/clockify";
import { serializeError } from "serialize-error";
import { calculateDuration } from "../utils/duration";

export const getHistoryFromEntries = async (
  entries: ClockifyTimeEntry[],
  apiKey: string,
  workspaceId: string,
  projectId: string,
  projectName: string,
) => {
  return await Promise.all(
    entries.map(async (entry) => {
      let label = entry.description;

      // If description is empty and taskId exists, get task name
      if (!label && entry.taskId) {
        try {
          const task = await getTask(
            apiKey,
            workspaceId,
            projectId,
            entry.taskId,
          );
          label = task.name;
        } catch (error) {
          logger.warn(
            `Failed to get task name for entry ${entry.id}:`,
            serializeError(error),
          );
          label = "Untitled";
        }
      }

      // If still no label, use fallback
      if (!label) label = "Untitled";

      return {
        id: entry.id,
        label,
        duration: calculateDuration(
          entry.timeInterval.start,
          entry.timeInterval.end,
        ),
        completedAt: entry.timeInterval.end,
        projectName: projectName,
      };
    }),
  );
};
