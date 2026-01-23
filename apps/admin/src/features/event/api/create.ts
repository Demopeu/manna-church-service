import { revalidatePath } from 'next/cache';
import { createClient } from '@repo/database/client';
import { ActionState } from '@/shared/model';
import { CreateEventInput } from '../model/schema';

export async function createEvent(
  validatedFields: CreateEventInput,
): Promise<ActionState> {
  const supabase = await createClient();

  let finalPhotoUrl = '';
  const photoFile = validatedFields.photoFile;

  if (photoFile && photoFile.size > 0) {
    const fileName = `${Date.now()}_${crypto.randomUUID()}.webp`;

    const { error: uploadError } = await supabase.storage
      .from('events')
      .upload(fileName, photoFile, {
        upsert: false,
      });

    if (uploadError) {
      console.error('이미지 업로드 실패:', uploadError);
      return {
        success: false,
        message: '이미지 업로드 중 오류가 발생했습니다.',
      };
    }
    const { data } = supabase.storage.from('events').getPublicUrl(fileName);

    finalPhotoUrl = data.publicUrl;
  }

  const { error: insertError } = await supabase.from('events').insert({
    title: validatedFields.title,
    description: validatedFields.description,
    start_date: validatedFields.startDate,
    photo_url: finalPhotoUrl,
  });

  if (insertError) {
    console.error('이벤트 등록 실패:', insertError);
    return {
      success: false,
      message: '이벤트 정보를 저장하는 데 실패했습니다.',
    };
  }

  revalidatePath('/events');

  return {
    success: true,
  };
}
