import { create } from "zustand";

interface AboutDialogState {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
}

export const useAboutDialogStore = create<AboutDialogState>((set) => ({
    isOpen: false,

    open: () => set({ isOpen: true }),

    close: () => set({ isOpen: false }),

    toggle: () => set((state) => ({
        isOpen: !state.isOpen,
    })),
}));