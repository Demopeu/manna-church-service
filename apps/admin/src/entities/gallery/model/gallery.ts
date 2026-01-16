export interface Gallery {
  id: string;
  title: string;
  eventDate: string;
  thumbnailUrl: string | null;
  createdAt: string;
}

export interface GalleryImage {
  id: string;
  galleryId: string;
  storagePath: string;
  width: number;
  height: number;
  createdAt: string;
}

export interface GalleryWithImages extends Gallery {
  images: GalleryImage[];
}
