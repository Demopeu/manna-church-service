import type { SermonDto } from '../api/dto';
import type { Sermon } from '../model/sermon';

export function mapSermon(dto: SermonDto): Sermon {
  return {
    id: dto.id,
    title: dto.title,
    preacher: dto.preacher,
    date: dto.preached_at,
    videoUrl: dto.video_url,
    createdAt: dto.created_at,
  };
}
