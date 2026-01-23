import { revalidatePath } from 'next/cache';
import { createClient } from '@repo/database/client';

export async function deleteServant(id: string): Promise<void> {
  const supabase = await createClient();

  const { data: servant, error: fetchError } = await supabase
    .from('members')
    .select('photo_url')
    .eq('id', id)
    .single();

  if (fetchError) {
    console.error('섬기는 사람 조회 실패:', fetchError);
    throw new Error('섬기는 사람을 찾을 수 없습니다.');
  }

  if (servant?.photo_url) {
    const fileName = servant.photo_url.split('/').pop();
    if (fileName) {
      const { error: storageError } = await supabase.storage
        .from('members')
        .remove([fileName]);

      if (storageError) {
        console.error('이미지 삭제 실패 (DB 삭제는 진행함):', storageError);
      }
    }
  }

  const { error } = await supabase.from('members').delete().eq('id', id);

  if (error) {
    console.error('섬기는 사람 삭제 실패:', error);
    throw new Error('섬기는 사람 삭제에 실패했습니다.');
  }

  revalidatePath('/servants');
}
