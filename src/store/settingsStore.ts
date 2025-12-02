import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsStore {
  autoDimEnabled: boolean;
  setAutoDimEnabled: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      autoDimEnabled: false, // By default auto-dim is disabled
      setAutoDimEnabled: (enabled) => set({ autoDimEnabled: enabled }),
    }),
    {
      name: "yoga-timer-settings",
    },
  ),
);
