'use server';

import { revalidatePath } from 'next/cache';
import { ActionState } from '@/shared/model';
import { createBulletinSchema } from './schema';

export async function createBulletinAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const coverImageFile = formData.get('coverImageFile') as File | null;
  const pdfFile = formData.get('pdfFile') as File | null;

  const rawData = {
    publishedAt: formData.get('publishedAt'),
    coverImageFile: coverImageFile,
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
    coverImageFileName: validatedFields.data.coverImageFile.name,
    coverImageFileSize: validatedFields.data.coverImageFile.size,
    pdfFileName: validatedFields.data.pdfFile.name,
    pdfFileSize: validatedFields.data.pdfFile.size,
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

  const coverImageFile = formData.get('coverImageFile') as File | null;
  const pdfFile = formData.get('pdfFile') as File | null;

  const rawData = {
    publishedAt: formData.get('publishedAt'),
    coverImageFile: coverImageFile,
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
    coverImageFileName: validatedFields.data.coverImageFile.name,
    pdfFileName: validatedFields.data.pdfFile.name,
  });

  revalidatePath('/bulletins');

  return {
    success: true,
    message: '주보가 수정되었습니다.',
  };
}
