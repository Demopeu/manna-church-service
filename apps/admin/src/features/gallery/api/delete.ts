import { revalidatePath } from 'next/cache';
import { createClient } from '@repo/database/client';

export async function deleteGallery(id: string): Promise<void> {
  const supabase = await createClient();

  const { data: images, error: fetchError } = await supabase
    .from('gallery_images')
    .select('storage_path')
    .eq('gallery_id', id);

  if (fetchError) {
    console.error('삭제할 갤러리 이미지 조회 실패:', fetchError);
    throw new Error('갤러리를 찾을 수 없습니다.');
  }

  if (images && images.length > 0) {
    const fileNames = images
      .map((img) => img.storage_path.split('/').pop())
      .filter((name): name is string => !!name);

    if (fileNames.length > 0) {
      const { error: storageError } = await supabase.storage
        .from('gallery')
        .remove(fileNames);

      if (storageError) {
        console.error('이미지 삭제 실패 (DB 삭제는 진행함):', storageError);
      }
    }
  }

  const { error: deleteImagesError } = await supabase
    .from('gallery_images')
    .delete()
    .eq('gallery_id', id);

  if (deleteImagesError) {
    console.error('갤러리 이미지 데이터 삭제 실패:', deleteImagesError);
    throw new Error('갤러리 이미지 삭제에 실패했습니다.');
  }

  const { error: deleteError } = await supabase
    .from('galleries')
    .delete()
    .eq('id', id);

  if (deleteError) {
    console.error('갤러리 데이터 삭제 실패:', deleteError);
    throw new Error('갤러리 삭제에 실패했습니다.');
  }

  revalidatePath('/gallery');
}
