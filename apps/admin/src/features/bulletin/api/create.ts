import { revalidatePath } from 'next/cache';
import { captureException } from '@sentry/nextjs';
import { createClient } from '@repo/database/client';
import { ActionState } from '@/shared/model';
import { type CreateBulletinActionInput } from '../model/schema';

export async function createBulletin(
  validatedFields: CreateBulletinActionInput,
): Promise<ActionState> {
  const supabase = await createClient();
  const BUCKET_NAME = 'bulletins';
  const uploadedPaths: string[] = [];

  try {
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

    let coverImageUrl: string | null = null;
    const coverFile = validatedFields.coverImageFile;

    if (coverFile && coverFile.size > 0) {
      const fileName = `covers/${Date.now()}_${crypto.randomUUID()}.webp`;

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, coverFile, { upsert: false });

      if (error) throw error;

      uploadedPaths.push(data.path);
      coverImageUrl = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName)
        .data.publicUrl;
    }

    const { error: insertError } = await supabase.from('bulletins').insert({
      published_at: validatedFields.publishedAt,
      image_urls: imageUrls,
      cover_image_url: coverImageUrl,
      original_pdf_url: null,
    });

    if (insertError) throw insertError;

    revalidatePath('/bulletins');
    return { success: true };
  } catch (error) {
    captureException(error);
    if (uploadedPaths.length > 0) {
      console.log('🗑️ 에러 발생으로 인한 파일 롤백 시작...');
      await supabase.storage.from(BUCKET_NAME).remove(uploadedPaths);
    }
    throw error;
  }
}
