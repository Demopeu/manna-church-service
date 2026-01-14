import { Button } from '@/shared/ui';
import { Pencil } from 'lucide-react';

interface Props {
  onEdit: () => void;
}

export function EditAlbumButton({ onEdit }: Props) {
  return (
    <Button variant="ghost" size="icon" onClick={onEdit}>
      <Pencil className="h-4 w-4" />
    </Button>
  );
}
