import { create } from "zustand";

interface DrawerStore {
  isAppDrawerOpen: boolean;
  isSettingsDrawerOpen: boolean;
  setAppDrawerOpen: (open: boolean) => void;
  setSettingsDrawerOpen: (open: boolean) => void;
  isAnyDrawerOpen: () => boolean;
}

export const useDrawerStore = create<DrawerStore>((set, get) => ({
  isAppDrawerOpen: false,
  isSettingsDrawerOpen: false,

  setAppDrawerOpen: (open) => set({ isAppDrawerOpen: open }),
  setSettingsDrawerOpen: (open) => set({ isSettingsDrawerOpen: open }),

  // Returns true if any drawer is open
  isAnyDrawerOpen: () => {
    const state = get();
    return state.isAppDrawerOpen || state.isSettingsDrawerOpen;
  },
}));
