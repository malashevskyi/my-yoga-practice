/**
 * Formats seconds into MM:SS or HH:MM:SS format
 * @param seconds - Number of seconds to format
 * @returns Formatted time string (e.g., "05:30" or "01:15:30")
 */
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const minutesStr = minutes.toString().padStart(2, "0");
  const secondsStr = secs.toString().padStart(2, "0");

  if (hours > 0) {
    const hoursStr = hours.toString().padStart(2, "0");
    return `${hoursStr}:${minutesStr}:${secondsStr}`;
  }

  return `${minutesStr}:${secondsStr}`;
}
