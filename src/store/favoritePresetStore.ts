import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TimerStep } from "../types/timer";

interface FavoritePresetState {
  favoritePresetId: string | null;
  favoritePresetSteps: TimerStep[] | null;
  setFavoritePreset: (
    presetId: string | null,
    steps: TimerStep[] | null,
  ) => void;
}

export const useFavoritePresetStore = create<FavoritePresetState>()(
  persist(
    (set) => ({
      favoritePresetId: null,
      favoritePresetSteps: null,
      setFavoritePreset: (presetId, steps) =>
        set({ favoritePresetId: presetId, favoritePresetSteps: steps }),
    }),
    {
      name: "favorite-preset-storage",
    },
  ),
);
