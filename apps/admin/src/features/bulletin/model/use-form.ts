'use client';

import {
  startTransition,
  useActionState,
  useEffect,
  useEffectEvent,
} from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Bulletin } from '@/entities/bulletin';
import { useImageInput, usePdfInput, useToastAndRefresh } from '@/shared/lib';
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
  const { complete } = useToastAndRefresh(onSuccess);
  const MODE = bulletin ? 'EDIT' : 'CREATE';

  const actionFn =
    MODE === 'EDIT'
      ? updateBulletinAction.bind(null, bulletin!.id)
      : createBulletinAction;

  const [state, action, isPending] = useActionState(actionFn, initialState);

  const form = useForm({
    resolver: zodResolver(
      MODE === 'EDIT' ? updateBulletinSchema : createBulletinSchema,
    ),
    defaultValues: getDefaultValues(bulletin),
    mode: 'onChange',
  });

  const hasChanges = MODE === 'CREATE' || form.formState.isDirty;

  const handlePdfChange = (file: File | null) => {
    form.setValue('pdfFile', file as File, {
      shouldValidate: true,
      shouldDirty: true,
    });
    if (!file) {
      form.clearErrors('pdfFile');
    }
  };

  const pdfInput = usePdfInput({
    initialFileName: bulletin?.originalPdfUrl ? '기존 PDF 파일' : undefined,
    onFileChange: handlePdfChange,
  });

  const handleCoverImageChange = (file: File | null) => {
    form.setValue('coverImageFile', file, {
      shouldValidate: true,
      shouldDirty: true,
    });

    if (!file) {
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

  const handleSubmit = form.handleSubmit((data) => {
    startTransition(() => {
      action(toFormData(data));
    });
  });

  return {
    form,
    status: {
      isPending,
      hasChanges,
    },
    handler: {
      submit: handleSubmit,
    },
    pdfFile: pdfInput,
    coverImageFile: coverImageInput,
  };
}
