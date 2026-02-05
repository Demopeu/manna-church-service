import { cache } from 'react';
import { addHours, endOfDay, setDay, startOfDay, subHours } from 'date-fns';
import { createClient } from '@repo/database/client';
import type { Bulletin } from '../model/bulletin';
import { mapBulletin } from './mapper';

interface GetBulletinsParams {
  year: number;
  month: number;
  page: number;
  pageSize?: number;
}

export const getBulletins = cache(
  async ({ year, month, page, pageSize = 10 }: GetBulletinsParams) => {
    const supabase = await createClient();

    let queryBuilder = supabase
      .from('bulletins')
      .select('*', { count: 'exact' })
      .order('published_at', { ascending: false });

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

    const { data, error, count } = await queryBuilder.range(from, to);

    if (error) {
      console.error('주보 목록 조회 중 Supabase 에러 발생:', error);
      throw new Error(
        `[주보 목록 로딩 실패] 서버 응답 오류입니다. (${error.message})`,
      );
    }

    const totalPages = count ? Math.ceil(count / pageSize) : 0;

    return {
      bulletins: (data || []).map(mapBulletin),
      totalPages,
    };
  },
);

export const getThisWeekBulletin = cache(async (): Promise<Bulletin | null> => {
  const supabase = await createClient();

  // 1. 현재 한국 시간 계산
  const nowUtc = new Date();
  const nowKst = addHours(nowUtc, 9); // 한국 시간 기준

  // 2. "이번 주 일요일" 계산 (핵심)
  // setDay(날짜, 0, { weekStartsOn: 1 })
  // -> 월요일(1)을 한 주의 시작으로 보고, 이번 주의 일요일(0)을 찾습니다.
  // 예: 2월 5일(목) -> 2월 8일(일) 반환
  // 예: 2월 1일(일) -> 2월 1일(일) 반환 (일요일 당일이면 당일 주보)
  const targetSundayKst = setDay(nowKst, 0, { weekStartsOn: 1 });

  // 3. 검색 범위 설정 (일요일 00:00:00 ~ 23:59:59 KST)
  // 주 전체를 검색하지 않고, 딱 주보가 발행되는 "일요일 하루"만 타겟팅합니다.
  const startOfSundayKst = startOfDay(targetSundayKst);
  const endOfSundayKst = endOfDay(targetSundayKst);

  // 4. DB 검색을 위해 UTC로 변환
  const startUtc = subHours(startOfSundayKst, 9);
  const endUtc = subHours(endOfSundayKst, 9);

  const { data, error } = await supabase
    .from('bulletins')
    .select('*')
    .gte('published_at', startUtc.toISOString())
    .lte('published_at', endUtc.toISOString())
    .order('published_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(
      `이번 주 주보를 불러오는 데 실패했습니다: ${error.message}`,
    );
  }

  return data ? mapBulletin(data) : null;
});
