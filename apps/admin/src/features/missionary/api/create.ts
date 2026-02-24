import { revalidatePath } from 'next/cache';
import { createClient } from '@repo/database/client';
import { ActionState } from '@/shared/model';
import { CreateMissionaryInput } from '../model/schema';

export async function createMissionary(
  validatedFields: CreateMissionaryInput,
): Promise<ActionState> {
  const supabase = await createClient();

  let imageUrl: string | null = null;

  if (validatedFields.photoFile) {
    const fileName = `${Date.now()}_${crypto.randomUUID()}.webp`;

    const { error: uploadError } = await supabase.storage
      .from('missionaries')
      .upload(fileName, validatedFields.photoFile, {
        upsert: false,
      });

    if (uploadError) {
      console.error('이미지 업로드 실패:', uploadError);
      return {
        success: false,
        message: '이미지 업로드 중 오류가 발생했습니다.',
      };
    }

    const { data } = supabase.storage
      .from('missionaries')
      .getPublicUrl(fileName);
    imageUrl = data.publicUrl;
  }

  const { error } = await supabase.from('missionaries').insert({
    name: validatedFields.name,
    country: validatedFields.country,
    description: validatedFields.description,
    image_url: imageUrl,
  });

  if (error) {
    console.error('선교사 등록 실패:', error);
    return {
      success: false,
      message: '선교사 등록에 실패했습니다.',
    };
  }

  revalidatePath('/missionaries');

  return {
    success: true,
  };
}
