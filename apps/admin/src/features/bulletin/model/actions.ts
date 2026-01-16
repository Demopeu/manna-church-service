'use server';

import { createBulletinSchema } from './schema';
import { ActionState } from '@/shared/model';
import { revalidatePath } from 'next/cache';

export async function createBulletinAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const pdfFile = formData.get('pdfFile') as File | null;

  const rawData = {
    publishedAt: formData.get('publishedAt'),
    pdfFile: pdfFile,
  };

  const validatedFields = createBulletinSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: '입력 내용을 확인해주세요.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  console.log('✅ 주보 등록 서버 액션 성공:', {
    publishedAt: validatedFields.data.publishedAt,
    fileName: validatedFields.data.pdfFile.name,
    fileSize: validatedFields.data.pdfFile.size,
  });

  return {
    success: true,
    message: '주보가 성공적으로 등록되었습니다.',
  };
}

export async function updateBulletinAction(
  id: string,
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const pdfFile = formData.get('pdfFile') as File | null;

  const rawData = {
    publishedAt: formData.get('publishedAt'),
    pdfFile: pdfFile,
  };

  const validatedFields = createBulletinSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: '입력 내용을 확인해주세요.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  console.log(`📝 주보 수정 완료 (${id}):`, {
    publishedAt: validatedFields.data.publishedAt,
    fileName: validatedFields.data.pdfFile.name,
  });

  revalidatePath('/bulletins');

  return {
    success: true,
    message: '주보가 수정되었습니다.',
  };
}
