import { TableRow, TableCell } from '@/shared/ui';
import { EditEventButton, DeleteEventButton } from '@/features/event';
import { ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface Props {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  onEdit: () => void;
}

export function EventsItem({
  id,
  title,
  description,
  imageUrl,
  createdAt,
  onEdit,
}: Props) {
  return (
    <TableRow key={id}>
      <TableCell>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            className="h-16 w-16 rounded-lg object-cover"
            width={64}
            height={64}
          />
        ) : (
          <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-lg">
            <ImageIcon className="text-muted-foreground h-6 w-6" />
          </div>
        )}
      </TableCell>
      <TableCell className="font-medium">{title}</TableCell>
      <TableCell className="text-muted-foreground">
        <span className="line-clamp-2">{description}</span>
      </TableCell>
      <TableCell>{createdAt}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <EditEventButton onEdit={onEdit} />
          <DeleteEventButton eventId={id} eventTitle={title} />
        </div>
      </TableCell>
    </TableRow>
  );
}
