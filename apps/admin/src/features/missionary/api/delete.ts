import { revalidatePath } from 'next/cache';
import { createClient } from '@repo/database/client';

export async function deleteMissionary(id: string): Promise<void> {
  const supabase = await createClient();

  const { data: missionary, error: fetchError } = await supabase
    .from('missionaries')
    .select('image_url')
    .eq('id', id)
    .single();

  if (fetchError) {
    console.error('선교사 조회 실패:', fetchError);
    throw new Error('선교사를 찾을 수 없습니다.');
  }

  if (missionary?.image_url) {
    const fileName = missionary.image_url.split('/').pop();
    if (fileName) {
      const { error: storageError } = await supabase.storage
        .from('missionaries')
        .remove([fileName]);

      if (storageError) {
        console.error('이미지 삭제 실패 (DB 삭제는 진행함):', storageError);
      }
    }
  }

  const { error } = await supabase
    .from('missionaries')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('선교사 삭제 실패:', error);
    throw new Error('선교사 삭제에 실패했습니다.');
  }

  revalidatePath('/missionaries');
}
