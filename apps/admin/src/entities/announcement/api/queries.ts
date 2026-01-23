import { createClient } from '@repo/database/client';
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
}

export async function getAnnouncements({
  query = '',
  page = 1,
  limit = 10,
}: GetAnnouncementsParams = {}): Promise<GetAnnouncementsResult> {
  const supabase = await createClient();

  let queryBuilder = supabase
    .from('notices')
    .select('*', { count: 'exact' })
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

  const totalPages = count ? Math.ceil(count / limit) : 0;

  return {
    announcements: (data || []).map(mapAnnouncement),
    totalPages,
  };
}

export async function getLatestAnnouncement(): Promise<Announcement | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('notices')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch latest announcement: ${error.message}`);
  }

  return data ? mapAnnouncement(data) : null;
}
