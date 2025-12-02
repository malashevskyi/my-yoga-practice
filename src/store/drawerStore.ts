import { create } from "zustand";

interface DrawerStore {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const useDrawerStore = create<DrawerStore>((set) => ({
  isOpen: false,
  setIsOpen: (open) => set({ isOpen: open }),
}));
