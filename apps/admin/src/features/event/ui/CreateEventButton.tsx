'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui';
import { Plus } from 'lucide-react';
import { EventForm } from './EventForm';

export function CreateEventButton() {
  const [showForm, setShowForm] = useState(false);

  if (showForm) {
    return <EventForm onCancel={() => setShowForm(false)} />;
  }

  return (
    <Button size="lg" onClick={() => setShowForm(true)}>
      <Plus className="mr-2 h-5 w-5" />
      이벤트 등록
    </Button>
  );
}
