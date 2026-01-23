import { Announcement } from '@/entities/announcement';
import { CreateAnnouncementInput } from '../model/schema';

export function getDefaultValues(
  announcement?: Announcement,
): CreateAnnouncementInput {
  return {
    title: announcement?.title || '',
    content: announcement?.content || '',
    isUrgent: announcement?.isUrgent || false,
  };
}

export function toFormData(data: CreateAnnouncementInput): FormData {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('content', data.content);
  formData.append('isUrgent', data.isUrgent.toString());
  return formData;
}
