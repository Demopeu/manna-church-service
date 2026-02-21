import { revalidatePath } from 'next/cache';
import { createClient } from '@repo/database/client';

const STORAGE_BUCKET = 'banners';

export async function deleteBanner(id: string): Promise<void> {
  const supabase = await createClient();

  const { data: banner, error: fetchError } = await supabase
    .from('banners')
    .select('image_url')
    .eq('id', id)
    .single();

  if (fetchError) {
    throw new Error('배너를 찾을 수 없습니다.');
  }

  const { error: deleteError } = await supabase
    .from('banners')
    .delete()
    .eq('id', id);

  if (deleteError) {
    throw new Error(`배너 삭제 실패: ${deleteError.message}`);
  }

  if (banner?.image_url) {
    try {
      const fileUrl = new URL(banner.image_url);
      const bucketPath = fileUrl.pathname.split(`/${STORAGE_BUCKET}/`)[1];
      const filePath = bucketPath ? decodeURIComponent(bucketPath) : null;

      if (filePath) {
        await supabase.storage.from(STORAGE_BUCKET).remove([filePath]);
      }
    } catch {
      console.error('스토리지 경로 파싱 실패 (DB 삭제는 완료)');
    }
  }

  revalidatePath('/setting');
}
