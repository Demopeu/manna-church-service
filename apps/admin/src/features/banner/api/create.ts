import { revalidatePath } from 'next/cache';
import { captureException } from '@sentry/nextjs';
import { createClient } from '@repo/database/client';

const STORAGE_BUCKET = 'banners';
const MAX_BANNERS = 6;

type CreateBannerResult = { bannerId: string };

export async function createBanner(
  imageFile: File,
  title: string,
): Promise<CreateBannerResult> {
  const supabase = await createClient();

  const { count } = await supabase
    .from('banners')
    .select('*', { count: 'exact', head: true });

  if (count !== null && count >= MAX_BANNERS) {
    throw new Error(`배너는 최대 ${MAX_BANNERS}개까지 등록 가능합니다.`);
  }

  const fileName = `${Date.now()}_${crypto.randomUUID()}.webp`;
  const uploadedPaths: string[] = [];

  try {
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, imageFile, { upsert: false });

    if (uploadError) {
      throw new Error(`이미지 업로드 실패: ${uploadError.message}`);
    }
    uploadedPaths.push(fileName);

    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(fileName);

    const { data: maxData } = await supabase
      .from('banners')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextSortOrder =
      maxData?.sort_order != null ? maxData.sort_order + 1 : 0;

    const { data: insertData, error: insertError } = await supabase
      .from('banners')
      .insert({
        title: title || `배너 ${nextSortOrder + 1}`,
        image_url: urlData.publicUrl,
        sort_order: nextSortOrder,
      })
      .select('id')
      .single();

    if (insertError || !insertData) {
      throw new Error(`배너 DB 등록 실패: ${insertError?.message}`);
    }

    revalidatePath('/setting');
    return { bannerId: insertData.id };
  } catch (error) {
    captureException(error);
    if (uploadedPaths.length > 0) {
      await supabase.storage.from(STORAGE_BUCKET).remove(uploadedPaths);
    }
    throw error;
  }
}
