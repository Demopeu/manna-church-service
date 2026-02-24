import { Suspense } from 'react';
import { Users } from 'lucide-react';
import { getMissionaries } from '@/entities/missionary';
import {
  DataTable,
  EmptyState,
  ListSkeleton,
  Pagination,
  SearchInput,
  SearchInputSkeleton,
  SectionCard,
  withAsyncBoundary,
} from '@/shared/ui';
import { MissionariesItem } from './MissionariesItem';
import { COLUMNS } from './columns';
import { MISSIONARY_UI } from './labels';

interface Props {
  searchQuery: string;
  currentPage: number;
}

async function List({ searchQuery, currentPage }: Props) {
  const { missionaries, totalPages } = await getMissionaries({
    query: searchQuery,
    page: currentPage,
  });

  return (
    <SectionCard
      title={MISSIONARY_UI.TITLE}
      description={MISSIONARY_UI.DESCRIPTION}
      action={
        <Suspense fallback={<SearchInputSkeleton />}>
          <SearchInput placeholder="이름으로 검색..." />
        </Suspense>
      }
    >
      {missionaries.length === 0 ? (
        <EmptyState
          icon={Users}
          title={MISSIONARY_UI.EMPTY}
          description={MISSIONARY_UI.EMPTY_DESCRIPTION}
        />
      ) : (
        <DataTable columns={COLUMNS}>
          {missionaries.map((missionary) => (
            <MissionariesItem key={missionary.id} missionary={missionary} />
          ))}
        </DataTable>
      )}
      <Pagination totalPages={totalPages} currentPage={currentPage} />
    </SectionCard>
  );
}

export const MissionariesList = withAsyncBoundary(List, {
  loadingFallback: (
    <ListSkeleton
      title={MISSIONARY_UI.TITLE}
      description={MISSIONARY_UI.DESCRIPTION}
      columns={COLUMNS}
    />
  ),
});
