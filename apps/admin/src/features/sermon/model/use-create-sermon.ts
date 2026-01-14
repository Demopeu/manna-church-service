'use client';

import { useState } from 'react';

interface SermonFormData {
  title: string;
  preacher: string;
  date: string;
  youtubeUrl: string;
}

export function useCreateSermon(onSuccess?: () => void) {
  const [formData, setFormData] = useState<SermonFormData>({
    title: '',
    preacher: '',
    date: '',
    youtubeUrl: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('설교 등록:', formData);
    setFormData({ title: '', preacher: '', date: '', youtubeUrl: '' });
    onSuccess?.();
  };

  const updateField = (field: keyof SermonFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    updateField,
    handleSubmit,
  };
}
