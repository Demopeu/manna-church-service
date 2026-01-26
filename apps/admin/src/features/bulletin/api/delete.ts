import { revalidatePath } from 'next/cache';
import { createClient } from '@repo/database/client';

export async function deleteBulletin(id: string): Promise<void> {
  const supabase = await createClient();
  const BUCKET_NAME = 'bulletins';

  const { data: bulletin, error: fetchError } = await supabase
    .from('bulletins')
    .select('image_urls, cover_image_url')
    .eq('id', id)
    .single();

  if (fetchError) {
    throw new Error('주보를 찾을 수 없습니다.');
  }

  const filesToDelete: string[] = [];

  if (bulletin.image_urls && bulletin.image_urls.length > 0) {
    const imageFileNames = bulletin.image_urls
      .map((url: string) => url.split('/').pop())
      .filter((fileName): fileName is string => Boolean(fileName))
      .map((fileName: string) => `pages/${fileName}`);

    filesToDelete.push(...imageFileNames);
  }

  if (bulletin.cover_image_url) {
    const coverFileName = bulletin.cover_image_url.split('/').pop();
    if (coverFileName) {
      filesToDelete.push(`covers/${coverFileName}`);
    }
  }

  if (filesToDelete.length > 0) {
    await supabase.storage.from(BUCKET_NAME).remove(filesToDelete);
  }

  const { error: deleteError } = await supabase
    .from('bulletins')
    .delete()
    .eq('id', id);

  if (deleteError) {
    throw new Error('주보 삭제에 실패했습니다.');
  }

  revalidatePath('/bulletins');
}
