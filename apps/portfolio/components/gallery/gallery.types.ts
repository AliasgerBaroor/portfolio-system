export type GalleryCategory =
  | "web"
  | "product"
  | "branding"
  | "app";

export type GalleryMetric = {
  value: string;
  label: string;
};

export type GalleryProject = {
  name: string;
  logo: string;
  industry: string;
  description: string;
  details: string;
  tags: string[];
  metrics: GalleryMetric[];
};

export type GallerySource = {
  key: string;
  src: string;
  category: GalleryCategory;
  alt: string;
  projectId?: string;
  project?: GalleryProject;
};

export type GalleryItem = {
  id: string;
  category?: GalleryCategory;
  column?: number;

  position: {
    x: number;
    y: number;
  };

  media: {
    type: "image" | "video";
    src: string;
    width: number;
    height: number;
    poster?: string;
    alt?: string;
  };

  projectId?: string;
  project?: GalleryProject;
};

export type GalleryItemState =
  | "idle"
  | "active"
  | "inactive";

export type Position = {
  x: number;
  y: number;
};