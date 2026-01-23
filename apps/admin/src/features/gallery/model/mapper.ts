import { GalleryWithImages } from '@/entities/gallery';

export const getDefaultValues = (gallery?: GalleryWithImages) => ({
  title: gallery?.title || '',
  eventDate: gallery?.eventDate || '',
});

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
  formData.append('keepImageIds', JSON.stringify(keepImageIds));

  return formData;
}
