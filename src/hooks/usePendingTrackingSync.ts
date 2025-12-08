import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { useAuthStore } from "../store/authStore";
import { onlineManager } from "@tanstack/react-query";
import * as firebaseFunctions from "../lib/firebaseFunctions";
import {
  getPendingTrackingQueue,
  removeFromPendingQueue,
  isMaxAttemptsReached,
} from "../utils/trackingQueue";
import type { User, UserSettings } from "../types/user";

/**
 * Hook to sync pending tracking entries when:
 * 1. User settings become available (loaded from server)
 * 2. User comes back online
 */
export function usePendingTrackingSync() {
  const { t } = useTranslation();
  const { user, userSettings } = useAuthStore();
  const lastSyncAttempt = useRef<number>(0);

  // Sync when userSettings become available
  useEffect(() => {
    if (!user || !onlineManager.isOnline()) return;

    // Check if user has tracking settings configured
    if (
      !userSettings?.trackingProjectName ||
      !userSettings?.clockifyApiKey ||
      !userSettings?.clockifyWorkspaceId
    ) {
      return; // No settings yet or not configured - wait
    }

    const now = Date.now();
    // Prevent multiple sync attempts within 5 seconds
    if (now - lastSyncAttempt.current < 5000) return;

    lastSyncAttempt.current = now;

    syncPendingEntries(user);
  }, [user, userSettings, t]); // Trigger when userSettings change!

  // Sync when coming back online
  useEffect(() => {
    if (!user) return;

    const unsubscribe = onlineManager.subscribe((isOnline) => {
      if (!isOnline) return;

      console.log("🌐 Back online - checking pending queue...");

      syncOnReconnect(userSettings, user);
    });

    return () => {
      unsubscribe();
    };
  }, [user, userSettings]);
}

const syncPendingEntries = async (user: User) => {
  const queue = getPendingTrackingQueue();
  const userEntries = queue.filter((entry) => entry.userId === user.id);

  if (userEntries.length === 0) return;

  console.log(`🔄 Syncing ${userEntries.length} pending tracking entries...`);

  let successCount = 0;
  let failCount = 0;

  for (const entry of userEntries) {
    try {
      await firebaseFunctions.trackTime({
        taskName: entry.taskName,
        duration: entry.duration,
      });

      // Remove from queue on success
      removeFromPendingQueue(entry.id);
      successCount++;
      console.log(`✅ Synced: ${entry.taskName}`);
    } catch (error) {
      console.error(`❌ Failed to sync: ${entry.taskName}`, error);

      // Increment sync attempts
      const maxAttemptsReached = isMaxAttemptsReached(entry.id);
      if (maxAttemptsReached) {
        // Remove entry after max attempts
        removeFromPendingQueue(entry.id);
        console.log(`🗑️ Removed after max attempts: ${entry.taskName}`);
      }

      failCount++;
    }
  }

  // Show notification if any entries were synced
  if (successCount > 0) {
    toast.success(
      i18n.t("tracking.syncSuccess", {
        count: successCount,
        defaultValue: `Synced ${successCount} timer(s) to Clockify`,
      }),
    );
  }

  if (failCount > 0) {
    console.log(`⚠️ ${failCount} entries failed to sync`);
  }
};

const syncOnReconnect = async (
  userSettings: UserSettings | null,
  user: User,
) => {
  // Check if user has tracking settings configured
  if (
    !userSettings?.trackingProjectName ||
    !userSettings?.clockifyApiKey ||
    !userSettings?.clockifyWorkspaceId
  ) {
    console.log(
      "⚠️ No tracking settings - will sync when settings are available",
    );
    return; // Don't clear, just wait for settings
  }

  const queue = getPendingTrackingQueue();
  const userEntries = queue.filter((entry) => entry.userId === user.id);

  if (userEntries.length === 0) return;

  console.log(`🔄 Reconnected: Syncing ${userEntries.length} entries...`);

  for (const entry of userEntries) {
    try {
      await firebaseFunctions.trackTime({
        taskName: entry.taskName,
        duration: entry.duration,
      });

      removeFromPendingQueue(entry.id);
      console.log(`✅ Synced on reconnect: ${entry.taskName}`);
    } catch (error) {
      console.error(`❌ Failed to sync: ${entry.taskName}`, error);

      // Increment sync attempts
      const maxAttemptsReached = isMaxAttemptsReached(entry.id);
      if (maxAttemptsReached) {
        // Remove entry after max attempts
        removeFromPendingQueue(entry.id);
        console.log(`🗑️ Removed after max attempts: ${entry.taskName}`);
      }
    }
  }
};
