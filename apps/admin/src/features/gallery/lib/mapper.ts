import { GalleryWithImages } from '@/entities/gallery';
import { CreateGalleryInput } from '../model/schema';

export interface GalleryFormImage {
  id: string;
  file: File | null;
  preview: string;
  isThumbnail: boolean;
}

export const getDefaultValues = (
  gallery?: GalleryWithImages,
): CreateGalleryInput => {
  const images = gallery
    ? gallery.images.map((img, index) => ({
        file: null as unknown as File,
        isThumbnail: index === 0,
      }))
    : [];

  return {
    title: gallery?.title ?? '',
    eventDate: gallery?.eventDate ?? '',
    images:
      images.length > 0
        ? images
        : [{ file: null as unknown as File, isThumbnail: true }],
  };
};

export function toFormData(
  data: CreateGalleryInput,
  previews: GalleryFormImage[],
): FormData {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('eventDate', data.eventDate);

  const thumbnailIndex = previews.findIndex((p) => p.isThumbnail);
  formData.append(
    'thumbnailIndex',
    String(thumbnailIndex >= 0 ? thumbnailIndex : 0),
  );

  previews.forEach((preview, index) => {
    if (preview.file) {
      formData.append(`image-${index}`, preview.file);
    }
  });

  return formData;
}
