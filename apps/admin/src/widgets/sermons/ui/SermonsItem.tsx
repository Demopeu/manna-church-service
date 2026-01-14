import { TableRow, TableCell } from '@/shared/ui';
import { ExternalLink } from 'lucide-react';
import { EditSermonButton, DeleteSermonButton } from '@/features/sermon';

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
          <EditSermonButton sermonId={id} />
          <DeleteSermonButton sermonId={id} sermonTitle={title} />
        </div>
      </TableCell>
    </TableRow>
  );
}
