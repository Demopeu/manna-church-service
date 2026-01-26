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
    const filesToDelete = images
      .map((img) => {
        try {
          const fileUrl = new URL(img.storage_path);
          // Extract path after /gallery/ in the URL
          const bucketPath = fileUrl.pathname.split('/gallery/')[1];
          return bucketPath ? decodeURIComponent(bucketPath) : null;
        } catch {
          // Fallback for non-URL format
          const fileName = img.storage_path.split('/').pop();
          return fileName || null;
        }
      })
      .filter((path): path is string => path !== null);

    if (filesToDelete.length > 0) {
      const { error: storageError } = await supabase.storage
        .from('gallery')
        .remove(filesToDelete);

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
