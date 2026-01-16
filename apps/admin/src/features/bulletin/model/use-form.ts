'use client';

import { useState, useActionState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createBulletinAction, updateBulletinAction } from './actions';
import { initialState } from './schema';
import { Bulletin } from '@/entities/bulletin';
import { getDefaultValues } from '../lib/mapper';
import { FORM_TEXT } from '../config/form';
import { validatePdfFile } from '../lib/validate-pdf';
import type React from 'react';

interface Params {
  bulletin?: Bulletin;
  onSuccess?: () => void;
}

export function useBulletinForm({ bulletin, onSuccess }: Params) {
  const router = useRouter();
  const MODE = bulletin ? 'EDIT' : 'CREATE';

  const actionFn =
    MODE === 'EDIT'
      ? updateBulletinAction.bind(null, bulletin!.id)
      : createBulletinAction;

  const [state, action, isPending] = useActionState(actionFn, initialState);

  const [dragActive, setDragActive] = useState(false);
  const [pdfFile, setPdfFile] = useState<{ name: string; file: File } | null>(
    null,
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && validatePdfFile(file)) {
      setPdfFile({ name: file.name, file });
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validatePdfFile(file)) {
      setPdfFile({ name: file.name, file });
    }
  };

  const removePdfFile = () => {
    setPdfFile(null);
  };

  useEffect(() => {
    if (state.success) {
      alert(state.message);
      router.refresh();
      onSuccess?.();
    }
  }, [state.success, state.message, router, onSuccess]);

  const uiText = FORM_TEXT[MODE];
  const defaultValues = getDefaultValues(bulletin);

  return {
    state,
    action,
    isPending,
    defaultValues,
    uiText,
    pdfFile: {
      file: pdfFile,
      dragActive,
      handleDrag,
      handleDrop,
      handleFileSelect,
      removePdfFile,
    },
  };
}
