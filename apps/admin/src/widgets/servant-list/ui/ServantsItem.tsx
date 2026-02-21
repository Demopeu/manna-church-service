import Image from 'next/image';
import { Phone } from 'lucide-react';
import { DeleteServantButton, EditServantButton } from '@/features/servant';
import { Servant } from '@/entities/servant';
import { Badge, TableCell, TableRow } from '@/shared/ui';

interface Props {
  servant: Servant;
}

export function ServantsItem({ servant }: Props) {
  return (
    <TableRow>
      <TableCell className="text-center font-medium">
        {servant.sortOrder}
      </TableCell>
      <TableCell>
        <div className="bg-muted relative h-12 w-12 overflow-hidden rounded-full">
          <Image
            src={servant.photoFile || '/placeholder.svg'}
            alt={servant.name}
            fill
            className="object-cover"
            sizes="48px"
            unoptimized
          />
        </div>
      </TableCell>
      <TableCell className="font-medium">{servant.name}</TableCell>
      <TableCell>
        <Badge variant="secondary">{servant.role}</Badge>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {servant.contact ? (
          <span className="flex items-center gap-1">
            <Phone className="h-3 w-3" />
            {servant.contact}
          </span>
        ) : (
          '-'
        )}
      </TableCell>
      <TableCell className="text-muted-foreground max-w-[200px] truncate">
        {servant.introduction || '-'}
      </TableCell>
      <TableCell className="text-center">
        {servant.isPublic ? (
          <Badge variant="default">노출</Badge>
        ) : (
          <Badge variant="outline">숨김</Badge>
        )}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <EditServantButton servant={servant} />
          <DeleteServantButton
            servantId={servant.id}
            servantName={servant.name}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}
