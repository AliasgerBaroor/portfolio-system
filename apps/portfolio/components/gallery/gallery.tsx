
"use client";

import "./gallery.css";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { GalleryPreviewDialog } from "./gallery-preview-dialog";
import GalleryCanvas from "./gallery-canvas";
import { GalleryMoreInfoDialog } from "./gallery-more-info-dialog";
import { useNavigationStore } from "@/stores/navigation-context";

import type {
    GalleryItem,
    GallerySource,
} from "./gallery.types";

const ITEM_WIDTH = 320;
const COLUMN_GAP = 24;
const ROW_GAP = 24;
const COLUMNS = 6;
const START_X = 16;
const START_Y = 16;

const INITIAL_BATCH_SIZE = 24;
const NEXT_BATCH_SIZE = 18;

type ImageDimensions = {
    width: number;
    height: number;
};

type GalleryLayout = {
    items: GalleryItem[];
    columnHeights: number[];
};

const imageDimensionsCache = new Map<
    string,
    Promise<ImageDimensions>
>();

function getImageDimensions(
    src: string
): Promise<ImageDimensions> {
    const cached = imageDimensionsCache.get(src);

    if (cached) return cached;

    const promise = new Promise<ImageDimensions>(
        (resolve, reject) => {
            const image = new Image();

            image.onload = () => {
                resolve({
                    width: image.naturalWidth,
                    height: image.naturalHeight,
                });
            };

            image.onerror = () => {
                reject(new Error(`Failed to load image: ${src}`));
            };

            image.src = src;
        }
    );

    imageDimensionsCache.set(src, promise);

    // Allow failed images to be retried later.
    void promise.catch(() => {
        if (imageDimensionsCache.get(src) === promise) {
            imageDimensionsCache.delete(src);
        }
    });

    return promise;
}

async function createGalleryItems(
    sources: GallerySource[],
    previousColumnHeights: number[],
    occurrence: number
): Promise<GalleryLayout> {
    const columnHeights = [...previousColumnHeights];

    const loadedSources = await Promise.all(
        sources.map(async (source) => {
            try {
                const dimensions = await getImageDimensions(
                    source.src
                );

                return { source, ...dimensions };
            } catch (error) {
                console.error(error);
                return null;
            }
        })
    );

    const validSources = loadedSources.filter(
        (item): item is NonNullable<typeof item> =>
            item !== null
    );

    const newItems = validSources.map(
        ({ source, width, height }) => {
            let shortestColumn = 0;

            for (let column = 1; column < COLUMNS; column++) {
                if (
                    columnHeights[column]! <
                    columnHeights[shortestColumn]!
                ) {
                    shortestColumn = column;
                }
            }

            const x =
                START_X +
                shortestColumn * (ITEM_WIDTH + COLUMN_GAP);

            const y = columnHeights[shortestColumn]!;

            const renderedHeight =
                ITEM_WIDTH * (height / width);

            columnHeights[shortestColumn] =
                y + renderedHeight + ROW_GAP;

            return {
                id:
                    occurrence === 0
                        ? source.key
                        : `${source.key}__repeat_${occurrence}`,
                projectId: source.projectId ?? source.key,
                project: source.project,
                category: source.category,
                column: shortestColumn,
                position: { x, y },
                media: {
                    type: "image" as const,
                    src: source.src,
                    width,
                    height,
                    alt: source.alt,
                },
            };
        }
    );

    return {
        items: newItems,
        columnHeights,
    };
}


function shuffleSources(sources: GallerySource[]): GallerySource[] {
    const shuffled = [...sources];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [shuffled[i], shuffled[j]] = [
            shuffled[j]!,
            shuffled[i]!,
        ];
    }

    return shuffled;
}

