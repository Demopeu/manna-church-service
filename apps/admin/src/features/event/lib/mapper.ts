import { Event } from '@/entities/event';
import { CreateEventInput } from '../model/schema';

export const getDefaultValues = (event?: Event): CreateEventInput => ({
  title: event?.title || '',
  description: event?.description || '',
  startDate: event?.startDate || '',
  photoFile: null as unknown as File,
});

export function toFormData(data: CreateEventInput): FormData {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('startDate', data.startDate);
  if (data.photoFile) {
    formData.append('photoFile', data.photoFile);
  }
  return formData;
}
