
import { create } from "zustand";

type GalleryRevealStore = {
    revealed: Set<string>;
    reveal: (id: string) => void;
    reset: () => void;
};

function getUniqueImageId(id: string): string {
    return id
        .replace(/__horizontal_-?\d+$/, "")
        .replace(/__repeat_\d+$/, "");
}

export const useGalleryRevealStore =
    create<GalleryRevealStore>((set) => ({
        revealed: new Set(),

        reveal: (id) =>
            set((state) => {
                const uniqueId = getUniqueImageId(id);

                if (state.revealed.has(uniqueId)) {
                    return state;
                }

                const revealed = new Set(state.revealed);
                revealed.add(uniqueId);

                return { revealed };
            }),

        reset: () => set({ revealed: new Set() }),
    }));