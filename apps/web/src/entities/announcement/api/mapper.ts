import type { AnnouncementDto } from '../api/dto';
import type { Announcement } from '../model/announcement';

export function mapAnnouncement(dto: AnnouncementDto): Announcement {
  return {
    id: dto.id,
    title: dto.title,
    shortId: dto.short_id,
    content: dto.content,
    isUrgent: dto.is_urgent,
    createdAt: dto.created_at,
  };
}
