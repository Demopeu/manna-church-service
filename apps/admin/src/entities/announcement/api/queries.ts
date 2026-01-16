import { mapAnnouncement } from '../lib/mapper';
import type { AnnouncementDto } from './dto';
import type { Announcement } from '../model/announcement';

const MOCK_ANNOUNCEMENTS: AnnouncementDto[] = [
  {
    id: '1',
    title: '신년 특별 기도회 안내',
    content:
      '2024년 신년 특별 기도회가 1월 15일부터 17일까지 진행됩니다. 새해를 주님께 맡기는 귀한 시간이 되길 바랍니다. 많은 참여 부탁드립니다.',
    is_urgent: true,
    created_at: '2024-01-05T10:00:00Z',
  },
  {
    id: '2',
    title: '주차 안내',
    content:
      '교회 주차장 공사로 인해 당분간 인근 공영주차장을 이용해 주시기 바랍니다. 불편을 드려 죄송합니다.',
    is_urgent: false,
    created_at: '2024-01-03T14:30:00Z',
  },
  {
    id: '3',
    title: '부활절 연합예배 일정 변경',
    content:
      '부활절 연합예배 시간이 오전 10시에서 오전 11시로 변경되었습니다. 참고 부탁드립니다.',
    is_urgent: true,
    created_at: '2024-03-20T09:00:00Z',
  },
  {
    id: '4',
    title: '여름성경학교 교사 모집',
    content:
      '7월 여름성경학교를 섬겨주실 교사를 모집합니다. 어린이들과 함께 은혜로운 시간을 보내실 분들의 많은 지원 바랍니다.',
    is_urgent: false,
    created_at: '2024-05-15T16:00:00Z',
  },
  {
    id: '5',
    title: '추석 연휴 예배 안내',
    content:
      '추석 연휴 기간 동안 예배 시간이 변경됩니다. 9월 16일(토) 저녁예배는 휴무이며, 9월 17일(주일) 예배는 정상 진행됩니다.',
    is_urgent: true,
    created_at: '2024-09-10T11:00:00Z',
  },
  {
    id: '6',
    title: '성탄절 칸타타 연습 안내',
    content:
      '성탄절 칸타타 연습이 매주 수요일 저녁 7시에 진행됩니다. 성가대원들의 참석 부탁드립니다.',
    is_urgent: false,
    created_at: '2024-11-01T13:00:00Z',
  },
  {
    id: '7',
    title: '겨울 단기선교 참가자 모집',
    content:
      '12월 말 필리핀 단기선교에 참여하실 분들을 모집합니다. 선교의 열정이 있으신 분들의 많은 지원 바랍니다.',
    is_urgent: false,
    created_at: '2024-10-20T15:30:00Z',
  },
  {
    id: '8',
    title: '교회학교 등록 마감 임박',
    content:
      '새학기 교회학교 등록 마감이 이번 주 일요일입니다. 아직 등록하지 않으신 학부모님들은 서둘러 주시기 바랍니다.',
    is_urgent: true,
    created_at: '2024-02-25T10:00:00Z',
  },
  {
    id: '9',
    title: '청년부 수련회 안내',
    content:
      '여름 청년부 수련회가 8월 10일부터 12일까지 강원도에서 진행됩니다. 참가 신청은 교역자실로 해주시기 바랍니다.',
    is_urgent: false,
    created_at: '2024-07-01T12:00:00Z',
  },
  {
    id: '10',
    title: '교회 홈페이지 오픈',
    content:
      '교회 새 홈페이지가 오픈했습니다. 온라인으로도 말씀과 교제를 나누실 수 있습니다.',
    is_urgent: false,
    created_at: '2024-04-15T14:00:00Z',
  },
  {
    id: '11',
    title: '태풍 대비 안전 수칙',
    content:
      '태풍 예보로 인해 이번 주 수요예배가 취소될 수 있습니다. 기상 상황에 따라 교회 홈페이지를 통해 공지하겠습니다.',
    is_urgent: true,
    created_at: '2024-08-20T08:00:00Z',
  },
  {
    id: '12',
    title: '장년부 성경공부 개강',
    content:
      '가을학기 장년부 성경공부가 9월 첫째 주부터 시작됩니다. 말씀으로 무장하는 귀한 시간이 되길 바랍니다.',
    is_urgent: false,
    created_at: '2024-08-25T11:30:00Z',
  },
];

interface GetAnnouncementsParams {
  query?: string;
  page?: number;
  limit?: number;
}

interface GetAnnouncementsResult {
  announcements: Announcement[];
  totalPages: number;
}

export async function getAnnouncements({
  query = '',
  page = 1,
  limit = 10,
}: GetAnnouncementsParams = {}): Promise<GetAnnouncementsResult> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  let filteredAnnouncements = MOCK_ANNOUNCEMENTS;

  if (query) {
    const lowerQuery = query.toLowerCase();
    filteredAnnouncements = MOCK_ANNOUNCEMENTS.filter(
      (announcement) =>
        announcement.title.toLowerCase().includes(lowerQuery) ||
        announcement.content.toLowerCase().includes(lowerQuery),
    );
  }

  const totalPages = Math.ceil(filteredAnnouncements.length / limit);
  const startIdx = (page - 1) * limit;
  const endIdx = startIdx + limit;

  const paginatedAnnouncements = filteredAnnouncements.slice(startIdx, endIdx);

  return {
    announcements: paginatedAnnouncements.map(mapAnnouncement),
    totalPages,
  };
}

export async function getLatestAnnouncement(): Promise<Announcement | null> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const latest = MOCK_ANNOUNCEMENTS[0];
  if (!latest) return null;
  return mapAnnouncement(latest);
}
