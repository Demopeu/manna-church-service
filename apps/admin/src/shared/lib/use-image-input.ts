'use client';

import { useEffect, useState } from 'react';

export interface ImageItem {
  id: string;
  file: File | null;
  preview: string;
  isThumbnail: boolean;
}

interface ImageInputProps {
  initialUrl?: string;
  onFileChange?: (file: File | null) => void;
}

export function useImageInput({ initialUrl, onFileChange }: ImageInputProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(initialUrl || null);
  const [rawFile, setRawFile] = useState<File | null>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;

    if (preview && !preview.startsWith('http')) {
      URL.revokeObjectURL(preview);
    }

    const newPreview = URL.createObjectURL(file);
    setRawFile(file);
    setPreview(newPreview);
    onFileChange?.(file);
  };
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
    e.target.value = '';
  };

  const removeFile = () => {
    if (preview && !preview.startsWith('http')) {
      URL.revokeObjectURL(preview);
    }
    setRawFile(null);
    setPreview(null);
    onFileChange?.(null);
  };

  useEffect(() => {
    return () => {
      if (preview && !preview.startsWith('http')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return {
    preview,
    rawFile,
    dragActive,
    handleDrag,
    handleDrop,
    handleFileSelect,
    removeFile,
  };
}
