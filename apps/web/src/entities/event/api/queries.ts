import { cache } from 'react';
import { createClient } from '@repo/database/client';
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
}

export const getEvents = cache(
  async ({
    query = '',
    page = 1,
    limit = 10,
  }: GetEventsParams = {}): Promise<GetEventsResult> => {
    const supabase = await createClient();

    let queryBuilder = supabase
      .from('events')
      .select('*', { count: 'exact' })
      .order('start_date', { ascending: false });

    if (query) {
      queryBuilder = queryBuilder.or(
        `title.ilike.%${query}%,description.ilike.%${query}%`,
      );
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await queryBuilder.range(from, to);

    if (error) {
      throw new Error(`Failed to fetch events: ${error.message}`);
    }

    const totalPages = count ? Math.ceil(count / limit) : 0;

    return {
      events: (data || []).map(mapEvent),
      totalPages,
    };
  },
);

export const getRecentEvents = cache(async (): Promise<Event[]> => {
  const supabase = await createClient();

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
