import { Button } from '@/shared/ui';
import { Pencil } from 'lucide-react';
import { useEditSermon } from '../model/use-edit-sermon';

interface Props {
  sermonId: string;
}

export function EditSermonButton({ sermonId }: Props) {
  const { handleEdit } = useEditSermon(sermonId);

  return (
    <Button variant="ghost" size="icon" onClick={handleEdit}>
      <Pencil className="h-4 w-4" />
    </Button>
  );
}
