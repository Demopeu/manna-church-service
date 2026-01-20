'use server';

import { createClient } from '@repo/database/client';
import type { Sermon } from '../model/sermon';
import { mapSermon } from './mapper';

interface GetSermonsParams {
  query: string;
  page: number;
  pageSize?: number;
}

export async function getSermons({
  query,
  page,
  pageSize = 10,
}: GetSermonsParams): Promise<{ sermons: Sermon[]; totalPages: number }> {
  const supabase = await createClient();

  let queryBuilder = supabase
    .from('sermons')
    .select('*', { count: 'exact' })
    .order('preached_at', { ascending: false });

  if (query) {
    queryBuilder = queryBuilder.or(
      `title.ilike.%${query}%,preacher.ilike.%${query}%`,
    );
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await queryBuilder.range(from, to);

  if (error) {
    throw new Error(`Failed to fetch sermons: ${error.message}`);
  }

  const totalPages = count ? Math.ceil(count / pageSize) : 0;

  return {
    sermons: (data || []).map(mapSermon),
    totalPages,
  };
}

export async function getLatestSermon(): Promise<Sermon | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('sermons')
    .select('*')
    .order('preached_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch latest sermon: ${error.message}`);
  }

  return data ? mapSermon(data) : null;
}
