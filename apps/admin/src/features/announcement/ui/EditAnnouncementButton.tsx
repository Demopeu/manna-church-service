import { Button } from '@/shared/ui';
import { Pencil } from 'lucide-react';
import { useEditAnnouncement } from '../model/use-edit-announcement';

interface Props {
  onEdit: () => void;
}

export function EditAnnouncementButton({ onEdit }: Props) {
  const { handleEdit } = useEditAnnouncement(onEdit);

  return (
    <Button variant="ghost" size="icon" onClick={handleEdit}>
      <Pencil className="h-4 w-4" />
    </Button>
  );
}
