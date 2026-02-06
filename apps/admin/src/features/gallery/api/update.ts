import { revalidatePath } from 'next/cache';
import { captureException } from '@sentry/nextjs';
import { createClient } from '@repo/database/client';
import { ActionState } from '@/shared/model';
import { UpdateGalleryInput } from '../model/schema';

interface UploadResult {
  url: string;
  fileName: string;
  isThumbnail: boolean;
}

export async function updateGallery(
  validatedFields: UpdateGalleryInput,
): Promise<ActionState> {
  const supabase = await createClient();
  const newlyUploadedPaths: string[] = [];

  try {
    const { data: existingImages, error: fetchError } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('gallery_id', validatedFields.id);

    if (fetchError || !existingImages) {
      throw new Error('기존 갤러리 정보를 불러오는 데 실패했습니다.');
    }
    const survivingIds = new Set(
      validatedFields.images
        .filter((img) => !img.file && img.id)
        .map((img) => img.id!),
    );

    const imagesToDelete = existingImages.filter(
      (img) => !survivingIds.has(img.id),
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
            const bucketPath = fileUrl.pathname.split('/gallery/')[1];
            return bucketPath ? decodeURIComponent(bucketPath) : null;
          } catch (error) {
            captureException(error);
            return null;
          }
        })
        .filter((path): path is string => path !== null);

      if (pathsToDelete.length > 0) {
        const { error: storageRemoveError } = await supabase.storage
          .from('gallery')
          .remove(pathsToDelete);

        if (storageRemoveError) {
          console.error('스토리지 파일 삭제 실패:', storageRemoveError);
        }
      }
    }

    const newFiles = validatedFields.images.filter(
      (img): img is typeof img & { file: File } => img.file !== null,
    );

    const uploadedResults: UploadResult[] = [];

    if (newFiles.length > 0) {
      const uploadPromises = newFiles.map(
        async (imageData): Promise<UploadResult> => {
          const fileName = `${Date.now()}_${crypto.randomUUID()}.webp`;

          const { error: uploadError } = await supabase.storage
            .from('gallery')
            .upload(fileName, imageData.file, { upsert: false });

          if (uploadError) {
            throw new Error(`이미지 업로드 실패: ${fileName}`);
          }

          const { data: urlData } = supabase.storage
            .from('gallery')
            .getPublicUrl(fileName);

          return {
            url: urlData.publicUrl,
            fileName,
            isThumbnail: imageData.isThumbnail,
          };
        },
      );

      const results = await Promise.allSettled(uploadPromises);

      for (const result of results) {
        if (result.status === 'fulfilled') {
          uploadedResults.push(result.value);
          newlyUploadedPaths.push(result.value.fileName);
        } else {
          throw new Error('일부 이미지 업로드 실패');
        }
      }

      const imageRows = uploadedResults.map((img) => ({
        gallery_id: validatedFields.id,
        storage_path: img.url,
        width: 0,
        height: 0,
      }));

      const { error: insertError } = await supabase
        .from('gallery_images')
        .insert(imageRows);

      if (insertError) {
        throw new Error('새 이미지를 DB에 저장하는 데 실패했습니다.');
      }
    }

    let finalThumbnailUrl = '';
    const thumbnailItem = validatedFields.images.find((img) => img.isThumbnail);

    if (thumbnailItem) {
      if (thumbnailItem.file) {
        const target = uploadedResults.find((r) => r.isThumbnail);
        finalThumbnailUrl = target ? target.url : '';
      } else if (thumbnailItem.id) {
        const target = existingImages.find(
          (img) => img.id === thumbnailItem.id,
        );
        finalThumbnailUrl = target ? target.storage_path : '';
      }
    }

    if (!finalThumbnailUrl) {
      const deleteIdSet = new Set(imagesToDelete.map((img) => img.id));

      const survivor = existingImages.find((img) => !deleteIdSet.has(img.id));

      if (survivor) {
        finalThumbnailUrl = survivor.storage_path;
      }

      if (!finalThumbnailUrl && uploadedResults.length > 0) {
        const firstNewImage = uploadedResults[0];
        if (firstNewImage) {
          finalThumbnailUrl = firstNewImage.url;
        }
      }
    }

    const { error: updateGalleryError } = await supabase
      .from('galleries')
      .update({
        title: validatedFields.title,
        event_date: validatedFields.eventDate,
        thumbnail_url: finalThumbnailUrl,
      })
      .eq('id', validatedFields.id);

    if (updateGalleryError) {
      throw new Error('갤러리 정보를 수정하는 데 실패했습니다.');
    }

    revalidatePath('/gallery');
    return { success: true };
  } catch (error) {
    captureException(error);
    console.error('갤러리 수정 중 오류 발생:', error);

    if (newlyUploadedPaths.length > 0) {
      console.warn('롤백 진행:', newlyUploadedPaths);
      await supabase.storage.from('gallery').remove(newlyUploadedPaths);
    }

    throw error;
  }
}
