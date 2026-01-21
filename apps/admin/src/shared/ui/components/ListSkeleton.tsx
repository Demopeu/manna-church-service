import {
  DataTable,
  SearchInputSkeleton,
  SectionCard,
  Skeleton,
  TableCell,
  TableRow,
} from '@/shared/ui';

interface Column {
  readonly key: string;
  readonly header: string;
  readonly className?: string;
}

interface Props {
  title: string;
  description: string;
  columns?: readonly Column[];
}

export function ListSkeleton({ title, description, columns }: Props) {
  if (!columns || columns.length === 0) {
    return (
      <SectionCard
        title={title}
        description={description}
        action={<SearchInputSkeleton />}
      >
        <div className="space-y-4 p-4">
          <Skeleton className="h-10 w-full rounded-md" />

          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-md" />
            ))}
          </div>
        </div>
      </SectionCard>
    );
  }
  return (
    <SectionCard
      title={title}
      description={description}
      action={<SearchInputSkeleton />}
    >
      <DataTable columns={columns}>
        {Array.from({ length: 10 }).map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <div className="space-y-2">
                <Skeleton className="h-4 w-[180px]" />
                <Skeleton className="h-3 w-[100px]" />
              </div>
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[60px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[100px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-6 w-12 rounded-full" />
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </DataTable>
      <div className="flex items-center justify-center py-4">
        <div className="flex gap-1">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-20 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>
    </SectionCard>
  );
}
