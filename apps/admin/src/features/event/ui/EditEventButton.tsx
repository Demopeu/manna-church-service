import { Button } from '@/shared/ui';
import { Pencil } from 'lucide-react';
import { useEditEvent } from '../model/use-edit-event';

interface Props {
  onEdit: () => void;
}

export function EditEventButton({ onEdit }: Props) {
  const { handleEdit } = useEditEvent(onEdit);

  return (
    <Button variant="ghost" size="icon" onClick={handleEdit}>
      <Pencil className="h-4 w-4" />
    </Button>
  );
}
