import { useEffect, useRef } from "react";
import { usePresets } from "./usePresets";
import { useTimerStore } from "../store/timerStore";
import { useFavoritePresetStore } from "../store/favoritePresetStore";

/**
 * Auto-loads the favorite preset on app startup
 */
export function useFavoritePresetAutoload() {
  const favoritePresetId = useFavoritePresetStore(
    (state) => state.favoritePresetId,
  );
  const favoritePresetSteps = useFavoritePresetStore(
    (state) => state.favoritePresetSteps,
  );
  const setFavoritePreset = useFavoritePresetStore(
    (state) => state.setFavoritePreset,
  );
  const setQueue = useTimerStore((state) => state.setQueue);
  const hasLoaded = useRef(false);

  // Fetch presets only if we have ID but missing steps (migration case)
  const needsMigration = favoritePresetId && !favoritePresetSteps;
  const { data: presets } = usePresets();

  useEffect(() => {
    if (hasLoaded.current) return;

    // Priority 1: If we have steps in localStorage, use them directly (no API call needed)
    if (favoritePresetSteps && favoritePresetSteps.length > 0) {
      setQueue(favoritePresetSteps);
      hasLoaded.current = true;
      return;
    }

    // Priority 2: Migration - if we have ID but no steps, fetch and save
    if (needsMigration && presets) {
      const favoritePreset = presets.find((p) => p.id === favoritePresetId);
      if (favoritePreset) {
        // Save steps to localStorage for future
        setFavoritePreset(favoritePresetId, favoritePreset.steps);
        setQueue(favoritePreset.steps);
        hasLoaded.current = true;
      }
    }
  }, [
    favoritePresetSteps,
    favoritePresetId,
    needsMigration,
    presets,
    setQueue,
    setFavoritePreset,
  ]);
}
