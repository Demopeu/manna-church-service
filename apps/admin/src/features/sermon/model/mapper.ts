import { Sermon } from '@/entities/sermon';
import { CreateSermonInput } from './schema';

export const getDefaultValues = (sermon?: Sermon) => ({
  title: sermon?.title ?? '',
  preacher: sermon?.preacher ?? '',
  date: sermon?.date ?? '',
  videoUrl: sermon?.videoUrl ?? '',
});

export function toFormData(data: CreateSermonInput): FormData {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('preacher', data.preacher);
  formData.append('date', data.date);
  formData.append('youtubeUrl', data.youtubeUrl);
  return formData;
}
