import { Suspense } from 'react';
import { Users } from 'lucide-react';
import { getServants } from '@/entities/servant';
import {
  DataTable,
  EmptyState,
  Pagination,
  SearchInput,
  SearchInputSkeleton,
  SectionCard,
} from '@/shared/ui';
import { COLUMNS } from '../config/columns';
import { SERVANT_UI } from '../config/labels';
import { ServantsFilters } from './ServantsFilters';
import { ServantsItem } from './ServantsItem';

interface Props {
  searchQuery: string;
  roleFilter: string;
  isPublicFilter: string;
  currentPage: number;
}

export async function ServantsList({
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
