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
    queryBuilder = queryBuilder.ilike('published_at', `%${query}%`);
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

export async function getLatestBulletin(): Promise<Bulletin | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('bulletins')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch latest bulletin: ${error.message}`);
  }

  return data ? mapBulletin(data) : null;
}
