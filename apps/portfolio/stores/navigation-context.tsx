import { create } from "zustand";

type NavigationStore = {
    category: string;
    action: string;

    setCategory: (id: string) => void;
    setAction: (id: string) => void;
};

export const useNavigationStore = create<NavigationStore>((set) => ({
    category: "all",
    action: "work",

    setCategory: (id) => set({ category: id }),
    setAction: (id) => set({ action: id }),
}));