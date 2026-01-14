'use client';

import { useState, useCallback } from 'react';
import type React from 'react';
import { validatePdfFile } from '../lib/validate-pdf';

export function useCreateBulletin(onSuccess?: () => void) {
  const [date, setDate] = useState('');
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
    } else {
      console.error('PDF 파일만 업로드 가능합니다');
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validatePdfFile(file)) {
      setPdfFile({ name: file.name, file });
    } else if (file) {
      console.error('PDF 파일만 업로드 가능합니다');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('주보 등록:', { date, pdfFile });
    setDate('');
    setPdfFile(null);
    onSuccess?.();
  };

  const removePdfFile = () => {
    setPdfFile(null);
  };

  return {
    date,
    setDate,
    dragActive,
    pdfFile,
    handleDrag,
    handleDrop,
    handleFileSelect,
    handleSubmit,
    removePdfFile,
  };
}
