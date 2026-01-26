import { GalleryWithImages } from '@/entities/gallery';

export const getDefaultValues = (gallery?: GalleryWithImages) => {
  if (!gallery) {
    return {
      title: '',
      eventDate: '',
      images: [],
    };
  }

  const formImages = gallery.images.map((img) => ({
    file: null,
    id: img.id,
    isThumbnail: img.storagePath === gallery.thumbnailUrl,
    preview: img.storagePath,
  }));

  return {
    id: gallery.id,
    title: gallery.title,
    eventDate: gallery.eventDate.split('T')[0],
    images: formImages,
  };
};

export function toFormData(
  data: {
    title: string;
    eventDate: string;
  },
  thumbnailIndex: number,
  keepImageIds: string[],
): FormData {
  const formData = new FormData();

  formData.append('title', data.title);
  formData.append('eventDate', data.eventDate);
  formData.append('thumbnailIndex', String(thumbnailIndex));
  keepImageIds.forEach((id) => {
    formData.append('keepImageIds', id);
  });

  return formData;
}
