'use client';

import { TableRow, TableCell } from '@/shared/ui';
import {
  EditAnnouncementButton,
  DeleteAnnouncementButton,
} from '@/features/announcement';
import { Announcement } from '@/entities/announcement';

interface Props {
  announcement: Announcement;
}

export function AnnouncementsItem({ announcement }: Props) {
  return (
    <TableRow key={announcement.id}>
      <TableCell>
        <div className="flex flex-wrap items-center gap-2">
          {announcement.isUrgent && (
            <span className="bg-destructive/10 text-destructive inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium">
              긴급
            </span>
          )}
          <span className="font-medium">{announcement.title}</span>
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">
        <span className="line-clamp-2">{announcement.content}</span>
      </TableCell>
      <TableCell>{announcement.createdAt}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <EditAnnouncementButton announcement={announcement} />
          <DeleteAnnouncementButton
            announcementId={announcement.id}
            announcementTitle={announcement.title}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}
