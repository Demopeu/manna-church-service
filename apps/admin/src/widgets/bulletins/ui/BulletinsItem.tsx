import { TableRow, TableCell } from '@/shared/ui';
import { FileText } from 'lucide-react';
import { EditBulletinButton, DeleteBulletinButton } from '@/features/bulletin';

interface Props {
  id: string;
  fileName: string;
  date: string;
  uploadedAt: string;
}

export function BulletinsItem({ id, fileName, date, uploadedAt }: Props) {
  return (
    <TableRow key={id}>
      <TableCell>
        <div className="flex items-center gap-2">
          <FileText className="text-muted-foreground h-4 w-4" />
          <span className="font-medium">{fileName}</span>
        </div>
      </TableCell>
      <TableCell>{date}</TableCell>
      <TableCell className="text-muted-foreground">{uploadedAt}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <EditBulletinButton bulletinId={id} />
          <DeleteBulletinButton bulletinId={id} bulletinDate={date} />
        </div>
      </TableCell>
    </TableRow>
  );
}
