'use client';

import {
  startTransition,
  useActionState,
  useEffect,
  useEffectEvent,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import { captureException } from '@sentry/nextjs';
import { toast } from 'sonner';
import type { Banner } from '@/entities/banner';
import { imageConverter } from '@/shared/lib';
import { saveBannersBulkAction } from '../api/actions';
import { bannerItemSchema, initialState } from './schema';

interface Params {
  initialBanners: Banner[];
  localBanners: Banner[];
  pendingFiles: Record<string, File>;
  pendingDeleteIds: string[];
}

export function useBannerSave({
  initialBanners,
  localBanners,
  pendingFiles,
  pendingDeleteIds,
}: Params) {
  const router = useRouter();
  const [isConverting, setIsConverting] = useState(false);
  const [saveState, formAction, isPending] = useActionState(
    saveBannersBulkAction,
    initialState,
  );

  const handleError = useEffectEvent((state: typeof saveState) => {
    if (state && !state.success && state.message) {
      toast.error(state.message);
    }
  });

  const handleSuccess = useEffectEvent((state: typeof saveState) => {
    if (state?.success) {
      localBanners
        .filter((b) => pendingFiles[b.id])
        .forEach((b) => URL.revokeObjectURL(b.imageUrl));
      toast.success('설정이 저장되었습니다.');
      router.refresh();
    }
  });

  useEffect(() => {
    handleError(saveState);
    handleSuccess(saveState);
  }, [saveState]);

  const existingBanners = localBanners.filter((b) => !pendingFiles[b.id]);
  const isDirty =
    pendingDeleteIds.length > 0 ||
    Object.keys(pendingFiles).length > 0 ||
    existingBanners.length !== initialBanners.length ||
    existingBanners.some((b, i) => {
      const initial = initialBanners[i];
      return !initial || b.id !== initial.id || b.title !== initial.title;
    });

  const hasInvalidBanner = localBanners.some(
    (b) => !bannerItemSchema.safeParse({ title: b.title }).success,
  );

  const canSave = isDirty && !hasInvalidBanner;

  const handleSave = async () => {
    const formData = new FormData();
    pendingDeleteIds.forEach((id) => formData.append('deleteId', id));

    const newBannerEntries = localBanners.filter((b) => pendingFiles[b.id]);
    const tempIdToIndex: Record<string, number> = {};

    try {
      setIsConverting(true);
      for (let i = 0; i < newBannerEntries.length; i++) {
        const banner = newBannerEntries[i]!;
        const isConverted = await imageConverter({
          formData,
          file: pendingFiles[banner.id]!,
          title: `banner_${Date.now()}`,
          setError: () => {},
          type: 'image-to-webp',
          fieldKey: 'tempImage',
        });
        if (!isConverted) {
          toast.error(
            '이미지 변환에 실패했습니다. 다른 이미지를 사용해주세요.',
          );
          return;
        }
        const converted = formData.get('tempImage');
        if (converted) {
          formData.delete('tempImage');
          formData.append(`newImage-${i}`, converted);
        }
        formData.append(`newTitle-${i}`, banner.title);
        tempIdToIndex[banner.id] = i;
      }
    } catch (error) {
      captureException(error);
      toast.error('이미지 변환 중 오류가 발생했습니다.');
      return;
    } finally {
      setIsConverting(false);
    }

    formData.append('newImageCount', String(newBannerEntries.length));
    localBanners.forEach((banner, index) => {
      const newIdx = tempIdToIndex[banner.id];
      formData.append(
        `order-${index}-id`,
        newIdx !== undefined ? `new-${newIdx}` : banner.id,
      );
      formData.append(`order-${index}-title`, banner.title);
    });
    formData.append('orderCount', String(localBanners.length));

    startTransition(() => {
      formAction(formData);
    });
  };

  return {
    isSaving: isPending || isConverting,
    canSave,
    handleSave,
  };
}
