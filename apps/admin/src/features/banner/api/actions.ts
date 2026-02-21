'use server';

import { captureException } from '@sentry/nextjs';
import { tryCatchVoid } from '@/shared/api';
import { requireAuth } from '@/shared/lib';
import type { ActionState } from '@/shared/model';
import { createBannerActionSchema } from '../model/schema';
import { saveBannersBulk } from './bulk-save';
import { createBanner } from './create';
import { deleteBanner } from './delete';
import { updateBannerSettings } from './update';

type CreateBannerResult = ActionState & { bannerId?: string };

export async function createBannerAction(
  formData: FormData,
): Promise<CreateBannerResult> {
  const authState = await requireAuth();
  if (authState) return authState;

  const validated = createBannerActionSchema.safeParse({
    imageFile: formData.get('imageFile'),
    title: formData.get('title') ?? '',
  });

  if (!validated.success) {
    return {
      success: false,
      message:
        validated.error.issues[0]?.message ?? '입력 내용을 확인해주세요.',
    };
  }

  try {
    const { bannerId } = await createBanner(
      validated.data.imageFile,
      validated.data.title,
    );
    return { success: true, bannerId };
  } catch (error) {
    captureException(error);
    return {
      success: false,
      message: '배너 추가에 실패했습니다. 잠시 후 다시 시도해주세요.',
    };
  }
}

export async function deleteBannerAction(id: string): Promise<void> {
  await requireAuth(true);
  await tryCatchVoid(() => deleteBanner(id));
}

export async function updateBannerSettingsAction(
  updates: Array<{ id: string; title: string; sortOrder: number }>,
): Promise<ActionState> {
  const authState = await requireAuth();
  if (authState) return authState;

  try {
    await updateBannerSettings(updates);
    return { success: true };
  } catch (error) {
    captureException(error);
    return {
      success: false,
      message: '설정 저장에 실패했습니다. 잠시 후 다시 시도해주세요.',
    };
  }
}

export async function saveBannersBulkAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const authState = await requireAuth();
  if (authState) return authState;

  try {
    await saveBannersBulk(formData);
    return { success: true };
  } catch (error) {
    captureException(error);
    return {
      success: false,
      message: '설정 저장에 실패했습니다. 잠시 후 다시 시도해주세요.',
    };
  }
}
