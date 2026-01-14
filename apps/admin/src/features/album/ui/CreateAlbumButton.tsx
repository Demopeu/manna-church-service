'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui';
import { Plus } from 'lucide-react';
import { AlbumForm } from './AlbumForm';

export function CreateAlbumButton() {
  const [showForm, setShowForm] = useState(false);

  if (showForm) {
    return <AlbumForm onCancel={() => setShowForm(false)} />;
  }

  return (
    <Button size="lg" onClick={() => setShowForm(true)}>
      <Plus className="mr-2 h-5 w-5" />
      앨범 만들기
    </Button>
  );
}
