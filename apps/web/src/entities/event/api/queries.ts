'use cache';

import { cache } from 'react';
import { cacheLife, cacheTag } from 'next/cache';
import { createPublicClient } from '@repo/database/client';
import type { Event } from '../model/event';
import { mapEvent } from './mapper';

interface GetEventsParams {
  query?: string;
  page?: number;
  limit?: number;
}

interface GetEventsResult {
  events: Event[];
  totalPages: number;
  totalCount: number;
}

export const getEvents = cache(
  async ({
    query = '',
    page = 1,
    limit = 10,
  }: GetEventsParams = {}): Promise<GetEventsResult> => {
    cacheTag('event-list');
    cacheLife('hours');

    const supabase = createPublicClient();

    let queryBuilder = supabase
      .from('events')
      .select('*', { count: 'exact' })
      .order('start_date', { ascending: false });

    if (query) {
      const sanitizedQuery = query.replace(/[,.()]/g, '');
      queryBuilder = queryBuilder.or(
        `title.ilike.%${sanitizedQuery}%,description.ilike.%${sanitizedQuery}%`,
      );
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await queryBuilder.range(from, to);

    if (error) {
      throw new Error(`Failed to fetch events: ${error.message}`);
    }

    const validCount = count ?? 0;

    return {
      events: (data || []).map(mapEvent),
      totalPages: Math.ceil(validCount / limit),
      totalCount: validCount,
    };
  },
);

export const getEventByShortId = cache(
  async (shortId: string): Promise<Event | null> => {
    cacheTag(`event-${shortId}`);
    cacheLife('days');

    if (!shortId) return null;

    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('short_id', shortId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.warn(`이벤트 ShortID ${shortId}를 찾을 수 없습니다.`);
        return null;
      }

      console.error('이벤트 상세 조회 중 Supabase 에러 발생:', error);
      throw new Error(
        `[이벤트 조회 실패] 서버 응답 오류입니다. (${error.message})`,
      );
    }

    return data ? mapEvent(data) : null;
  },
);

export const getRecentEventShortIds = cache(
  async (limit: number = 20): Promise<{ id: string }[]> => {
    cacheTag('event-slugs');
    cacheLife('hours');

    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from('events')
      .select('title, short_id')
      .order('start_date', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch event slugs: ${error.message}`);
    }

    return (data || []).map((item) => {
      const safeTitle = item.title
        .replace(/\s+/g, '-')
        .replace(/[^\wㄱ-ㅎ가-힣-]/g, '');

      return {
        id: `${safeTitle}-${item.short_id}`,
      };
    });
  },
);

export const getRecentEvents = cache(async (): Promise<Event[]> => {
  cacheTag('event-recent');
  cacheLife('hours');

  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('start_date', { ascending: false })
    .limit(5);

  if (error) {
    console.error(`Failed to fetch recent events: ${error.message}`);
    return [];
  }

  return (data || []).map(mapEvent);
});
