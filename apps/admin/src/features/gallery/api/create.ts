import { revalidatePath } from 'next/cache';
import { createClient } from '@repo/database/client';
import { ActionState } from '@/shared/model';
import { CreateGalleryInput } from '../model/schema';

export async function createGallery(
  validatedFields: CreateGalleryInput,
): Promise<ActionState> {
  const supabase = await createClient();

  const uploadedPaths: string[] = [];
  try {
    const uploadPromises = validatedFields.images.map(async (imageData) => {
      const fileName = `${Date.now()}_${crypto.randomUUID()}.webp`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(fileName, imageData.file!, {
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`이미지 업로드 실패: ${fileName}`);
      }
      uploadedPaths.push(fileName);

      const { data } = supabase.storage.from('gallery').getPublicUrl(fileName);

      return {
        url: data.publicUrl,
        fileName,
        isThumbnail: imageData.isThumbnail,
      };
    });
    const results = await Promise.allSettled(uploadPromises);
    const failed = results.filter((r) => r.status === 'rejected');
    if (failed.length > 0) {
      throw new Error('일부 이미지 업로드 실패');
    }

    const uploadedImages = results
      .filter((r) => r.status === 'fulfilled')
      .map((r) => r.value);

    const thumbnailUrl =
      uploadedImages.find((img) => img.isThumbnail)?.url ||
      uploadedImages[0]?.url ||
      '';

    const { data: gallery, error: insertError } = await supabase
      .from('galleries')
      .insert({
        title: validatedFields.title,
        event_date: validatedFields.eventDate,
        thumbnail_url: thumbnailUrl,
      })
      .select()
      .single();

    if (insertError || !gallery) {
      console.error('갤러리 insert 에러:', insertError);
      throw new Error('갤러리 정보를 저장하는 데 실패했습니다.');
    }

    const imageRows = uploadedImages.map((img) => ({
      gallery_id: gallery.id,
      storage_path: img.url,
      width: 0,
      height: 0,
    }));

    const { error: imagesError } = await supabase
      .from('gallery_images')
      .insert(imageRows);

    if (imagesError) {
      console.error('갤러리 이미지 insert 에러:', imagesError);
      throw new Error('갤러리 이미지를 저장하는 데 실패했습니다.');
    }

    revalidatePath('/gallery');

    return {
      success: true,
    };
  } catch (error) {
    if (uploadedPaths.length > 0) {
      console.warn(
        '에러 발생으로 인한 업로드 파일 롤백(삭제) 진행:',
        uploadedPaths,
      );

      const { error: removeError } = await supabase.storage
        .from('gallery')
        .remove(uploadedPaths);

      if (removeError) {
        console.error('파일 롤백 실패 (수동 확인 필요):', removeError);
      } else {
        console.log('파일 롤백 완료');
      }
    }

    throw error;
  }
}
