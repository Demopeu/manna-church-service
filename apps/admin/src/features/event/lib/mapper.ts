import { Event } from '@/entities/event';

export function getDefaultValues(event?: Event) {
  return {
    title: event?.title || '',
    description: event?.description || '',
    startDate: event?.startDate || '',
  };
}
