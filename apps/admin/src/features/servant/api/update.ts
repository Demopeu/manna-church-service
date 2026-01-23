import { revalidatePath } from 'next/cache';
import { createClient } from '@repo/database/client';
import { ActionState } from '@/shared/model';
import { UpdateServantInput } from '../model/schema';

export async function updateServant(
  id: string,
  validatedFields: UpdateServantInput,
): Promise<ActionState> {
  const supabase = await createClient();

  const updateData: {
    name: string;
    role: string;
    contact?: string;
    introduction?: string;
    is_public: boolean;
    sort_order: number;
    photo_url?: string;
  } = {
    name: validatedFields.name,
    role: validatedFields.role,
    contact: validatedFields.contact,
    introduction: validatedFields.introduction,
    is_public: validatedFields.isPublic,
    sort_order: validatedFields.sortOrder,
  };

  if (validatedFields.photoFile) {
    const { data: oldServant } = await supabase
      .from('members')
      .select('photo_url')
      .eq('id', id)
      .single();

    if (oldServant?.photo_url) {
      const oldFileName = oldServant.photo_url.split('/').pop();
      if (oldFileName) {
        await supabase.storage.from('members').remove([oldFileName]);
      }
    }

    const fileName = `${Date.now()}_${crypto.randomUUID()}.webp`;

    const { error: uploadError } = await supabase.storage
      .from('members')
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

    const { data } = supabase.storage.from('members').getPublicUrl(fileName);
    updateData.photo_url = data.publicUrl;
  }

  const { error } = await supabase
    .from('members')
    .update(updateData)
    .eq('id', id);

  if (error) {
    console.error('섬기는 사람 수정 실패:', error);
    return {
      success: false,
      message: '섬기는 사람 수정에 실패했습니다.',
    };
  }

  revalidatePath('/servants');

  return {
    success: true,
  };
}
