import { revalidatePath } from 'next/cache';
import { createClient } from '@repo/database/client';
import { ActionState } from '@/shared/model';
import { CreateServantInput } from '../model/schema';

export async function createServant(
  validatedFields: CreateServantInput,
): Promise<ActionState> {
  const supabase = await createClient();

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

  const { error } = await supabase.from('members').insert({
    name: validatedFields.name,
    role: validatedFields.role,
    photo_url: data.publicUrl,
    contact: validatedFields.contact,
    introduction: validatedFields.introduction,
    is_public: validatedFields.isPublic,
    sort_order: validatedFields.sortOrder,
  });

  if (error) {
    console.error('섬기는 사람 등록 실패:', error);
    return {
      success: false,
      message: '섬기는 사람 등록에 실패했습니다.',
    };
  }

  revalidatePath('/servants');

  return {
    success: true,
  };
}
