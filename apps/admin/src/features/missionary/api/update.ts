import { revalidatePath } from 'next/cache';
import { createClient } from '@repo/database/client';
import { ActionState } from '@/shared/model';
import { UpdateMissionaryInput } from '../model/schema';

export async function updateMissionary(
  id: string,
  validatedFields: UpdateMissionaryInput,
): Promise<ActionState> {
  const supabase = await createClient();

  const updateData: {
    name: string;
    country: string;
    description?: string;
    image_url?: string;
  } = {
    name: validatedFields.name,
    country: validatedFields.country,
    description: validatedFields.description,
  };

  if (validatedFields.photoFile) {
    const { data: oldMissionary } = await supabase
      .from('missionaries')
      .select('image_url')
      .eq('id', id)
      .single();

    if (oldMissionary?.image_url) {
      const oldFileName = oldMissionary.image_url.split('/').pop();
      if (oldFileName) {
        await supabase.storage.from('missionaries').remove([oldFileName]);
      }
    }

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
    updateData.image_url = data.publicUrl;
  }

  const { error } = await supabase
    .from('missionaries')
    .update(updateData)
    .eq('id', id);

  if (error) {
    console.error('선교사 수정 실패:', error);
    return {
      success: false,
      message: '선교사 수정에 실패했습니다.',
    };
  }

  revalidatePath('/missionaries');

  return {
    success: true,
  };
}
