import { revalidatePath } from 'next/cache';
import * as Sentry from '@sentry/nextjs';
import { createClient } from '@repo/database/client';
import { ActionState } from '@/shared/model';
import {
  extractBucketPath,
  extractBucketPaths,
} from '../lib/parse-storage-url';
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

    if (validatedFields.imageFiles && validatedFields.imageFiles.length > 0) {
      if (
        existingBulletin.image_urls &&
        existingBulletin.image_urls.length > 0
      ) {
        const oldPaths = extractBucketPaths(
          existingBulletin.image_urls,
          'pages',
        );
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

    if (validatedFields.coverImageFile === null) {
      if (existingBulletin.cover_image_url) {
        const path = extractBucketPath(
          existingBulletin.cover_image_url,
          'covers',
        );
        if (path) {
          pathsToDelete.push(path);
        }
      }
      newCoverImageUrl = null;
    } else if (validatedFields.coverImageFile instanceof File) {
      if (existingBulletin.cover_image_url) {
        const path = extractBucketPath(
          existingBulletin.cover_image_url,
          'covers',
        );
        if (path) {
          pathsToDelete.push(path);
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
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove(pathsToDelete);
      if (error) {
        console.error('❌ Storage 삭제 실패:', error);
      } else {
        console.log('✅ Storage 삭제 성공:', data);
      }
    }

    revalidatePath('/bulletins');
    return { success: true };
  } catch (error) {
    Sentry.captureException(error);
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
