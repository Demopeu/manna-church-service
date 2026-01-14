'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui';
import { Plus } from 'lucide-react';
import { CreateSermonForm } from './CreateSermonForm';

export function CreateSermonButton() {
  const [showForm, setShowForm] = useState(false);

  if (showForm) {
    return <CreateSermonForm onCancel={() => setShowForm(false)} />;
  }

  return (
    <Button size="lg" onClick={() => setShowForm(true)}>
      <Plus className="mr-2 h-5 w-5" />
      설교 등록
    </Button>
  );
}
