import { cache } from 'react';
import { createClient } from '@repo/database/client';
import type { Missionary } from '../model/missionary';
import { mapMissionary } from './mapper';

interface GetMissionariesParams {
  query?: string;
  page?: number;
  limit?: number;
}

export const getMissionaries = cache(
  async (
    params: GetMissionariesParams = {},
  ): Promise<{ missionaries: Missionary[]; totalPages: number }> => {
    const { query = '', page = 1, limit = 10 } = params;
    const supabase = await createClient();

    let queryBuilder = supabase
      .from('missionaries')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (query) {
      queryBuilder = queryBuilder.or(
        `name.ilike.%${query}%,country.ilike.%${query}%`,
      );
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await queryBuilder.range(from, to);

    if (error) {
      throw new Error(`Failed to fetch missionaries: ${error.message}`);
    }

    const totalPages = count ? Math.ceil(count / limit) : 0;

    return {
      missionaries: (data || []).map(mapMissionary),
      totalPages,
    };
  },
);

export const getMissionaryById = cache(
  async (id: string): Promise<Missionary | null> => {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('missionaries')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch missionary: ${error.message}`);
    }

    return data ? mapMissionary(data) : null;
  },
);
