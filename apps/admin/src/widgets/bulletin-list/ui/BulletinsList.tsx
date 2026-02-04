import { Suspense } from 'react';
import { Megaphone } from 'lucide-react';
import { YearMonthSelect } from '@/features/bulletin/ui/YearMonthSelect';
import { YearMonthSelectSkeleton } from '@/features/bulletin/ui/YearMonthSelectSkeleton';
import { getBulletins } from '@/entities/bulletin';
import {
  DataTable,
  EmptyState,
  ListSkeleton,
  Pagination,
  SectionCard,
  withAsyncBoundary,
} from '@/shared/ui';
import { BulletinsItem } from './BulletinsItem';
import { COLUMNS } from './columns';
import { BULLETIN_UI } from './labels';

interface Props {
  year: number;
  month: number;
  currentPage: number;
}

async function List({ year, month, currentPage }: Props) {
  const { bulletins, totalPages } = await getBulletins({
    year,
    month,
    page: currentPage,
  });
  return (
    <SectionCard
      title={BULLETIN_UI.TITLE}
      description={BULLETIN_UI.DESCRIPTION}
      action={
        <Suspense fallback={<YearMonthSelectSkeleton />}>
          <YearMonthSelect year={year} month={month} />
        </Suspense>
      }
    >
      {bulletins.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title={BULLETIN_UI.EMPTY}
          description={BULLETIN_UI.EMPTY_DESCRIPTION}
        />
      ) : (
        <DataTable columns={COLUMNS}>
          {bulletins.map((bulletin) => (
            <BulletinsItem key={bulletin.id} bulletin={bulletin} />
          ))}
        </DataTable>
      )}
      <Pagination totalPages={totalPages} currentPage={currentPage} />
    </SectionCard>
  );
}

export const BulletinsList = withAsyncBoundary(List, {
  loadingFallback: (
    <ListSkeleton
      title={BULLETIN_UI.TITLE}
      description={BULLETIN_UI.DESCRIPTION}
      columns={COLUMNS}
      action={<YearMonthSelectSkeleton />}
    />
  ),
});
