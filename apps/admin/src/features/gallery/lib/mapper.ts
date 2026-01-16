import { GalleryWithImages } from '@/entities/gallery';

export interface GalleryFormImage {
  id: string;
  url: string;
  isThumbnail: boolean;
  file?: File;
}

export function getDefaultValues(gallery?: GalleryWithImages) {
  const images: GalleryFormImage[] = gallery
    ? gallery.images.map((img, index) => ({
        id: img.id,
        url: img.storagePath,
        isThumbnail: index === 0,
      }))
    : [];

  return {
    title: gallery?.title || '',
    eventDate: gallery?.eventDate || '',
    images,
  };
}
