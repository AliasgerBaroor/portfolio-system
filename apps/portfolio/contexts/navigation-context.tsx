import { create } from "zustand";

type NavigationStore = {
    activeTab: string;
    setActiveTab: (tab: string) => void;
};

export const useNavigationStore = create<NavigationStore>((set) => ({
    activeTab: "all",
    setActiveTab: (tab) => set({ activeTab: tab }),
}));