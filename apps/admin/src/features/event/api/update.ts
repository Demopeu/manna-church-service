import { revalidatePath } from 'next/cache';
import { createClient } from '@repo/database/client';
import { ActionState } from '@/shared/model';
import { UpdateEventInput } from '../model/schema';

export async function updateEvent(
  id: string,
  validatedFields: UpdateEventInput,
): Promise<ActionState> {
  const supabase = await createClient();

  let photoUrl: string | undefined;

  if (validatedFields.photoFile && validatedFields.photoFile.size > 0) {
    const { data: existingEvent } = await supabase
      .from('events')
      .select('photo_url')
      .eq('id', id)
      .single();

    if (existingEvent?.photo_url) {
      const oldFileName = existingEvent.photo_url.split('/').pop();
      if (oldFileName) {
        await supabase.storage.from('events').remove([oldFileName]);
      }
    }

    const fileName = `${Date.now()}_${crypto.randomUUID()}.webp`;

    const { error: uploadError } = await supabase.storage
      .from('events')
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

    const { data } = supabase.storage.from('events').getPublicUrl(fileName);
    photoUrl = data.publicUrl;
  }

  const updateData: {
    title: string;
    description: string | null;
    start_date: string;
    photo_url?: string;
  } = {
    title: validatedFields.title,
    description: validatedFields.description || null,
    start_date: validatedFields.startDate,
  };

  if (photoUrl) {
    updateData.photo_url = photoUrl;
  }

  const { error } = await supabase
    .from('events')
    .update(updateData)
    .eq('id', id);

  if (error) {
    console.error('이벤트 수정 실패:', error);
    return {
      success: false,
      message: '이벤트 수정에 실패했습니다.',
    };
  }

  revalidatePath('/events');

  return {
    success: true,
  };
}
