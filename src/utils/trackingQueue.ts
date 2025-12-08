import type { TimerStep } from "../types/timer";

const STORAGE_KEY = "clockify_pending_queue";
const MAX_SYNC_ATTEMPTS = 3;

export interface PendingTrackingEntry {
  id: string;
  taskName: string;
  duration: number;
  timestamp: string;
  userId: string;
  syncAttempts: number;
}

/**
 * Get all pending tracking entries from localStorage
 */
export function getPendingTrackingQueue(): PendingTrackingEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const queue = JSON.parse(stored);
    if (!Array.isArray(queue)) return [];

    // Migrate old entries without syncAttempts
    const migratedQueue = queue.map((entry) => ({
      ...entry,
      syncAttempts: entry.syncAttempts ?? 0,
    }));

    // Save migrated data if needed
    if (queue.some((entry) => entry.syncAttempts === undefined)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedQueue));
    }

    return migratedQueue;
  } catch (error) {
    console.error("Error reading pending tracking queue:", error);
    return [];
  }
}

/**
 * Add a new entry to the pending tracking queue
 */
export function addToPendingQueue(
  step: TimerStep,
  userId: string,
): PendingTrackingEntry {
  const entry: PendingTrackingEntry = {
    id: crypto.randomUUID(),
    taskName: step.label,
    duration: step.duration,
    timestamp: new Date().toISOString(),
    userId,
    syncAttempts: 0,
  };

  try {
    const queue = getPendingTrackingQueue();
    queue.push(entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    console.log(`📝 Added to pending queue: ${entry.taskName}`);
    return entry;
  } catch (error) {
    console.error("Error adding to pending queue:", error);
    throw error;
  }
}

/**
 * Remove an entry from the pending queue
 */
export function removeFromPendingQueue(entryId: string): void {
  try {
    const queue = getPendingTrackingQueue();
    const filtered = queue.filter((entry) => entry.id !== entryId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    console.log(`✅ Removed from pending queue: ${entryId}`);
  } catch (error) {
    console.error("Error removing from pending queue:", error);
  }
}

/**
 * Clear all pending entries
 */
export function clearPendingQueue(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log("🗑️ Cleared pending queue");
  } catch (error) {
    console.error("Error clearing pending queue:", error);
  }
}

/**
 * Get the count of pending entries
 */
export function getPendingQueueCount(): number {
  return getPendingTrackingQueue().length;
}

/**
 * Increment sync attempts for an entry
 * Returns true if max attempts reached, false otherwise
 */
export function isMaxAttemptsReached(entryId: string): boolean {
  try {
    const queue = getPendingTrackingQueue();
    const entry = queue.find((e) => e.id === entryId);

    if (!entry) return false;

    entry.syncAttempts = (entry.syncAttempts || 0) + 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));

    console.log(
      `🔄 Sync attempt ${entry.syncAttempts}/${MAX_SYNC_ATTEMPTS} for: ${entry.taskName}`,
    );

    // Return true if max attempts reached
    if (entry.syncAttempts >= MAX_SYNC_ATTEMPTS) {
      console.log(
        `❌ Max sync attempts (${MAX_SYNC_ATTEMPTS}) reached for: ${entry.taskName}`,
      );
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error incrementing sync attempts:", error);
    return false;
  }
}
