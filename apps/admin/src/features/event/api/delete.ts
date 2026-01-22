import { revalidatePath } from 'next/cache';
import { createClient } from '@repo/database/client';

export async function deleteEvent(id: string): Promise<void> {
  const supabase = await createClient();

  const { data: event, error: fetchError } = await supabase
    .from('events')
    .select('photo_url')
    .eq('id', id)
    .single();

  if (fetchError) {
    console.error('삭제할 이벤트 조회 실패:', fetchError);
    throw new Error('이벤트를 찾을 수 없습니다.');
  }

  if (event.photo_url) {
    const fileName = event.photo_url.split('/').pop();

    if (fileName) {
      const { error: storageError } = await supabase.storage
        .from('events')
        .remove([fileName]);

      if (storageError) {
        console.error('이미지 삭제 실패 (DB 삭제는 진행함):', storageError);
      }
    }
  }

  const { error: deleteError } = await supabase
    .from('events')
    .delete()
    .eq('id', id);

  if (deleteError) {
    console.error('이벤트 데이터 삭제 실패:', deleteError);
    throw new Error('이벤트 삭제에 실패했습니다.');
  }

  revalidatePath('/events');
}
