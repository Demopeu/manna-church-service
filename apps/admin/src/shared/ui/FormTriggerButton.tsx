'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from './base/Button';

interface Props {
  children: (props: { close: () => void }) => React.ReactNode;
  title: string;
}

export function FormTriggerButton({ children, title }: Props) {
  const [showForm, setShowForm] = useState(false);
  const close = () => setShowForm(false);

  if (showForm) {
    return <>{children({ close })}</>;
  }

  return (
    <Button size="lg" onClick={() => setShowForm(true)}>
      <Plus className="mr-2 h-5 w-5" />
      {title}
    </Button>
  );
}
