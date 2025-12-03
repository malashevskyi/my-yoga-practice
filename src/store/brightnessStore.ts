import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MIN_BRIGHTNESS } from "../common/constants";

interface BrightnessStore {
  brightness: number; // 60-100
  userBrightness: number; // User's preferred brightness when slider is used
  isAutoDimmed: boolean; // Whether brightness is currently auto-dimmed
  setBrightness: (value: number) => void;
  setAutoDim: (dimmed: boolean) => void;
  restoreBrightness: () => void;
}

export const useBrightnessStore = create<BrightnessStore>()(
  persist(
    (set, get) => ({
      brightness: 100, // Current brightness
      userBrightness: 100, // User's preferred brightness
      isAutoDimmed: false,

      setBrightness: (value) => {
        set({
          brightness: value,
          userBrightness: value, // Remember user's choice
          isAutoDimmed: false, // User manually changed it
        });

        // If brightness is 100% (default), remove from localStorage to save space
        if (value === 100) {
          localStorage.removeItem("yoga-timer-brightness");
        }
      },

      setAutoDim: (dimmed) => {
        if (dimmed) {
          // Auto-dim to minimum (60)
          set({ brightness: MIN_BRIGHTNESS, isAutoDimmed: true });
        } else {
          // Restore to user's preferred brightness
          const { userBrightness } = get();
          set({ brightness: userBrightness, isAutoDimmed: false });
        }
      },

      restoreBrightness: () => {
        const { userBrightness } = get();
        set({ brightness: userBrightness, isAutoDimmed: false });
      },
    }),
    {
      name: "yoga-timer-brightness",
      // Only persist userBrightness (saves storage space, brightness and isAutoDimmed are runtime)
      partialize: (state) => ({
        userBrightness: state.userBrightness,
      }),
    },
  ),
);
