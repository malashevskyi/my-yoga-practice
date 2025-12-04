/**
 * Calculate duration in seconds from ISO timestamps
 */
export function calculateDuration(start: string, end: string): number {
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  return Math.floor((endTime - startTime) / 1000);
}
