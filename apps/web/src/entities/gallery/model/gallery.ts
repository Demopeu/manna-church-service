export interface Gallery {
  id: string;
  shortId: string;
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

export interface GalleryListItem extends Gallery {
  imagesCount: number;
}

export interface GalleryWithImages extends Gallery {
  images: GalleryImage[];
}
