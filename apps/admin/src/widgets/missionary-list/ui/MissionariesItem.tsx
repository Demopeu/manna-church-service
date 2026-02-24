import Image from 'next/image';
import {
  DeleteMissionaryButton,
  EditMissionaryButton,
} from '@/features/missionary';
import { Missionary } from '@/entities/missionary';
import { Badge, TableCell, TableRow } from '@/shared/ui';

interface Props {
  missionary: Missionary;
}

export function MissionariesItem({ missionary }: Props) {
  return (
    <TableRow>
      <TableCell>
        <div className="bg-muted relative h-12 w-12 overflow-hidden rounded-full">
          <Image
            src={missionary.imageUrl || '/placeholder.svg'}
            alt={missionary.name}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
      </TableCell>
      <TableCell className="font-medium">{missionary.name}</TableCell>
      <TableCell>
        <Badge variant="secondary">{missionary.country}</Badge>
      </TableCell>
      <TableCell className="text-muted-foreground max-w-[200px] truncate">
        {missionary.description || '-'}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <EditMissionaryButton missionary={missionary} />
          <DeleteMissionaryButton
            missionaryId={missionary.id}
            missionaryName={missionary.name}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}
