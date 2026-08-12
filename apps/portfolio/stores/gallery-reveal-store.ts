import { create } from "zustand";

type GalleryRevealStore = {
    revealed: Set<string>;
    reveal: (id: string) => void;
};

export const useGalleryRevealStore =
    create<GalleryRevealStore>((set) => ({
        revealed: new Set(),

        reveal: (id) =>
            set((state) => {
                if (state.revealed.has(id)) {
                    return state;
                }

                const revealed = new Set(state.revealed);
                revealed.add(id);

                return { revealed };
            }),
    }));