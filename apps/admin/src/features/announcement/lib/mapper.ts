import { Announcement } from '@/entities/announcement';

export function getDefaultValues(announcement?: Announcement) {
  return {
    title: announcement?.title || '',
    content: announcement?.content || '',
    isUrgent: announcement?.isUrgent || false,
  };
}
