'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@repo/database/client';
import { tryCatchAction, tryCatchVoid } from '@/shared/api';
import { ActionState } from '@/shared/model';
import { type CreateServantInput, createServantSchema } from '../model/schema';

async function createServant(
  validatedFields: CreateServantInput,
): Promise<ActionState> {
  const supabase = await createClient();

  // TODO: 실제 구현 - 파일 업로드 및 DB 저장
  const { error } = await supabase.from('members').insert({
    name: validatedFields.name,
    role: validatedFields.role,
    photo_url: 'temp_photo_url', // TODO: Storage 업로드
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

async function updateServant(
  id: string,
  validatedFields: CreateServantInput,
): Promise<ActionState> {
  const supabase = await createClient();

  // TODO: 실제 구현
  const { error } = await supabase
    .from('members')
    .update({
      name: validatedFields.name,
      role: validatedFields.role,
      contact: validatedFields.contact,
      introduction: validatedFields.introduction,
      is_public: validatedFields.isPublic,
      sort_order: validatedFields.sortOrder,
    })
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

async function deleteServant(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('members').delete().eq('id', id);

  if (error) {
    console.error('섬기는 사람 삭제 실패:', error);
    throw new Error('섬기는 사람 삭제에 실패했습니다.');
  }
}

export async function createServantAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const photoFile = formData.get('photoFile') as File | null;

  const rawData = {
    name: formData.get('name'),
    role: formData.get('role'),
    photoFile: photoFile,
    contact: formData.get('contact') || undefined,
    introduction: formData.get('introduction') || undefined,
    isPublic: formData.get('isPublic') === 'true',
    sortOrder: Number(formData.get('sortOrder')),
  };

  const validatedFields = createServantSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: '입력 내용을 확인해주세요.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  return await tryCatchAction(() => createServant(validatedFields.data));
}

export async function updateServantAction(
  id: string,
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const photoFile = formData.get('photoFile') as File | null;

  const rawData = {
    name: formData.get('name'),
    role: formData.get('role'),
    photoFile: photoFile,
    contact: formData.get('contact') || undefined,
    introduction: formData.get('introduction') || undefined,
    isPublic: formData.get('isPublic') === 'true',
    sortOrder: Number(formData.get('sortOrder')),
  };

  const validatedFields = createServantSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: '입력 내용을 확인해주세요.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  return await tryCatchAction(() => updateServant(id, validatedFields.data));
}

export async function deleteServantAction(id: string): Promise<void> {
  await tryCatchVoid(() => deleteServant(id));
}
