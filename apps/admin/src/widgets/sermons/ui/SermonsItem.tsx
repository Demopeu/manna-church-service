import { TableRow, TableCell, Button } from '@/shared/ui';
import { ExternalLink, Pencil, Trash2 } from 'lucide-react';

interface Props {
  id: string;
  title: string;
  preacher: string;
  date: string;
  youtubeUrl: string;
}

export function SermonsItem({ id, title, preacher, date, youtubeUrl }: Props) {
  return (
    <TableRow key={id}>
      <TableCell className="font-medium">{title}</TableCell>
      <TableCell>{preacher}</TableCell>
      <TableCell>{date}</TableCell>
      <TableCell>
        <a
          href={youtubeUrl}
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
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => {}}>
            <Trash2 className="text-destructive h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
