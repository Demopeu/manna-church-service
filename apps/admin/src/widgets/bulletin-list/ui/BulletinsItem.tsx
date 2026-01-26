'use client';

import { DeleteBulletinButton, EditBulletinButton } from '@/features/bulletin';
import { Bulletin } from '@/entities/bulletin';
import { formatRelativeDate } from '@/shared/lib';
import {
  Button,
  ImageDialog,
  MultiImageDialog,
  TableCell,
  TableRow,
} from '@/shared/ui';

interface Props {
  bulletin: Bulletin;
}

export function BulletinsItem({ bulletin }: Props) {
  const hasCover = !!bulletin.coverImageUrl;
  const hasPages = bulletin.imageUrls && bulletin.imageUrls.length > 0;
  const dateTitle = formatRelativeDate(bulletin.publishedAt);

  return (
    <TableRow key={bulletin.id}>
      <TableCell className="font-medium whitespace-nowrap">
        {dateTitle}
      </TableCell>

      <TableCell>
        {hasCover ? (
          <ImageDialog
            src={bulletin.coverImageUrl!}
            alt={`${dateTitle} 주보 표지`}
          >
            <Button
              variant="link"
              className="h-auto p-0 font-normal text-blue-600 hover:text-blue-800 hover:no-underline"
            >
              표지 보기
            </Button>
          </ImageDialog>
        ) : (
          <span className="text-muted-foreground text-sm">표지 없음</span>
        )}
      </TableCell>

      <TableCell>
        {hasPages ? (
          <MultiImageDialog
            images={bulletin.imageUrls}
            title={`${dateTitle} 주보 전체보기`}
          >
            <Button
              variant="link"
              className="h-auto p-0 font-normal text-blue-600 hover:text-blue-800 hover:no-underline"
            >
              주보 보기 ({bulletin.imageUrls.length}p)
            </Button>
          </MultiImageDialog>
        ) : (
          <span className="text-muted-foreground text-sm">내용 없음</span>
        )}
      </TableCell>

      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
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
