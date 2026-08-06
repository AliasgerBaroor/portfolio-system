export type GalleryItem = {
  id: string;

  media: {
    type: "image" | "video";
    src: string;
    width: number;
    height: number;
    poster?: string;
    alt?: string;
  };

  projectId?: string;
};

export type GalleryItemState =
  | "idle"
  | "active"
  | "inactive";
