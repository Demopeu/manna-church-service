import { Suspense } from 'react';
import { Users } from 'lucide-react';
import { getServants } from '@/entities/servant';
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
import { ServantsFilters } from './ServantsFilters';
import { ServantsItem } from './ServantsItem';
import { COLUMNS } from './columns';
import { SERVANT_UI } from './labels';

interface Props {
  searchQuery: string;
  roleFilter: string;
  isPublicFilter: string;
  currentPage: number;
}

async function List({
  searchQuery,
  roleFilter,
  isPublicFilter,
  currentPage,
}: Props) {
  const { servants, totalPages } = await getServants({
    query: searchQuery,
    role: roleFilter !== 'all' ? roleFilter : undefined,
    isPublic: isPublicFilter !== 'all' ? isPublicFilter : undefined,
    page: currentPage,
  });

  return (
    <SectionCard
      title={SERVANT_UI.TITLE}
      description={SERVANT_UI.DESCRIPTION}
      action={
        <Suspense fallback={<SearchInputSkeleton />}>
          <SearchInput placeholder="이름으로 검색..." />
        </Suspense>
      }
    >
      <ServantsFilters
        roleFilter={roleFilter}
        isPublicFilter={isPublicFilter}
      />

      {servants.length === 0 ? (
        <EmptyState
          icon={Users}
          title={SERVANT_UI.EMPTY}
          description={SERVANT_UI.EMPTY_DESCRIPTION}
        />
      ) : (
        <DataTable columns={COLUMNS}>
          {servants.map((servant) => (
            <ServantsItem key={servant.id} servant={servant} />
          ))}
        </DataTable>
      )}
      <Pagination totalPages={totalPages} currentPage={currentPage} />
    </SectionCard>
  );
}

export const ServantsList = withAsyncBoundary(List, {
  loadingFallback: (
    <ListSkeleton
      title={SERVANT_UI.TITLE}
      description={SERVANT_UI.DESCRIPTION}
      columns={COLUMNS}
    />
  ),
});
