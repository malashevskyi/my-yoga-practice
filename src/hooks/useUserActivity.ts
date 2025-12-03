import { useEffect } from "react";
import { useBrightnessStore } from "../store/brightnessStore";
import { useTimerStore } from "../store/timerStore";
import { useDrawerStore } from "../store/drawerStore";
import { useSettingsStore } from "../store/settingsStore";

/**
 * Hook to automatically manage brightness based on timer and drawer state
 * Simple logic:
 * - If drawer is open -> full brightness
 * - If drawer is closed AND timer is running AND auto-dim is enabled -> dimmed brightness
 * - If timer is paused or completed -> full brightness
 * - Otherwise -> full brightness
 */
export function useUserActivity() {
  const status = useTimerStore((state) => state.status);
  const isDrawerOpen = useDrawerStore((state) => state.isOpen);
  const autoDimEnabled = useSettingsStore((state) => state.autoDimEnabled);

  // On mount, restore saved brightness (don't override with 100%)
  useEffect(() => {
    const brightnessStore = useBrightnessStore.getState();
    // Restore to saved userBrightness (which will be loaded from localStorage if exists)
    brightnessStore.restoreBrightness();
  }, []);

  useEffect(() => {
    const brightnessStore = useBrightnessStore.getState();

    // If drawer is open AND auto-dim is enabled, temporarily set to 100%
    // (if auto-dim is disabled, user's manual brightness should be preserved)
    if (isDrawerOpen) {
      if (autoDimEnabled) {
        brightnessStore.setTemporaryBrightness(100);
      }
      return;
    }

    // If drawer is closed and timer is running and auto-dim is enabled, auto-dim
    // Otherwise (paused, completed, idle, or auto-dim disabled) restore brightness
    if (status === "running" && autoDimEnabled) {
      brightnessStore.setAutoDim(true);
    } else {
      // Timer is paused, completed, idle, or auto-dim is disabled - restore brightness
      brightnessStore.restoreBrightness();
    }
  }, [status, isDrawerOpen, autoDimEnabled]);
}
