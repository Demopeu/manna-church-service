import { Button } from '@/shared/ui';
import { Pencil } from 'lucide-react';
import { useEditBulletin } from '../model/use-edit-bulletin';

interface Props {
  bulletinId: string;
}

export function EditBulletinButton({ bulletinId }: Props) {
  const { handleEdit } = useEditBulletin(bulletinId);

  return (
    <Button variant="ghost" size="icon" onClick={handleEdit}>
      <Pencil className="h-4 w-4" />
    </Button>
  );
}
