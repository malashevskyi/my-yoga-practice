/**
 * Gets current time period for yoga practice (0-3)
 * @param date - Current date
 * @returns Period index (0: 21-3, 1: 3-9, 2: 9-15, 3: 15-21)
 */
export function getYogaPeriod(date: Date = new Date()): number {
  const hours = date.getHours();

  if (hours >= 21 || hours < 3) return 0; // 21:00 - 03:00 - Sahasrara
  if (hours >= 3 && hours < 9) return 1; // 03:00 - 09:00 - Anahata
  if (hours >= 9 && hours < 15) return 2; // 09:00 - 15:00 - Vishuddha
  return 3; // 15:00 - 21:00 - Ajna
}
