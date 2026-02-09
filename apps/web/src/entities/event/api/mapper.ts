import type { EventDto } from '../api/dto';
import type { Event } from '../model/event';

export function mapEvent(dto: EventDto): Event {
  return {
    id: dto.id,
    shortId: dto.short_id,
    title: dto.title,
    description: dto.description || '',
    photoUrl: dto.photo_url,
    startDate: dto.start_date,
    createdAt: dto.created_at,
  };
}
