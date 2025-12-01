import { set, differenceInMilliseconds, subDays, isAfter } from "date-fns";
import { getYogaPeriod } from "./getYogaPeriod";

const PERIOD_START_HOURS = [21, 3, 9, 15];
const PERIOD_DURATION_MS = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

/**
 * Gets progress within current yoga period (0-1)
 * @param date - Current date
 * @returns Progress from 0 to 1
 */
export function getYogaPeriodProgress(date: Date = new Date()): number {
  const periodIndex = getYogaPeriod(date);
  const startHour = PERIOD_START_HOURS[periodIndex];

  let periodStart = set(date, {
    hours: startHour,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });

  if (isAfter(periodStart, date)) {
    periodStart = subDays(periodStart, 1);
  }

  const elapsed = differenceInMilliseconds(date, periodStart);

  return Math.min(Math.max(elapsed / PERIOD_DURATION_MS, 0), 1);
}
