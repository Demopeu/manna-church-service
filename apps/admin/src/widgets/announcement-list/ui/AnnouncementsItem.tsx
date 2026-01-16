import { TableRow, TableCell } from '@/shared/ui';
import {
  EditAnnouncementButton,
  DeleteAnnouncementButton,
} from '@/features/announcement';

interface Props {
  id: string;
  title: string;
  content: string;
  isUrgent: boolean;
  createdAt: string;
  onEdit: () => void;
}

export function AnnouncementsItem({
  id,
  title,
  content,
  isUrgent,
  createdAt,
  onEdit,
}: Props) {
  return (
    <TableRow key={id}>
      <TableCell>
        <div className="flex flex-wrap items-center gap-2">
          {isUrgent && (
            <span className="bg-destructive/10 text-destructive inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium">
              긴급
            </span>
          )}
          <span className="font-medium">{title}</span>
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">
        <span className="line-clamp-2">{content}</span>
      </TableCell>
      <TableCell>{createdAt}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <EditAnnouncementButton onEdit={onEdit} />
          <DeleteAnnouncementButton
            announcementId={id}
            announcementTitle={title}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}
