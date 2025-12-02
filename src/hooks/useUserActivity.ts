import { useEffect } from "react";
import { useBrightnessStore } from "../store/brightnessStore";
import { useTimerStore } from "../store/timerStore";
import { useDrawerStore } from "../store/drawerStore";

/**
 * Hook to automatically manage brightness based on timer and drawer state
 * Simple logic:
 * - If drawer is open -> full brightness
 * - If drawer is closed AND timer is running -> dimmed brightness
 * - If timer is paused or completed -> full brightness
 * - Otherwise -> full brightness
 */
export function useUserActivity() {
  const status = useTimerStore((state) => state.status);
  const isDrawerOpen = useDrawerStore((state) => state.isOpen);

  // On mount, always set brightness to 100%
  useEffect(() => {
    const brightnessStore = useBrightnessStore.getState();
    brightnessStore.setBrightness(100);
  }, []);

  useEffect(() => {
    const brightnessStore = useBrightnessStore.getState();

    // If drawer is open, always restore brightness
    if (isDrawerOpen) {
      brightnessStore.restoreBrightness();
      return;
    }

    // If drawer is closed and timer is running, auto-dim
    // Otherwise (paused, completed, idle) restore full brightness
    if (status === "running") {
      brightnessStore.setAutoDim(true);
    } else {
      // Timer is paused, completed, or idle - restore brightness
      brightnessStore.restoreBrightness();
    }
  }, [status, isDrawerOpen]);
}
