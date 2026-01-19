'use client';

import { ExternalLink } from 'lucide-react';
import { DeleteSermonButton, EditSermonButton } from '@/features/sermon';
import { Sermon } from '@/entities/sermon';
import { TableCell, TableRow } from '@/shared/ui';

interface Props {
  sermon: Sermon;
}

export function SermonsItem({ sermon }: Props) {
  return (
    <TableRow key={sermon.id}>
      <TableCell className="font-medium">{sermon.title}</TableCell>
      <TableCell>{sermon.preacher}</TableCell>
      <TableCell>{sermon.date}</TableCell>
      <TableCell>
        <a
          href={sermon.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary inline-flex items-center hover:underline"
        >
          영상 보기
          <ExternalLink className="ml-1 h-3 w-3" />
        </a>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <EditSermonButton sermon={sermon} />
          <DeleteSermonButton sermonId={sermon.id} sermonTitle={sermon.title} />
        </div>
      </TableCell>
    </TableRow>
  );
}
