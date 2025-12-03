import { useEffect } from "react";
import { useBrightnessStore } from "../store/brightnessStore";
import { useTimerStore } from "../store/timerStore";
import { useDrawerStore } from "../store/drawerStore";
import { useSettingsStore } from "../store/settingsStore";

/**
 * Hook to automatically manage brightness based on timer and drawer state
 * Simple logic:
 * - If drawer is open -> always 100% brightness (drawers must be fully visible)
 * - If drawer is closed AND timer is running AND auto-dim is enabled -> dimmed brightness
 * - If timer is paused or completed -> restore user's brightness
 * - Otherwise -> restore user's brightness
 */
export function useUserActivity() {
  const status = useTimerStore((state) => state.status);
  const isAppDrawerOpen = useDrawerStore((state) => state.isAppDrawerOpen);
  const isSettingsDrawerOpen = useDrawerStore(
    (state) => state.isSettingsDrawerOpen,
  );
  const autoDimEnabled = useSettingsStore((state) => state.autoDimEnabled);

  // Calculate if any drawer is open
  const isAnyDrawerOpen = isAppDrawerOpen || isSettingsDrawerOpen;

  // On mount, restore saved brightness (don't override with 100%)
  useEffect(() => {
    const brightnessStore = useBrightnessStore.getState();
    // Restore to saved userBrightness (which will be loaded from localStorage if exists)
    brightnessStore.restoreBrightness();
  }, []);

  useEffect(() => {
    const brightnessStore = useBrightnessStore.getState();

    // If drawer is open, always set to 100% temporarily
    // (drawers should always be fully visible)
    if (isAnyDrawerOpen) {
      brightnessStore.setTemporaryBrightness(100);
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
  }, [status, isAnyDrawerOpen, autoDimEnabled]);
}
