import * as React from "react";
import { PlusIcon } from "@/icons/plus";
import { ReplaceIcon } from "@/icons/replace";
import { TrashIcon } from "@/icons/trash";

import { cn } from "@workspace/ui/lib/utils";
import { Typography } from "@workspace/ui/components/typography/typography";

export interface PhotoGalleryImage {
    id: string;
    src: string;
    alt?: string;
}

export interface PhotoGalleryProps {
    /**
     * Existing images from the backend.
     */
    images?: PhotoGalleryImage[];

    /**
     * Files selected through the Add Image button.
     *
     * Use this to upload the files to your backend.
     */
    onAdd?: (files: File[]) => void;

    /**
     * File selected for replacing an existing image.
     */
    onReplace?: (imageId: string, file: File) => void;

    /**
     * Called when an image is deleted.
     */
    onDelete?: (imageId: string) => void;

    maxImages?: number;

    accept?: string;

    label?: React.ReactNode;

    className?: string;
}

interface LocalImage extends PhotoGalleryImage {
    objectUrl: string;
}

export function PhotoGallery({
    images = [],
    onAdd,
    onReplace,
    onDelete,
    maxImages,
    accept = "image/*",
    label = "Photo gallery",
    className,
}: PhotoGalleryProps) {
    const addInputRef = React.useRef<HTMLInputElement>(null);
    const replaceInputRef = React.useRef<HTMLInputElement>(null);

    const [localImages, setLocalImages] = React.useState<
        LocalImage[]
    >([]);

    const [replaceImageId, setReplaceImageId] =
        React.useState<string | null>(null);

    /*
     * Backend images + images selected locally.
     */
    const allImages = React.useMemo(
        () => [
            ...images,
            ...localImages,
        ],
        [images, localImages]
    );

    const canAdd =
        maxImages === undefined ||
        allImages.length < maxImages;

    /*
     * Cleanup object URLs when local images are removed/unmounted.
     */
    React.useEffect(() => {
        return () => {
            localImages.forEach((image) => {
                URL.revokeObjectURL(image.objectUrl);
            });
        };
    }, [localImages]);

    /*
     * Open native file picker.
     */
    const handleAddClick = () => {
        if (!canAdd) return;

        addInputRef.current?.click();
    };

    /*
     * User selected files from the native file picker.
     */
    const handleAddChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = Array.from(
            event.target.files ?? []
        );

        if (files.length === 0) return;

        const availableSlots =
            maxImages !== undefined
                ? Math.max(
                    maxImages - allImages.length,
                    0
                )
                : files.length;

        const selectedFiles = files.slice(
            0,
            availableSlots
        );

        /*
         * Immediately show selected files.
         */
        const newImages: LocalImage[] =
            selectedFiles.map((file) => {
                const objectUrl =
                    URL.createObjectURL(file);

                return {
                    id: crypto.randomUUID(),
                    src: objectUrl,
                    alt: file.name,
                    objectUrl,
                };
            });

        setLocalImages((current) => [
            ...current,
            ...newImages,
        ]);

        /*
         * Give the real File objects to the parent.
         *
         * This is where your backend upload logic
         * can eventually happen.
         */
        onAdd?.(selectedFiles);

        /*
         * Allows selecting the same file again.
         */
        event.target.value = "";
    };

    /*
     * Open native picker for replacement.
     */
    const handleReplaceClick = (
        imageId: string
    ) => {
        setReplaceImageId(imageId);

        replaceInputRef.current?.click();
    };

    /*
     * Replace selected image.
     */
    const handleReplaceChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file || !replaceImageId) {
            return;
        }

        /*
         * If replacing a locally selected image,
         * update it immediately.
         */
        setLocalImages((current) =>
            current.map((image) => {
                if (image.id !== replaceImageId) {
                    return image;
                }

                URL.revokeObjectURL(image.objectUrl);

                const objectUrl =
                    URL.createObjectURL(file);

                return {
                    ...image,
                    src: objectUrl,
                    alt: file.name,
                    objectUrl,
                };
            })
        );

        /*
         * Parent/backend can persist the replacement.
         */
        onReplace?.(replaceImageId, file);

        setReplaceImageId(null);

        event.target.value = "";
    };

    /*
     * Delete image.
     */
    const handleDelete = (imageId: string) => {
        const localImage = localImages.find(
            (image) => image.id === imageId
        );

        if (localImage) {
            URL.revokeObjectURL(
                localImage.objectUrl
            );

            setLocalImages((current) =>
                current.filter(
                    (image) => image.id !== imageId
                )
            );
        }

        /*
         * Parent handles deletion of backend images.
         */
        onDelete?.(imageId);
    };

    return (
        <div
            className={cn(
                "flex w-full flex-col",
                "items-start",
                "gap-2",
                "self-stretch",
                className
            )}
        >
            {/* Label */}
            <Typography
                variant="field-label"
                className="text-[#221E15]"
            >
                {label}
            </Typography>

            {/* Native Add Image picker */}
            <input
                ref={addInputRef}
                type="file"
                accept={accept}
                multiple
                className="hidden"
                onChange={handleAddChange}
            />

            {/* Native Replace picker */}
            <input
                ref={replaceInputRef}
                type="file"
                accept={accept}
                className="hidden"
                onChange={handleReplaceChange}
            />

            {/* Image grid */}
            <div
                className={cn(
                    "flex items-start",
                    "gap-2",
                    "self-stretch",
                    "overflow-x-auto"
                )}
            >
                {/* Add Image */}
                {canAdd && (
                    <button
                        type="button"
                        onClick={handleAddClick}
                        className={cn(
                            "flex h-24 w-24 shrink-0",
                            "flex-col",
                            "items-center",
                            "justify-center",
                            "gap-1",
                            "rounded-[4px]",
                            "border border-dashed",
                            "border-[#E9E8E8]",
                            "bg-white",
                            "text-[#221E15]",
                            "outline-none",
                            "transition-colors",
                            "hover:bg-[#F9F9F7]",
                            "focus-visible:ring-2",
                            "focus-visible:ring-[#221E15]/20"
                        )}
                    >
                        <PlusIcon
                            className="h-4 w-4 shrink-0"
                            aria-hidden="true"
                        />

                        <Typography
                            as="span"
                            variant="inline-text-emphasis"
                        >
                            Add Image
                        </Typography>
                    </button>
                )}

                {/* Images */}
                {allImages.map((image) => (
                    <div
                        key={image.id}
                        className={cn(
                            "group relative",
                            "h-24 w-24 shrink-0",
                            "overflow-hidden",
                            "rounded-[4px]",
                            "bg-gray-100"
                        )}
                    >
                        <img
                            src={image.src}
                            alt={image.alt ?? ""}
                            className="h-full w-full object-cover"
                        />

                        {/* Action overlay */}
                        <div
                            className={cn(
                                "absolute inset-0",
                                "flex items-center justify-center",
                                "gap-2",
                                "bg-black/20",
                                "opacity-0",
                                "transition-opacity",
                                "group-hover:opacity-100",
                                "group-focus-within:opacity-100"
                            )}
                        >
                            {/* Replace */}
                            <button
                                type="button"
                                onClick={() =>
                                    handleReplaceClick(
                                        image.id
                                    )
                                }
                                aria-label="Replace image"
                                className={cn(
                                    "flex items-center",
                                    "gap-2",
                                    "rounded-full",
                                    "bg-black/50",
                                    "p-1.5",
                                    "text-white",
                                    "hover:bg-black/60"
                                )}
                            >
                                <ReplaceIcon
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                    color="white"
                                />
                            </button>

                            {/* Delete */}
                            <button
                                type="button"
                                onClick={() =>
                                    handleDelete(
                                        image.id
                                    )
                                }
                                aria-label="Delete image"
                                className={cn(
                                    "flex items-center",
                                    "gap-2",
                                    "rounded-full",
                                    "bg-black/50",
                                    "p-1.5",
                                    "text-white",
                                    "hover:bg-black/60"
                                )}
                            >
                                <TrashIcon
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                    color="white"
                                />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}