export default function Gallery({
    items,
}: {
    items: GallerySource[];
}) {
    const category = useNavigationStore(
        (state) => state.category
    );

    const [galleryItems, setGalleryItems] =
        useState<GalleryItem[]>([]);

    const [selectedItem, setSelectedItem] =
        useState<GalleryItem | null>(null);

    const [moreInfoItem, setMoreInfoItem] =
        useState<GalleryItem | null>(null);

    const [isMoreInfoOpen, setIsMoreInfoOpen] =
        useState(false);

    const [isMobile, setIsMobile] = useState(false);

    const [logoLoaded, setLogoLoaded] = useState(false);
    const [logoError, setLogoError] = useState(false);

    const sourceCursorRef = useRef(0);

    const columnHeightsRef = useRef<number[]>(
        Array.from({ length: COLUMNS }, () => START_Y)
    );

    const loadingRef = useRef(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia(
            "(max-width: 767px)"
        );

        const updateViewport = () => {
            setIsMobile(mediaQuery.matches);
        };

        updateViewport();
        mediaQuery.addEventListener("change", updateViewport);

        return () => {
            mediaQuery.removeEventListener(
                "change",
                updateViewport
            );
        };
    }, []);

    const filteredItems = useMemo(() => {
        const categoryMap: Record<
            string,
            GallerySource["category"] | "all"
        > = {
            all: "all",
            web: "web",
            product: "product",
            brand: "branding",
            app: "app",
        };

        const selectedCategory = categoryMap[category];

        if (!selectedCategory || selectedCategory === "all") {
            return items;
        }

        return items.filter(
            (item) => item.category === selectedCategory
        );
    }, [items, category]);


    const randomizedItems = useMemo(
        () => shuffleSources(filteredItems),
        [filteredItems]
    );

    useEffect(() => {
        let cancelled = false;

        sourceCursorRef.current = 0;
        loadingRef.current = false;

        columnHeightsRef.current = Array.from(
            { length: COLUMNS },
            () => START_Y
        );

        setGalleryItems([]);
        setSelectedItem(null);
        setMoreInfoItem(null);
        setIsMoreInfoOpen(false);

        async function loadInitialBatch() {
            if (randomizedItems.length === 0) return;

            const batch = randomizedItems.slice(
                0,
                INITIAL_BATCH_SIZE
            );

            const result = await createGalleryItems(
                batch,
                columnHeightsRef.current,
                0
            );

            if (cancelled) return;

            columnHeightsRef.current = result.columnHeights;
            sourceCursorRef.current = batch.length;

            setGalleryItems(result.items);
        }

        void loadInitialBatch();

        return () => {
            cancelled = true;
        };
    }, [randomizedItems]);

    const loadNextBatch = useCallback(async () => {
        const totalSources = randomizedItems.length;

        if (totalSources === 0 || loadingRef.current) {
            return;
        }

        loadingRef.current = true;

        try {
            const cursor = sourceCursorRef.current;

            // Which repetition of the original source list?
            const occurrence = Math.floor(cursor / totalSources);

            // Index within that repetition.
            const sourceIndex = cursor % totalSources;

            // Don't cross a repetition boundary in one batch.
            const count = Math.min(
                NEXT_BATCH_SIZE,
                totalSources - sourceIndex
            );

            const batch = randomizedItems.slice(
                sourceIndex,
                sourceIndex + count
            );

            const result = await createGalleryItems(
                batch,
                columnHeightsRef.current,
                occurrence
            );

            // A category change resets the cursor and layout.
            // Avoid appending stale results after that reset.
            if (sourceCursorRef.current !== cursor) {
                return;
            }

            columnHeightsRef.current = result.columnHeights;
            sourceCursorRef.current = cursor + count;

            setGalleryItems((current) => [
                ...current,
                ...result.items,
            ]);
        } catch (error) {
            console.error("Failed to append gallery items", error);
        } finally {
            loadingRef.current = false;
        }
    }, [randomizedItems]);

    const handleMoreInfoOpen = (item: GalleryItem | null) => {
        if (!item) return;

        setMoreInfoItem(item);
        setLogoLoaded(false);
        setLogoError(false);

        if (isMobile) {
            // Hide the image preview and its close button on mobile.
            setSelectedItem(null);
        }

        // Desktop keeps the image preview open underneath.
        setIsMoreInfoOpen(true);
    };

    const handleMoreInfoMinimize = () => {
        const itemToRestore = moreInfoItem;

        setIsMoreInfoOpen(false);
        setMoreInfoItem(null);

        // Return to the image preview on mobile after minimizing.
        if (isMobile && itemToRestore) {
            setSelectedItem(itemToRestore);
        }
    };

    // A real dismissal closes the entire gallery experience.
    const handleDismissAll = () => {
        setIsMoreInfoOpen(false);
        setMoreInfoItem(null);
        setSelectedItem(null);
    };

    return (
        <div className="gallery">
            {galleryItems.length > 0 && (
                <GalleryCanvas
                    items={galleryItems}
                    onReachBottom={loadNextBatch}
                    onSelect={(item) => {
                        setSelectedItem(item);
                        setMoreInfoItem(null);
                        setIsMoreInfoOpen(false);
                    }}
                />
            )}

            <GalleryPreviewDialog
                open={!!selectedItem}
                item={selectedItem}
                showInfoCard={!isMoreInfoOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        handleDismissAll();
                    }
                }}
                onMoreInfoClick={() => {
                    handleMoreInfoOpen(selectedItem);
                }}
            />

            <GalleryMoreInfoDialog
                open={isMoreInfoOpen}
                item={moreInfoItem}
                onOpenChange={(open) => {
                    if (!open) {
                        // Overlay click / Escape dismisses all.
                        handleDismissAll();
                    }
                }}
                onMinimize={handleMoreInfoMinimize}
                logoLoaded={logoLoaded}
                logoError={logoError}
                setLogoLoaded={setLogoLoaded}
                setLogoError={setLogoError}
            />
        </div>
    );
}
