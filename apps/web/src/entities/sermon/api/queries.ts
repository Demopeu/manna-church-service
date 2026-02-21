'use cache';

import { cache } from 'react';
import { cacheLife, cacheTag } from 'next/cache';
import { createPublicClient } from '@repo/database/client';
import type { Sermon } from '../model/sermon';
import { mapSermon } from './mapper';

interface GetSermonsParams {
  query?: string;
  page?: number;
  limit?: number;
}

interface GetSermonsResult {
  sermons: Sermon[];
  totalPages: number;
  totalCount: number;
}

export const getSermons = cache(
  async ({
    query = '',
    page = 1,
    limit = 10,
  }: GetSermonsParams = {}): Promise<GetSermonsResult> => {
    cacheTag('sermon-list');
    cacheLife('hours');

    const supabase = createPublicClient();

    let queryBuilder = supabase
      .from('sermons')
      .select('*', { count: 'exact' })
      .order('preached_at', { ascending: false });

    if (query) {
      const sanitizedQuery = query.replace(/[,.()]/g, '');
      queryBuilder = queryBuilder.or(
        `title.ilike.%${sanitizedQuery}%,preacher.ilike.%${sanitizedQuery}%`,
      );
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await queryBuilder.range(from, to);

    if (error) {
      throw new Error(`Failed to fetch sermons: ${error.message}`);
    }

    const validCount = count ?? 0;

    return {
      sermons: (data || []).map(mapSermon),
      totalPages: Math.ceil(validCount / limit),
      totalCount: validCount,
    };
  },
);

export const getLatestSermon = cache(async (): Promise<Sermon | null> => {
  const supabase = createPublicClient();

  cacheTag('sermon-latest');
  cacheLife('hours');

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
});
