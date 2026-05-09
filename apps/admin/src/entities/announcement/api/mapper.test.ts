import { expect, test } from 'vitest';
import type { AnnouncementDto } from './dto';
import { mapAnnouncement } from './mapper';

test('DTO 객체를 도메인 모델인 Announcement로 정확하게 변환', () => {
  const mockDto: AnnouncementDto = {
    id: 'test-id',
    title: '공지사항 제목',
    content: '공지 내용',
    is_urgent: true,
    created_at: '2026-05-09T00:00:00Z',
    start_date: '2026-05-10T00:00:00Z',
    short_id: 'test-short-id',
  };
  const result = mapAnnouncement(mockDto);
  expect(result).toEqual({
    id: 'test-id',
    title: '공지사항 제목',
    content: '공지 내용',
    isUrgent: true,
    createdAt: '2026-05-09T00:00:00Z',
    startDate: '2026-05-10T00:00:00Z',
  });
});
