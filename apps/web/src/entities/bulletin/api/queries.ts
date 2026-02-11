'use cache';

import { cache } from 'react';
import { cacheLife, cacheTag } from 'next/cache';
import { createPublicClient } from '@repo/database/client';
import type { Bulletin } from '../model/bulletin';
import { mapBulletin } from './mapper';

interface GetBulletinsParams {
  year: number;
  month: number;
  page: number;
  pageSize?: number;
}

export const getBulletins = cache(
  async ({ year, month, page, pageSize = 8 }: GetBulletinsParams) => {
    cacheTag('bulletin-list');
    cacheLife('hours');

    const supabase = createPublicClient();

    let queryBuilder = supabase
      .from('bulletins')
      .select('*', { count: 'exact' });

    if (year > 0 && month > 0) {
      const startDate = new Date(year, month - 1, 1).toISOString();
      const endDate = new Date(year, month, 1).toISOString();

      queryBuilder = queryBuilder
        .gte('published_at', startDate)
        .lt('published_at', endDate);
    } else if (year > 0) {
      const startDate = new Date(year, 0, 1).toISOString();
      const endDate = new Date(year + 1, 0, 1).toISOString();

      queryBuilder = queryBuilder
        .gte('published_at', startDate)
        .lt('published_at', endDate);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await queryBuilder
      .order('published_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('주보 목록 조회 중 Supabase 에러 발생:', error);
      throw new Error(
        `[주보 목록 로딩 실패] 서버 응답 오류입니다. (${error.message})`,
      );
    }

    const validCount = count ?? 0;
    const totalPages = Math.ceil(validCount / pageSize);

    return {
      bulletins: (data || []).map(mapBulletin),
      totalPages,
      totalCount: validCount,
    };
  },
);

export const getBulletinByDate = cache(
  async (dateString: string): Promise<Bulletin | null> => {
    cacheTag(`bulletin-${dateString}`);
    cacheLife('hours');
    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from('bulletins')
      .select('*')
      .eq('published_at', dateString)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            `[getBulletinByDate] 해당 날짜의 주보가 없습니다: ${dateString}`,
          );
        }
        return null;
      }

      console.error('주보 상세 조회 중 Supabase 에러 발생:', error);
      throw new Error(
        `[주보 조회 실패] 서버 응답 오류입니다. (${error.message})`,
      );
    }

    return data ? mapBulletin(data) : null;
  },
);

export const getRecentBulletinDates = cache(
  async (limit: number = 20): Promise<{ date: string }[]> => {
    cacheTag('bulletin-dates');
    cacheLife('hours');

    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from('bulletins')
      .select('published_at')
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('주보 날짜 목록 조회 실패:', error);
      throw new Error(`주보 날짜 로딩 실패: ${error.message}`);
    }

    return (data || []).map((item) => ({
      date: item.published_at.substring(0, 10),
    }));
  },
);
