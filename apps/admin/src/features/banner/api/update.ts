import { revalidatePath } from 'next/cache';
import { createClient } from '@repo/database/client';

export async function updateBannerSettings(
  updates: Array<{ id: string; title: string; sortOrder: number }>,
): Promise<void> {
  const supabase = await createClient();

  await Promise.all(
    updates.map(({ id, title, sortOrder }) =>
      supabase
        .from('banners')
        .update({ title, sort_order: sortOrder })
        .eq('id', id),
    ),
  );

  revalidatePath('/setting');
}
