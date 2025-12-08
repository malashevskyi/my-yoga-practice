import { toast } from "sonner";
import i18n from "../i18n";
import * as firebaseFunctions from "../lib/firebaseFunctions";
import { useAuthStore } from "../store/authStore";
import type { TimerStep } from "../types/timer";
import { addToPendingQueue } from "./trackingQueue";

/**
 * Track completed timer to Clockify
 * If offline or error occurs, adds to pending queue for later sync
 */
export async function trackCompletedTimer(step: TimerStep): Promise<void> {
  const { user, userSettings } = useAuthStore.getState();

  // Must have authenticated user
  if (!user) return;

  // Check if tracking is configured
  const hasTrackingSettings =
    userSettings?.trackingProjectName &&
    userSettings?.clockifyApiKey &&
    userSettings?.clockifyWorkspaceId;

  // If offline, ALWAYS add to pending queue (will sync when online + settings available)
  if (!navigator.onLine) {
    console.log(`📝 Offline: Adding to pending queue: ${step.label}`);
    addToPendingQueue(step, user.id);
    toast.info(i18n.t("tracking.queuedOffline"));
    return;
  }

  // If online but no settings, don't track (user hasn't configured tracking yet)
  if (!hasTrackingSettings) return;

  try {
    console.log(`📊 Tracking to Clockify: ${step.label} (${step.duration}s)`);

    await firebaseFunctions.trackTime({
      taskName: step.label,
      duration: step.duration,
    });

    console.log("✅ Time tracked successfully");
  } catch (error) {
    console.error("❌ Error tracking time to Clockify:", error);

    // Add to pending queue on error
    console.log(`📝 Error: Adding to pending queue: ${step.label}`);
    addToPendingQueue(step, user.id);
    toast.error(i18n.t("tracking.trackError"));
  }
}
