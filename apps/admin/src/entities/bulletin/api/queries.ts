import { addHours, endOfWeek, startOfWeek, subHours } from 'date-fns';
import { createClient } from '@repo/database/client';
import type { Bulletin } from '../model/bulletin';
import { mapBulletin } from './mapper';

interface GetBulletinsParams {
  query: string;
  page: number;
  pageSize?: number;
}

export async function getBulletins({
  query,
  page,
  pageSize = 10,
}: GetBulletinsParams): Promise<{ bulletins: Bulletin[]; totalPages: number }> {
  const supabase = await createClient();

  let queryBuilder = supabase
    .from('bulletins')
    .select('*', { count: 'exact' })
    .order('published_at', { ascending: false });

  if (query) {
    queryBuilder = queryBuilder.ilike('published_at::text', `%${query}%`);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await queryBuilder.range(from, to);

  if (error) {
    throw new Error(`Failed to fetch bulletins: ${error.message}`);
  }

  const totalPages = count ? Math.ceil(count / pageSize) : 0;

  return {
    bulletins: (data || []).map(mapBulletin),
    totalPages,
  };
}

export async function getThisWeekBulletin(): Promise<Bulletin | null> {
  const supabase = await createClient();
  const nowUtc = new Date();
  const nowKst = addHours(nowUtc, 9);

  const startKst = startOfWeek(nowKst, { weekStartsOn: 0 });
  const endKst = endOfWeek(nowKst, { weekStartsOn: 0 });
  const startUtc = subHours(startKst, 9);
  const endUtc = subHours(endKst, 9);

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
}
