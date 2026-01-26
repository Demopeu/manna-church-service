'use server';

import { tryCatchAction, tryCatchVoid } from '@/shared/api';
import { requireAuth } from '@/shared/lib';
import { ActionState } from '@/shared/model';
import {
  createBulletinActionSchema,
  updateBulletinSchema,
} from '../model/schema';
import { createBulletin } from './create';
import { deleteBulletin } from './delete';
import { updateBulletin } from './update';

export async function createBulletinAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const authState = await requireAuth();
  if (authState) {
    return authState;
  }

  const rawData = {
    publishedAt: formData.get('publishedAt'),
    coverImageFile: formData.get('coverImageFile'),
    imageFiles: formData.getAll('imageFiles'),
    pdfFile: formData.get('pdfFile'),
  };

  console.log('rawData', rawData);

  const validatedFields = createBulletinActionSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: '입력 내용을 확인해주세요.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  return await tryCatchAction(() => createBulletin(validatedFields.data));
}

export async function updateBulletinAction(
  id: string,
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const authState = await requireAuth();
  if (authState) {
    return authState;
  }
  const rawCover = formData.get('coverImageFile');
  const coverImageFile =
    rawCover === 'null'
      ? null
      : rawCover instanceof File
        ? rawCover
        : undefined;
  const pdfFile = formData.get('pdfFile') as File | null;
  const imageFiles = formData.getAll('imageFiles') as File[];

  const rawData = {
    publishedAt: formData.get('publishedAt'),
    coverImageFile: coverImageFile,
    pdfFile: pdfFile,
    imageFiles: imageFiles.length > 0 ? imageFiles : undefined,
  };

  const validatedFields = updateBulletinSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: '입력 내용을 확인해주세요.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  return await tryCatchAction(() => updateBulletin(id, validatedFields.data));
}

export async function deleteBulletinAction(id: string): Promise<void> {
  await requireAuth(true);
  await tryCatchVoid(() => deleteBulletin(id));
}
