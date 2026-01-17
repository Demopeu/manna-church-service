import { mapEvent } from '../lib/mapper';
import type { Event } from '../model/event';
import type { EventDto } from './dto';

const MOCK_EVENTS: EventDto[] = [
  {
    id: '1',
    title: '2024 부활절 연합예배',
    description:
      '주님의 부활을 기념하는 연합예배에 모든 성도님들을 초대합니다. 함께 주님의 부활을 찬양하며 기쁨을 나누는 시간이 되길 바랍니다.',
    photo_url: '/DEFAULT_BULLETIN.png',
    start_date: '2024-03-31',
    created_at: '2024-03-15T10:00:00Z',
  },
  {
    id: '2',
    title: '청년부 여름수련회',
    description:
      '청년들을 위한 여름수련회를 개최합니다. 말씀과 찬양, 교제를 통해 은혜롭게 하나님을 만나는 시간이 되길 소망합니다.',
    photo_url: '/DEFAULT_BULLETIN.png',
    start_date: '2024-08-10',
    created_at: '2024-07-20T14:30:00Z',
  },
  {
    id: '3',
    title: '가을 선교 축제',
    description:
      '세계 선교를 위한 특별 축제를 진행합니다. 선교사님들의 간증과 함께 하나님의 나라 확장을 위해 기도하는 시간을 갖습니다.',
    photo_url: '/DEFAULT_BULLETIN.png',
    start_date: '2024-10-15',
    created_at: '2024-09-30T16:00:00Z',
  },
  {
    id: '4',
    title: '성탄절 특별 예배',
    description:
      '예수님의 탄생을 기념하는 성탄절 특별 예배입니다. 온 가족이 함께 모여 주님의 오심을 축하하고 감사하는 시간이 되길 바랍니다.',
    photo_url: '/DEFAULT_BULLETIN.png',
    start_date: '2024-12-25',
    created_at: '2024-12-01T09:00:00Z',
  },
  {
    id: '5',
    title: '새해맞이 기도회',
    description:
      '새로운 한 해를 주님께 맡기는 특별 기도회를 진행합니다. 한 해의 시작을 기도로 준비하며 하나님의 인도하심을 구합니다.',
    photo_url: '/DEFAULT_BULLETIN.png',
    start_date: '2025-01-01',
    created_at: '2024-12-20T11:00:00Z',
  },
  {
    id: '6',
    title: '사순절 금식기도',
    description:
      '주님의 고난을 묵상하며 사순절 기간 동안 금식기도를 진행합니다. 함께 기도하며 주님의 십자가 사랑을 깊이 경험하길 바랍니다.',
    photo_url: '/DEFAULT_BULLETIN.png',
    start_date: '2025-02-26',
    created_at: '2025-02-10T08:00:00Z',
  },
  {
    id: '7',
    title: '어린이 성경학교',
    description:
      '여름방학을 맞이하여 어린이들을 위한 성경학교를 진행합니다. 재미있는 프로그램과 함께 성경을 배우는 귀한 시간이 될 것입니다.',
    photo_url: '/DEFAULT_BULLETIN.png',
    start_date: '2025-07-28',
    created_at: '2025-07-01T13:00:00Z',
  },
  {
    id: '8',
    title: '장년부 성지순례',
    description:
      '이스라엘 성지순례를 떠납니다. 성경의 현장을 직접 체험하며 믿음을 더욱 견고히 하는 은혜로운 여행이 되길 기대합니다.',
    photo_url: '/DEFAULT_BULLETIN.png',
    start_date: '2025-09-15',
    created_at: '2025-08-15T15:00:00Z',
  },
  {
    id: '9',
    title: '추수감사절 예배',
    description:
      '한 해 동안 베푸신 하나님의 은혜에 감사드리는 추수감사절 예배입니다. 함께 감사의 찬양과 고백을 드립니다.',
    photo_url: '/DEFAULT_BULLETIN.png',
    start_date: '2025-11-23',
    created_at: '2025-11-01T10:30:00Z',
  },
  {
    id: '10',
    title: '성가대 정기연주회',
    description:
      '성가대의 정기연주회를 개최합니다. 아름다운 찬양으로 하나님을 찬양하고 성도님들과 은혜를 나누는 시간이 될 것입니다.',
    photo_url: '/DEFAULT_BULLETIN.png',
    start_date: '2025-05-18',
    created_at: '2025-05-01T12:00:00Z',
  },
  {
    id: '11',
    title: '청소년 겨울캠프',
    description:
      '겨울방학을 맞아 청소년들을 위한 캠프를 진행합니다. 말씀과 찬양, 다양한 액티비티를 통해 하나님과 친구들을 만나는 시간입니다.',
    photo_url: '/DEFAULT_BULLETIN.png',
    start_date: '2026-01-20',
    created_at: '2025-12-28T14:00:00Z',
  },
  {
    id: '12',
    title: '부부 힐링 세미나',
    description:
      '결혼한 부부들을 위한 특별 세미나를 개최합니다. 말씀을 통해 건강한 부부관계를 세워가는 귀한 시간이 되길 바랍니다.',
    photo_url: '/DEFAULT_BULLETIN.png',
    start_date: '2026-02-14',
    created_at: '2026-01-30T16:30:00Z',
  },
];

interface GetEventsParams {
  query?: string;
  page?: number;
  limit?: number;
}

interface GetEventsResult {
  events: Event[];
  totalPages: number;
}

export async function getEvents({
  query = '',
  page = 1,
  limit = 10,
}: GetEventsParams = {}): Promise<GetEventsResult> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  let filteredEvents = MOCK_EVENTS;

  if (query) {
    const lowerQuery = query.toLowerCase();
    filteredEvents = MOCK_EVENTS.filter(
      (event) =>
        event.title.toLowerCase().includes(lowerQuery) ||
        event.description.toLowerCase().includes(lowerQuery),
    );
  }

  const totalPages = Math.ceil(filteredEvents.length / limit);
  const startIdx = (page - 1) * limit;
  const endIdx = startIdx + limit;

  const paginatedEvents = filteredEvents.slice(startIdx, endIdx);

  return {
    events: paginatedEvents.map(mapEvent),
    totalPages,
  };
}

export async function getLatestEvent(): Promise<Event | null> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const latest = MOCK_EVENTS[0];
  if (!latest) return null;
  return mapEvent(latest);
}
