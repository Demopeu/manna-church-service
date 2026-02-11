'use cache';

import { cache } from 'react';
import { cacheLife, cacheTag } from 'next/cache';
import { createPublicClient } from '@repo/database/client';
import type { Announcement } from '../model/announcement';
import { mapAnnouncement } from './mapper';

interface GetAnnouncementsParams {
  query?: string;
  page?: number;
  limit?: number;
}

interface GetAnnouncementsResult {
  announcements: Announcement[];
  totalPages: number;
  totalCount: number;
}

export const getAnnouncements = cache(
  async ({
    query = '',
    page = 1,
    limit = 10,
  }: GetAnnouncementsParams = {}): Promise<GetAnnouncementsResult> => {
    cacheTag('announcement-list');
    cacheLife('hours');

    const supabase = createPublicClient();

    let queryBuilder = supabase
      .from('notices')
      .select('*', { count: 'exact' })
      .order('is_urgent', { ascending: false })
      .order('created_at', { ascending: false });

    if (query) {
      queryBuilder = queryBuilder.or(
        `title.ilike.%${query}%,content.ilike.%${query}%`,
      );
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await queryBuilder.range(from, to);

    if (error) {
      throw new Error(`Failed to fetch announcements: ${error.message}`);
    }

    const validCount = count ?? 0;

    return {
      announcements: (data || []).map(mapAnnouncement),
      totalPages: Math.ceil(validCount / limit),
      totalCount: validCount,
    };
  },
);

export const getAnnouncementByShortId = cache(
  async (shortId: string): Promise<Announcement | null> => {
    cacheTag(`announcement-${shortId}`);
    cacheLife('days');

    if (!shortId) return null;

    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .eq('short_id', shortId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.warn(`공지사항 ShortID ${shortId}를 찾을 수 없습니다.`);
        return null;
      }

      console.error('공지사항 상세 조회 중 Supabase 에러 발생:', error);
      throw new Error(
        `[공지사항 조회 실패] 서버 응답 오류입니다. (${error.message})`,
      );
    }

    return data ? mapAnnouncement(data) : null;
  },
);

export const getRecentAnnouncements = cache(
  async (): Promise<Announcement[]> => {
    cacheTag('announcement-recent');
    cacheLife('hours');

    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .order('is_urgent', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error(`Failed to fetch recent announcements: ${error.message}`);
      return [];
    }

    return (data || []).map(mapAnnouncement);
  },
);

export const getRecentAnnouncementShortIds = cache(
  async (limit: number = 100): Promise<{ id: string }[]> => {
    cacheTag('announcement-slugs');
    cacheLife('hours');

    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from('notices')
      .select('title, short_id')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch slugs: ${error.message}`);
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
