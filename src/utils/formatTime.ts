import { format } from "date-fns";

/**
 * Formats seconds into MM:SS or HH:MM:SS format
 * @param seconds - Number of seconds to format
 * @returns Formatted time string (e.g., "05:30" or "01:15:30")
 */
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const date = new Date(0, 0, 0, hours, minutes, secs);

  if (hours > 0) {
    return format(date, "HH:mm:ss");
  }

  return format(date, "mm:ss");
}
