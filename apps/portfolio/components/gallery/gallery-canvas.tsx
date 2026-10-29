    "use client";

import {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type PointerEvent,
} from "react";

    import GalleryItem from "./gallery-item";

    import type {
        GalleryItem as Item,
        Position,
    } from "./gallery.types";
import { BOTTOM_THRESHOLD } from "./gallery.constants";

interface Props {
    items: Item[];
    onSelect: (item: Item) => void;
    onReachBottom: () => void;
}

    const ITEM_WIDTH = 320;

    const CANVAS_PADDING = 16;

export default function GalleryCanvas({
    items,
    onSelect,
    onReachBottom,
}: Props) {
        const viewportRef =
            useRef<HTMLDivElement | null>(null);

        const [
            position,
            setPosition,
        ] = useState<Position>({
            x: 0,
            y: 0,
        });

        const [
            zoom,
            setZoom,
        ] = useState(1);

        const [
            viewportSize,
            setViewportSize,
        ] = useState({
            width: 0,
            height: 0,
        });

        const dragging =
            useRef(false);

        const lastPointer =
            useRef({
                x: 0,
                y: 0,
            });

    const HORIZONTAL_TILE_COUNT = 3;
    const RECENTER_THRESHOLD = 180;

    const [tileBase, setTileBase] = useState(-1);

    const hasInitializedTilesRef = useRef(false);
        /*
        * ----------------------------------------
        * Measure viewport
        * ----------------------------------------
        */

        useEffect(() => {
            const element = viewportRef.current;

            if (element === null) {
                return;
            }

            const updateSize = () => {
                setViewportSize({
                    width: element.clientWidth,
                    height: element.clientHeight,
                });
            };

            updateSize();

            const observer = new ResizeObserver(updateSize);

            observer.observe(element);

            return () => {
                observer.disconnect();
            };
        }, []);

        /*
        * ----------------------------------------
        * Calculate canvas dimensions
        * ----------------------------------------
        */

    const baseCanvasWidth =
        items.reduce(
            (max, item) =>
                Math.max(max, item.position.x + ITEM_WIDTH),
            0
        ) + CANVAS_PADDING;

    // Keep the same spacing between the last item of one tile
    // and the first item of the next tile.
    const horizontalTileStride =
        baseCanvasWidth - CANVAS_PADDING / 2;

    const canvasWidth =
        baseCanvasWidth +
        (HORIZONTAL_TILE_COUNT - 1) * horizontalTileStride;

    const canvasHeight =
        items.reduce(
            (max, item) => {
                const height =
                    ITEM_WIDTH *
                    (item.media.height / item.media.width);

                return Math.max(
                    max,
                    item.position.y + height
                );
            },
            0
        ) + CANVAS_PADDING;

    useEffect(() => {
        if (
            !hasInitializedTilesRef.current &&
            horizontalTileStride > 0
        ) {
            hasInitializedTilesRef.current = true;
            setTileBase(-1);

            setPosition((current) => ({
                ...current,
                x: -horizontalTileStride,
            }));
        }
    }, [
        items.length,
        horizontalTileStride,
    ]);

    useEffect(() => {
        if (
            viewportSize.height === 0 ||
            items.length === 0) {
            return;
        }

    }, [
        items.length,
        position.y,
        zoom,
        viewportSize.height,
        canvasHeight,
    ]);

    useEffect(() => {
        const distanceToBottom =
            canvasHeight * zoom +
            position.y -
            viewportSize.height;

        if (distanceToBottom < BOTTOM_THRESHOLD) {
            onReachBottom();
        }
    }, [
        canvasHeight,
        zoom,
        position.y,
        viewportSize.height,
        onReachBottom,
    ]);

    useLayoutEffect(() => {
        if (
            viewportSize.width === 0 ||
            items.length === 0 ||
            horizontalTileStride <= 0
        ) {
            return;
        }

        const minX = Math.min(
            0,
            viewportSize.width - canvasWidth * zoom
        );

        // Approaching the left edge: recycle one tile to the left.
        if (position.x > -RECENTER_THRESHOLD) {
            setTileBase((current) => current - 1);

            setPosition((current) => ({
                ...current,
                x: current.x - horizontalTileStride * zoom,
            }));

            return;
        }

        // Approaching the right edge: recycle one tile to the right.
        if (position.x < minX + RECENTER_THRESHOLD) {
            setTileBase((current) => current + 1);

            setPosition((current) => ({
                ...current,
                x: current.x + horizontalTileStride * zoom,
            }));
        }
    }, [
        items.length,
        position.x,
        zoom,
        viewportSize.width,
        canvasWidth,
        horizontalTileStride,
    ]);
        /*
        * ----------------------------------------
        * Calculate allowed pan
        * ----------------------------------------
        *
        * position.x / position.y represents
        * where the canvas has moved.
        *
        * We don't allow the canvas to move
        * completely outside the viewport.
        */

        function clampPosition(
            next: Position,
            currentZoom: number
        ): Position {
            /*
            * Actual displayed canvas size
            * after zoom.
            */

            const scaledWidth =
                canvasWidth *
                currentZoom;

            const scaledHeight =
                canvasHeight *
                currentZoom;

            /*
            * Horizontal limits.
            */

            const minX =
                Math.min(
                    0,
                    viewportSize.width -
                    scaledWidth
                );

            const maxX =
                0;

            /*
            * Vertical limits.
            */

            const minY =
                Math.min(
                    0,
                    viewportSize.height -
                    scaledHeight
                );

            const maxY =
                0;

            return {
                x: Math.min(
                    maxX,
                    Math.max(
                        minX,
                        next.x
                    )
                ),

                y: Math.min(
                    maxY,
                    Math.max(
                        minY,
                        next.y
                    )
                ),
            };
        }

        useEffect(() => {
            const viewport = viewportRef.current;

            if (!viewport) return;

            const handleWheel = (event: globalThis.WheelEvent) => {
                // Keep browser zoom gestures inside the gallery.

                if (event.ctrlKey || event.metaKey) {
                    event.preventDefault();

                    const rect = viewport.getBoundingClientRect();

                    // Cursor position relative to the viewport.
                    const cursorX = event.clientX - rect.left;
                    const cursorY = event.clientY - rect.top;

                    setZoom((currentZoom) => {
                        const nextZoom = Math.min(
                            3,
                            Math.max(
                                0.5,
                                currentZoom * Math.exp(-event.deltaY * 0.002)
                            )
                        );

                        // Keep the canvas point beneath the cursor fixed.
                        const scaleRatio = nextZoom / currentZoom;

                        setPosition((currentPosition) =>
                            clampPosition(
                                {
                                    x:
                                        cursorX -
                                        (cursorX - currentPosition.x) * scaleRatio,
                                    y:
                                        cursorY -
                                        (cursorY - currentPosition.y) * scaleRatio,
                                },
                                nextZoom
                            )
                        );

                        return nextZoom;
                    });

                    return;
                }


                // Regular trackpad scrolling pans the gallery.
                event.preventDefault();

                setPosition((current) =>
                    clampPosition(
                        {
                            x: current.x - event.deltaX,
                            y: current.y - event.deltaY,
                        },
                        zoom
                    )
                );
            };

            viewport.addEventListener("wheel", handleWheel, {
                passive: false,
            });

            return () => {
                viewport.removeEventListener("wheel", handleWheel);
            };
        }, [zoom, viewportSize, canvasWidth, canvasHeight]);
        /*
        * ----------------------------------------
        * Pointer PAN
        * ----------------------------------------
        */
    function handlePointerDown(
        event: PointerEvent<HTMLDivElement>
    ) {
        if (
            event.pointerType === "mouse" &&
            event.button !== 0
        ) {
            return;
        }

        dragging.current = false;

        lastPointer.current = {
            x: event.clientX,
            y: event.clientY,
        };

        /*
        * IMPORTANT:
        *
        * Do NOT call setPointerCapture here.
        *
        * We want a normal click on a GalleryItem
        * to remain a normal click.
        *
        * Pointer capture will happen only after
        * the user actually starts dragging.
        */
    }

    function handlePointerMove(
        event: PointerEvent<HTMLDivElement>
    ) {
        /*
        * On desktop, only pan while the left
        * mouse button is actually held.
        */
        if (
            event.pointerType === "mouse" &&
            event.buttons !== 1
        ) {
            return;
        }

        const dx =
            event.clientX -
            lastPointer.current.x;

        const dy =
            event.clientY -
            lastPointer.current.y;

        /*
        * Wait until the pointer has actually moved
        * before treating this as a drag.
        */
        if (!dragging.current) {
            const distance = Math.sqrt(
                dx * dx +
                dy * dy
            );

            if (distance < 3) {
                return;
            }

            /*
            * The user is now definitely dragging.
            *
            * Capture the pointer NOW, not on
            * pointerdown.
            */
            dragging.current = true;

            event.currentTarget.setPointerCapture(
                event.pointerId
            );
        }

        lastPointer.current = {
            x: event.clientX,
            y: event.clientY,
        };

        setPosition(
            (current) =>
                clampPosition(
                    {
                        x:
                            current.x +
                            dx,

                        y:
                            current.y +
                            dy,
                    },
                    zoom
                )
        );
    }

    function handlePointerUp(
        event: PointerEvent<HTMLDivElement>
    ) {
        dragging.current = false;

        try {
            if (
                event.currentTarget.hasPointerCapture(
                    event.pointerId
                )
            ) {
                event.currentTarget.releasePointerCapture(
                    event.pointerId
                );
            }
        } catch {
            // Pointer capture may already have been released.
        }
    }

        return (
            <div
                ref={viewportRef}
                className="
            fixed
            inset-0
            z-0
            overflow-hidden
        "
                style={{
                    touchAction: "none",
                    overscrollBehavior: "none",
                    overscrollBehaviorX: "none",
                    overscrollBehaviorY: "none",
                    cursor: dragging.current ? "grabbing" : "grab",
                }}
                onPointerDown={
                    handlePointerDown
                }
                onPointerMove={
                    handlePointerMove
                }
                onPointerUp={
                    handlePointerUp
                }
                onPointerCancel={
                    handlePointerUp
                }
            >
                {/* 
                * --------------------------------
                * FIXED CANVAS
                * --------------------------------
                */}

                <div
                    className="
            absolute
            left-0
            top-0
        "
                    style={{
                        width: canvasWidth,
                        height: canvasHeight,

                        transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${zoom})`,
                        transformOrigin: "0 0",
                        willChange: "transform",

                        /*
                        * Let the full-screen viewport receive
                        * pointer events everywhere.
                        *
                        * Individual gallery items below will
                        * explicitly enable pointer events.
                        */
                        pointerEvents: "none",
                    }}
                >

                    {Array.from(
                        { length: HORIZONTAL_TILE_COUNT },
                        (_, index) => tileBase + index
                    ).map((tile, tileIndex) => {
                        const horizontalOffset =
                            (tile - tileBase) * horizontalTileStride;

                        const visibleLeft = -position.x / zoom;
                        const visibleRight =
                            (viewportSize.width - position.x) / zoom;
                        const visibleTop = -position.y / zoom;
                        const visibleBottom =
                            (viewportSize.height - position.y) / zoom;

                        const bufferX = 1000 / zoom;
                        const bufferY = 500 / zoom;

                        return items
                            .filter((item) => {
                                const x = item.position.x + horizontalOffset;
                                const y = item.position.y;

                                const height =
                                    ITEM_WIDTH *
                                    (item.media.height / item.media.width);

                                return (
                                    x + ITEM_WIDTH >= visibleLeft - bufferX &&
                                    x <= visibleRight + bufferX &&
                                    y + height >= visibleTop - bufferY &&
                                    y <= visibleBottom + bufferY
                                );
                            })
                            .map((item) => {
                                const displayedItem = {
                                    ...item,
                                    id:
                                        tile === 0
                                            ? item.id
                                            : `${item.id}__horizontal_${tile}`,
                                    position: {
                                        ...item.position,
                                        x: item.position.x + horizontalOffset,
                                    },
                                };

                                return (
                                    <div
                                        key={`${tileIndex}:${item.id}`}
                                        className="absolute"
                                        style={{
                                            left: displayedItem.position.x,
                                            top: displayedItem.position.y,
                                            width: ITEM_WIDTH,
                                            pointerEvents: "auto",
                                        }}
                                    >
                                        <GalleryItem
                                            data={displayedItem}
                                            onClick={() => onSelect(displayedItem)}
                                        />
                                    </div>
                                );
                            });
                    })}

                </div>
            </div>
        );
    }