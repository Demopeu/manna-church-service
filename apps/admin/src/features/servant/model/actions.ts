'use server';

import { revalidatePath } from 'next/cache';
import { ActionState } from '@/shared/model';
import { createServantSchema } from './schema';

export async function createServantAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await new Promise((resolve) => setTimeout(resolve, 500));

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

  console.log('✅ 섬기는 사람 등록 서버 액션 성공:', {
    name: validatedFields.data.name,
    role: validatedFields.data.role,
    photoFileName: validatedFields.data.photoFile.name,
    photoFileSize: validatedFields.data.photoFile.size,
    contact: validatedFields.data.contact,
    introduction: validatedFields.data.introduction,
    isPublic: validatedFields.data.isPublic,
    sortOrder: validatedFields.data.sortOrder,
  });

  revalidatePath('/servants');

  return {
    success: true,
    message: '섬기는 사람이 성공적으로 등록되었습니다.',
  };
}

export async function updateServantAction(
  id: string,
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await new Promise((resolve) => setTimeout(resolve, 500));

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

  console.log(`📝 섬기는 사람 수정 완료 (${id}):`, {
    name: validatedFields.data.name,
    role: validatedFields.data.role,
    photoFileName: validatedFields.data.photoFile.name,
  });

  revalidatePath('/servants');

  return {
    success: true,
    message: '섬기는 사람 정보가 수정되었습니다.',
  };
}

export async function deleteServantAction(id: string): Promise<ActionState> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  console.log(`🗑️ 섬기는 사람 삭제 (${id})`);

  revalidatePath('/servants');

  return {
    success: true,
    message: '섬기는 사람이 삭제되었습니다.',
  };
}
