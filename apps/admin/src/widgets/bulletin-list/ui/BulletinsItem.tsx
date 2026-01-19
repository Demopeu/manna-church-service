'use client';

import { ExternalLink } from 'lucide-react';
import { DeleteBulletinButton, EditBulletinButton } from '@/features/bulletin';
import { Bulletin } from '@/entities/bulletin';
import { TableCell, TableRow } from '@/shared/ui';

interface Props {
  bulletin: Bulletin;
}

export function BulletinsItem({ bulletin }: Props) {
  return (
    <TableRow key={bulletin.id}>
      <TableCell className="font-medium">{bulletin.publishedAt}</TableCell>
      <TableCell>
        <a
          href={bulletin.coverImageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary inline-flex items-center hover:underline"
        >
          표지 보기
          <ExternalLink className="ml-1 h-3 w-3" />
        </a>
      </TableCell>
      <TableCell>
        <a
          href={bulletin.originalPdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary inline-flex items-center hover:underline"
        >
          PDF 보기
          <ExternalLink className="ml-1 h-3 w-3" />
        </a>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <EditBulletinButton bulletin={bulletin} />
          <DeleteBulletinButton
            bulletinId={bulletin.id}
            bulletinDate={bulletin.publishedAt}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}
