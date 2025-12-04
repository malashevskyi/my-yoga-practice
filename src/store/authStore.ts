import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, UserSettings } from "../types/user";

interface AuthStore {
  user: User | null;
  userSettings: UserSettings | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setUserSettings: (settings: UserSettings | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      userSettings: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        }),

      setUserSettings: (settings) =>
        set({
          userSettings: settings,
        }),

      setLoading: (loading) => set({ isLoading: loading }),

      logout: () =>
        set({
          user: null,
          userSettings: null,
          isAuthenticated: false,
          isLoading: false,
        }),
    }),
    {
      name: "yoga-timer-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
