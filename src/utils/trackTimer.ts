import { toast } from "sonner";
import i18n from "../i18n";
import * as firebaseFunctions from "../lib/firebaseFunctions";
import { useAuthStore } from "../store/authStore";
import type { TimerStep } from "../types/timer";

/**
 * Track completed timer to Clockify
 */
export async function trackCompletedTimer(step: TimerStep): Promise<void> {
  const { user, userSettings } = useAuthStore.getState();

  // Only track if user is authenticated and has all required settings configured
  if (
    !user ||
    !userSettings?.trackingProjectName ||
    !userSettings?.clockifyApiKey ||
    !userSettings?.clockifyWorkspaceId
  ) {
    return;
  }

  try {
    console.log(`📊 Tracking to Clockify: ${step.label} (${step.duration}s)`);

    await firebaseFunctions.trackTime({
      taskName: step.label,
      duration: step.duration,
    });

    console.log("✅ Time tracked successfully");
  } catch (error) {
    console.error("❌ Error tracking time to Clockify:", error);
    toast.error(i18n.t("tracking.trackError"));
  }
}
