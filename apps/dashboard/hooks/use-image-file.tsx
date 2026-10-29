import * as React from "react";

interface ImageFileInfo {
    image: React.ReactNode;
    name: string;
    width: number | null;
    height: number | null;
    meta: string;
}

interface ImageFileSource {
    src?: string;
    file?: File;
}

function normalizeFileName(fileName: string): string {
    try {
        return decodeURIComponent(fileName)
            .replace(/[_-]+/g, " ")
            .replace(/[()[\]{}]/g, "")
            .replace(/\s+/g, " ")
            .trim() || "Untitled";
    } catch {
        return fileName || "Untitled";
    }
}

function getFileName(src: string): string {
    try {
        const url = new URL(src, window.location.href);

        const fileName =
            url.pathname.split("/").pop() || "Untitled";

        return normalizeFileName(fileName);
    } catch {
        return "Untitled";
    }
}

async function getImageSize(
    src: string
): Promise<number | null> {
    if (typeof window === "undefined") {
        return null;
    }

    const absoluteUrl = new URL(
        src,
        window.location.href
    ).href;

    // First: use existing browser resource information.
    const entry = performance
        .getEntriesByName(absoluteUrl)
        .find(
            (item): item is PerformanceResourceTiming =>
                item.entryType === "resource"
        );

    if (entry?.encodedBodySize) {
        return Number(
            (entry.encodedBodySize / 1024).toFixed(1)
        );
    }

    // Fallback: ask the server for the file size.
    try {
        const response = await fetch(absoluteUrl, {
            method: "HEAD",
            cache: "force-cache",
        });

        const contentLength =
            response.headers.get("content-length");

        if (!contentLength) {
            return null;
        }

        return Number(
            (Number(contentLength) / 1024).toFixed(1)
        );
    } catch {
        return null;
    }
}

export function useImageFile({
    src,
    file,
}: ImageFileSource): ImageFileInfo {
    const [dimensions, setDimensions] = React.useState<{
        width: number;
        height: number;
    } | null>(null);

    const [sizeKb, setSizeKb] = React.useState<number | null>(
        file ? Number((file.size / 1024).toFixed(1)) : null
    );

    const [isLoading, setIsLoading] = React.useState(true);

    const [imageSrc, setImageSrc] = React.useState<string | null>(
        file ? null : src ?? null
    );

    /*
     * File name:
     * - uploaded File → use the real file.name
     * - existing URL → extract name from URL
     */
    const name = React.useMemo(() => {
        if (file) {
            return normalizeFileName(file.name);
        }

        if (src) {
            return getFileName(src);
        }

        return "Untitled";
    }, [file, src]);

    /*
     * Create preview URL for uploaded files.
     *
     * file.size gives us the exact file size immediately,
     * so no request is necessary.
     */
    React.useEffect(() => {
        if (!file) {
            setImageSrc(src ?? null);
            setSizeKb(null);
            return;
        }

        const objectUrl = URL.createObjectURL(file);

        setImageSrc(objectUrl);
        setSizeKb(
            Number((file.size / 1024).toFixed(1))
        );

        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [file, src]);

    /*
     * Existing URL → try to determine its size.
     *
     * Uploaded File → size is already known, so skip this.
     */
    React.useEffect(() => {
        let cancelled = false;

        setDimensions(null);
        setIsLoading(true);

        if (file) {
            return () => {
                cancelled = true;
            };
        }

        if (!src) {
            setIsLoading(false);
            setSizeKb(null);

            return () => {
                cancelled = true;
            };
        }

        getImageSize(src).then((size) => {
            if (!cancelled) {
                setSizeKb(size);
            }
        });

        return () => {
            cancelled = true;
        };
    }, [src, file]);

    const handleLoad = (
        event: React.SyntheticEvent<HTMLImageElement>
    ) => {
        const img = event.currentTarget;

        setDimensions({
            width: img.naturalWidth,
            height: img.naturalHeight,
        });

        setIsLoading(false);
    };

    const handleError = () => {
        setDimensions(null);
        setSizeKb(null);
        setIsLoading(false);
    };

    const image = imageSrc ? (
        <img
            src={imageSrc}
            alt={name}
            onLoad={handleLoad}
            onError={handleError}
            className="h-7 w-7 object-contain"
        />
    ) : null;

    let meta = "Loading...";

    if (!isLoading) {
        const dimensionText = dimensions
            ? `${dimensions.width} × ${dimensions.height}`
            : "—";

        const sizeText =
            sizeKb !== null
                ? `${sizeKb} kB`
                : "—";

        meta = `${dimensionText} • ${sizeText}`;
    }

    return {
        image,
        name,
        width: dimensions?.width ?? null,
        height: dimensions?.height ?? null,
        meta,
    };
}