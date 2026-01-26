import { revalidatePath } from 'next/cache';
import { createClient } from '@repo/database/client';
import { ActionState } from '@/shared/model';
import { UpdateGalleryInput } from '../model/schema';

export async function updateGallery(
  id: string,
  validatedFields: UpdateGalleryInput,
): Promise<ActionState> {
  const supabase = await createClient();

  const newlyUploadedPaths: string[] = [];

  try {
    const { data: existingImages, error: fetchError } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('gallery_id', id);

    if (fetchError) {
      throw new Error('기존 갤러리 정보를 불러오는 데 실패했습니다.');
    }

    const keepImageIds = new Set(validatedFields.keepImageIds || []);
    const imagesToDelete = (existingImages || []).filter(
      (img) => !keepImageIds.has(img.id),
    );

    if (imagesToDelete.length > 0) {
      const deleteIds = imagesToDelete.map((img) => img.id);
      const { error: deleteDbError } = await supabase
        .from('gallery_images')
        .delete()
        .in('id', deleteIds);

      if (deleteDbError) {
        throw new Error('이미지 삭제(DB) 중 오류가 발생했습니다.');
      }

      const pathsToDelete = imagesToDelete
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

      if (pathsToDelete.length > 0) {
        const { error: storageRemoveError } = await supabase.storage
          .from('gallery')
          .remove(pathsToDelete);

        if (storageRemoveError) {
          console.error(
            '스토리지 이미지 삭제 실패(고아 파일 발생 가능):',
            storageRemoveError,
          );
        }
      }
    }

    let uploadedImages: {
      url: string;
      fileName: string;
      isThumbnail: boolean;
    }[] = [];

    if (validatedFields.images && validatedFields.images.length > 0) {
      const uploadPromises = validatedFields.images.map(async (imageData) => {
        const fileName = `${Date.now()}_${crypto.randomUUID()}.webp`;

        const { error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(fileName, imageData.file, { upsert: false });

        if (uploadError) {
          throw new Error(`이미지 업로드 실패: ${fileName}`);
        }

        newlyUploadedPaths.push(fileName);

        const { data } = supabase.storage
          .from('gallery')
          .getPublicUrl(fileName);

        return {
          url: data.publicUrl,
          fileName,
          isThumbnail: imageData.isThumbnail,
        };
      });

      uploadedImages = await Promise.all(uploadPromises);

      const imageRows = uploadedImages.map((img) => ({
        gallery_id: id,
        storage_path: img.url,
        width: 0,
        height: 0,
      }));

      const { error: imagesInsertError } = await supabase
        .from('gallery_images')
        .insert(imageRows);

      if (imagesInsertError) {
        throw new Error('새 이미지를 DB에 저장하는 데 실패했습니다.');
      }
    }

    const { data: allCurrentImages } = await supabase
      .from('gallery_images')
      .select('storage_path')
      .eq('gallery_id', id)
      .order('created_at', { ascending: true });
    const safeImages = allCurrentImages ?? [];
    let thumbnailUrl: string | undefined;
    const targetIndex = validatedFields.thumbnailIndex;
    if (targetIndex !== undefined && safeImages[targetIndex]) {
      thumbnailUrl = safeImages[targetIndex].storage_path;
    } else if (safeImages.length > 0) {
      thumbnailUrl = safeImages[0]?.storage_path;
    }

    const updateData: {
      title: string;
      event_date: string;
      thumbnail_url?: string;
    } = {
      title: validatedFields.title,
      event_date: validatedFields.eventDate,
    };
    if (thumbnailUrl) {
      updateData.thumbnail_url = thumbnailUrl;
    }

    const { error: updateGalleryError } = await supabase
      .from('galleries')
      .update(updateData)
      .eq('id', id);

    if (updateGalleryError) {
      throw new Error('갤러리 정보를 수정하는 데 실패했습니다.');
    }

    revalidatePath('/gallery');

    return { success: true };
  } catch (error) {
    console.error('갤러리 수정 중 오류 발생:', error);

    if (newlyUploadedPaths.length > 0) {
      console.warn(
        '에러 발생으로 인한 신규 업로드 파일 롤백:',
        newlyUploadedPaths,
      );
      await supabase.storage.from('gallery').remove(newlyUploadedPaths);
    }

    throw error;
  }
}
