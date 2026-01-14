'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui';
import { Plus } from 'lucide-react';
import { CreateBulletinForm } from './CreateBulletinForm';

export function CreateBulletinButton() {
  const [showForm, setShowForm] = useState(false);

  if (showForm) {
    return <CreateBulletinForm onCancel={() => setShowForm(false)} />;
  }

  return (
    <Button size="lg" onClick={() => setShowForm(true)}>
      <Plus className="mr-2 h-5 w-5" />
      주보 등록
    </Button>
  );
}
