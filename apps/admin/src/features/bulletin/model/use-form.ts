'use client';

import {
  startTransition,
  useActionState,
  useEffect,
  useEffectEvent,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Bulletin } from '@/entities/bulletin';
import {
  imageConverter,
  pdfToWebpConverter,
  useImageInput,
  usePdfInput,
  useToastAndRefresh,
} from '@/shared/lib';
import { createBulletinAction, updateBulletinAction } from '../api/actions';
import { getDefaultValues, toFormData } from './mapper';
import {
  type CreateBulletinInput,
  type UpdateBulletinInput,
  createBulletinSchema,
  initialState,
  updateBulletinSchema,
} from './schema';

interface Params {
  bulletin?: Bulletin;
  onSuccess?: () => void;
  successMessage: string;
}

export function useBulletinForm({
  bulletin,
  onSuccess,
  successMessage,
}: Params) {
  const { complete, errorToast } = useToastAndRefresh(onSuccess);
  const MODE = bulletin ? 'EDIT' : 'CREATE';

  const actionFn =
    MODE === 'EDIT'
      ? updateBulletinAction.bind(null, bulletin!.id)
      : createBulletinAction;

  const [state, action, isPending] = useActionState(actionFn, initialState);
  const [isConverting, setIsConverting] = useState(false);
  const form = useForm({
    resolver: zodResolver(
      MODE === 'EDIT' ? updateBulletinSchema : createBulletinSchema,
    ),
    defaultValues: getDefaultValues(bulletin),
    mode: 'onChange',
  });

  const hasChanges = MODE === 'CREATE' || form.formState.isDirty;

  const hasExistingPdf =
    !!bulletin?.originalPdfUrl ||
    (bulletin?.imageUrls && bulletin.imageUrls.length > 0);

  const handlePdfChange = (file: File | null) => {
    form.setValue('pdfFile', file, {
      shouldValidate: true,
      shouldDirty: true,
    });
    if (!file) {
      if (!hasExistingPdf) {
        form.setError('pdfFile', {
          type: 'required',
          message: 'PDF 파일은 필수입니다.',
        });
      }
    } else {
      form.clearErrors('pdfFile');
    }
  };

  const pdfInput = usePdfInput({
    initialFileName: hasExistingPdf ? '기존 등록된 주보 (변환됨)' : undefined,
    onFileChange: handlePdfChange,
  });

  const handleCoverImageChange = (file: File | null | string) => {
    form.setValue('coverImageFile', file, {
      shouldValidate: true,
      shouldDirty: true,
    });

    if (!file || file === 'null') {
      form.clearErrors('coverImageFile');
    }
  };

  const coverImageInput = useImageInput({
    initialUrl: bulletin?.coverImageUrl || undefined,
    onFileChange: handleCoverImageChange,
  });

  const handleError = useEffectEvent((currentState: typeof state) => {
    if (currentState && !currentState.success) {
      if (currentState.message) {
        form.setError('root', {
          type: 'server',
          message: currentState.message,
        });
      }
      if (currentState.fieldErrors) {
        Object.entries(currentState.fieldErrors).forEach(
          ([field, messages]) => {
            if (messages && messages[0]) {
              form.setError(
                field as keyof CreateBulletinInput | keyof UpdateBulletinInput,
                {
                  type: 'server',
                  message: messages[0],
                },
              );
            }
          },
        );
      }
    }
  });

  const handleSuccess = useEffectEvent((currentState: typeof state) => {
    if (currentState?.success) {
      complete(successMessage);
    }
  });

  useEffect(() => {
    handleError(state);
    handleSuccess(state);
  }, [state]);

  const handleSubmit = form.handleSubmit(async (data) => {
    const formData = toFormData(data);
    if (data.coverImageFile === null) {
      formData.set('coverImageFile', 'null');
    } else if (data.coverImageFile === undefined) {
      formData.delete('coverImageFile');
    }
    try {
      setIsConverting(true);
      const isCoverSuccess = await imageConverter({
        formData,
        file: coverImageInput.rawFile || undefined,
        title: data.coverImageFile?.name || '',
        setError: form.setError,
        type: 'image-to-webp',
        fieldKey: 'coverImageFile',
      });
      if (!isCoverSuccess) return;
      if (data.pdfFile instanceof File) {
        const baseName = data.pdfFile.name.split('.')[0];
        const webpBlobs = await pdfToWebpConverter(data.pdfFile);
        webpBlobs.forEach((blob, index) => {
          const fileName = `${baseName}_page_${index + 1}.webp`;
          formData.append('imageFiles', blob, fileName);
        });
        formData.delete('pdfFile');
      }
    } catch (error) {
      errorToast('이미지 변환 에러');
      console.error('이미지 변환 에러:', error);
      return;
    } finally {
      setIsConverting(false);
    }

    startTransition(() => {
      action(formData);
    });
  });

  return {
    form,
    status: {
      mode: MODE,
      isPending: isPending || isConverting,
      hasChanges,
    },
    handler: {
      submit: handleSubmit,
    },
    pdfFile: pdfInput,
    coverImageFile: coverImageInput,
  };
}
