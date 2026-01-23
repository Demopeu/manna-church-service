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

export async function getEvents({
  query = '',
  page = 1,
  limit = 10,
}: GetEventsParams = {}): Promise<GetEventsResult> {
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
}

export async function getLatestEvent(): Promise<Event | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('start_date', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch latest event: ${error.message}`);
  }

  return data ? mapEvent(data) : null;
}
