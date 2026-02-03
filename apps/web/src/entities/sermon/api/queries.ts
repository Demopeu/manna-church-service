import { cache } from 'react';
import { createClient } from '@repo/database/client';
import type { Sermon } from '../model/sermon';
import { mapSermon } from './mapper';

export const getLatestSermon = cache(async (): Promise<Sermon | null> => {
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
});
