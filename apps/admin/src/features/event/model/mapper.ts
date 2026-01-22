import { Event } from '@/entities/event';

export const getDefaultValues = (event?: Event) => ({
  title: event?.title || '',
  description: event?.description || '',
  startDate: event?.startDate || '',
  photoFile: undefined as File | undefined,
});

export function toFormData(data: {
  title: string;
  description?: string | null | undefined;
  startDate: string;
  photoFile?: File | null;
}): FormData {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('description', data.description ?? '');
  formData.append('startDate', data.startDate);
  if (data.photoFile) {
    formData.append('photoFile', data.photoFile);
  }
  return formData;
}
