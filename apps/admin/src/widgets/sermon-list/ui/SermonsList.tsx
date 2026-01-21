import { Suspense } from 'react';
import { Video } from 'lucide-react';
import { getSermons } from '@/entities/sermon';
import {
  DataTable,
  EmptyState,
  Pagination,
  SearchInput,
  SearchInputSkeleton,
  SectionCard,
  withAsyncBoundary,
} from '@/shared/ui';
import { ListSkeleton } from '@/shared/ui';
import { SermonsItem } from './SermonsItem';
import { COLUMNS } from './columns';
import { SERMON_UI } from './labels';

interface Props {
  searchQuery: string;
  currentPage: number;
}

async function List({ searchQuery, currentPage }: Props) {
  const { sermons, totalPages } = await getSermons({
    query: searchQuery,
    page: currentPage,
  });
  return (
    <SectionCard
      title={SERMON_UI.TITLE}
      description={SERMON_UI.DESCRIPTION}
      action={
        <Suspense fallback={<SearchInputSkeleton />}>
          <SearchInput placeholder={SERMON_UI.SEARCH_PLACEHOLDER} />
        </Suspense>
      }
    >
      {sermons.length === 0 ? (
        <EmptyState
          icon={Video}
          title={SERMON_UI.EMPTY}
          description={SERMON_UI.EMPTY_DESCRIPTION}
        />
      ) : (
        <DataTable columns={COLUMNS}>
          {sermons.map((sermon) => (
            <SermonsItem key={sermon.id} sermon={sermon} />
          ))}
        </DataTable>
      )}
      <Pagination totalPages={totalPages} currentPage={currentPage} />
    </SectionCard>
  );
}

export const SermonsList = withAsyncBoundary(List, {
  loadingFallback: (
    <ListSkeleton
      title={SERMON_UI.TITLE}
      description={SERMON_UI.DESCRIPTION}
      columns={COLUMNS}
    />
  ),
});
