'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@repo/database/client';
import { tryCatchAction, tryCatchVoid } from '@/shared/api';
import { ActionState } from '@/shared/model';
import {
  type CreateBulletinInput,
  createBulletinSchema,
} from '../model/schema';

async function createBulletin(
  validatedFields: CreateBulletinInput,
): Promise<ActionState> {
  const supabase = await createClient();

  // TODO: 실제 구현 - 파일 업로드 및 DB 저장
  const { error } = await supabase.from('bulletins').insert({
    published_at: validatedFields.publishedAt,
    cover_image_url: 'temp_cover_url', // TODO: Storage 업로드
    content_image_urls: [], // TODO: PDF 변환
    original_pdf_url: 'temp_pdf_url', // TODO: Storage 업로드
  });

  if (error) {
    console.error('주보 등록 실패:', error);
    return {
      success: false,
      message: '주보 등록에 실패했습니다.',
    };
  }

  revalidatePath('/bulletins');

  return {
    success: true,
  };
}

async function updateBulletin(
  id: string,
  validatedFields: CreateBulletinInput,
): Promise<ActionState> {
  const supabase = await createClient();

  // TODO: 실제 구현 - 파일 업로드 및 DB 업데이트
  const { error } = await supabase
    .from('bulletins')
    .update({
      published_at: validatedFields.publishedAt,
      // TODO: 파일이 변경된 경우에만 업데이트
    })
    .eq('id', id);

  if (error) {
    console.error('주보 수정 실패:', error);
    return {
      success: false,
      message: '주보 수정에 실패했습니다.',
    };
  }

  revalidatePath('/bulletins');

  return {
    success: true,
  };
}

async function deleteBulletin(id: string): Promise<void> {
  const supabase = await createClient();

  // TODO: Storage에서 파일 삭제 로직 추가
  const { error } = await supabase.from('bulletins').delete().eq('id', id);

  if (error) {
    console.error('주보 삭제 실패:', error);
    throw new Error('주보 삭제에 실패했습니다.');
  }
}

export async function createBulletinAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
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

  return await tryCatchAction(() => createBulletin(validatedFields.data));
}

export async function updateBulletinAction(
  id: string,
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
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

  return await tryCatchAction(() => updateBulletin(id, validatedFields.data));
}

export async function deleteBulletinAction(id: string): Promise<void> {
  await tryCatchVoid(() => deleteBulletin(id));
}
