import { revalidatePath } from 'next/cache';
import { createClient } from '@repo/database/client';
import { ActionState } from '@/shared/model';
import { UpdateBulletinInput } from '../model/schema';

export async function updateBulletin(
  id: string,
  validatedFields: UpdateBulletinInput,
): Promise<ActionState> {
  const supabase = await createClient();
  const BUCKET_NAME = 'bulletins';

  const uploadedPaths: string[] = [];
  const pathsToDelete: string[] = [];

  try {
    const { data: existingBulletin } = await supabase
      .from('bulletins')
      .select('image_urls, cover_image_url')
      .eq('id', id)
      .single();

    if (!existingBulletin) {
      return { success: false, message: '주보를 찾을 수 없습니다.' };
    }

    let newImageUrls: string[] | undefined;
    let newCoverImageUrl: string | null | undefined;

    // Debug logging
    console.log('🔍 validatedFields:', {
      coverImageFile: validatedFields.coverImageFile,
      imageFiles: validatedFields.imageFiles?.length || 0,
      publishedAt: validatedFields.publishedAt,
    });
    console.log('🔍 existingBulletin:', {
      cover_image_url: existingBulletin.cover_image_url,
      image_urls_count: existingBulletin.image_urls?.length || 0,
    });

    if (validatedFields.imageFiles && validatedFields.imageFiles.length > 0) {
      if (
        existingBulletin.image_urls &&
        existingBulletin.image_urls.length > 0
      ) {
        const oldPaths = existingBulletin.image_urls
          .map((url: string) => {
            try {
              const fileUrl = new URL(url);
              const bucketPath = fileUrl.pathname.split('/bulletins/')[1];
              return bucketPath ? decodeURIComponent(bucketPath) : null;
            } catch {
              const fileName = url.split('/').pop();
              return fileName ? `pages/${fileName}` : null;
            }
          })
          .filter((path): path is string => path !== null);

        pathsToDelete.push(...oldPaths);
      }

      const imageUrls: string[] = [];
      const uploadPromises = validatedFields.imageFiles.map(
        async (file, index) => {
          const fileName = `pages/${Date.now()}_${crypto.randomUUID()}_page_${index}.webp`;

          const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileName, file, { upsert: false });

          if (error) throw error;

          return {
            path: data.path,
            url: supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName).data
              .publicUrl,
          };
        },
      );

      const results = await Promise.all(uploadPromises);
      results.forEach((r) => {
        uploadedPaths.push(r.path);
        imageUrls.push(r.url);
      });

      newImageUrls = imageUrls;
    }

    console.log('🔍 커버 이미지 처리 시작');
    console.log('📝 coverImageFile 값:', validatedFields.coverImageFile);
    console.log(
      '📝 coverImageFile === null:',
      validatedFields.coverImageFile === null,
    );
    console.log(
      '📝 coverImageFile instanceof File:',
      validatedFields.coverImageFile instanceof File,
    );

    if (validatedFields.coverImageFile === null) {
      // null = 삭제 신호
      console.log('✅ 커버 이미지 삭제 조건 충족 (null)');
      if (existingBulletin.cover_image_url) {
        console.log(
          '✅ 기존 커버 이미지 URL 존재:',
          existingBulletin.cover_image_url,
        );
        console.log(
          '🗑️ 커버 이미지 삭제 시도:',
          existingBulletin.cover_image_url,
        );
        try {
          const fileUrl = new URL(existingBulletin.cover_image_url);
          // Extract path after /bulletins/ in the URL
          const bucketPath = fileUrl.pathname.split('/bulletins/')[1];
          if (bucketPath) {
            const decodedPath = decodeURIComponent(bucketPath);
            console.log('📁 추출된 삭제 경로:', decodedPath);
            pathsToDelete.push(decodedPath);
          } else {
            console.log('❌ bucketPath 추출 실패 - URL:', fileUrl.pathname);
          }
        } catch (error) {
          console.log('⚠️ URL 파싱 실패, 폴백 사용:', error);
          const fileName = existingBulletin.cover_image_url.split('/').pop();
          if (fileName) {
            const fallbackPath = `covers/${fileName}`;
            console.log('📁 폴백 삭제 경로:', fallbackPath);
            pathsToDelete.push(fallbackPath);
          }
        }
      }
      newCoverImageUrl = null;
    } else if (validatedFields.coverImageFile === undefined) {
      // undefined = 변경 없음 신호 (기존 이미지 유지)
      console.log('📌 커버 이미지 변경 없음 (undefined) - 기존 이미지 유지');
    } else if (validatedFields.coverImageFile instanceof File) {
      if (existingBulletin.cover_image_url) {
        try {
          const fileUrl = new URL(existingBulletin.cover_image_url);
          const bucketPath = fileUrl.pathname.split('/bulletins/')[1];
          if (bucketPath) {
            pathsToDelete.push(decodeURIComponent(bucketPath));
          }
        } catch {
          const fileName = existingBulletin.cover_image_url.split('/').pop();
          if (fileName) {
            pathsToDelete.push(`covers/${fileName}`);
          }
        }
      }

      const fileName = `covers/${Date.now()}_${crypto.randomUUID()}.webp`;
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, validatedFields.coverImageFile, { upsert: false });

      if (error) throw error;

      uploadedPaths.push(data.path);
      newCoverImageUrl = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName).data.publicUrl;
    }

    const updateData: {
      published_at: string;
      image_urls?: string[];
      cover_image_url?: string | null;
    } = {
      published_at: validatedFields.publishedAt,
    };

    if (newImageUrls) {
      updateData.image_urls = newImageUrls;
    }

    if (newCoverImageUrl !== undefined) {
      updateData.cover_image_url = newCoverImageUrl;
    }

    const { error } = await supabase
      .from('bulletins')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;

    if (pathsToDelete.length > 0) {
      console.log('🗑️ 삭제할 파일 목록:', pathsToDelete);
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove(pathsToDelete);
      if (error) {
        console.error('❌ Storage 삭제 실패:', error);
        console.log('📋 삭제 시도한 경로들:', pathsToDelete);
      } else {
        console.log('✅ Storage 삭제 성공:', data);
      }
    } else {
      console.log('📝 삭제할 파일이 없음');
    }

    revalidatePath('/bulletins');
    return { success: true };
  } catch (error) {
    if (uploadedPaths.length > 0) {
      await supabase.storage.from(BUCKET_NAME).remove(uploadedPaths);
    }

    console.error('주보 수정 실패:', error);
    return {
      success: false,
      message: '주보 수정 중 오류가 발생했습니다.',
    };
  }
}
