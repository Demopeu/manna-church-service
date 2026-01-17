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
      title="섬기는 사람 목록"
      description="교회 섬기는 사람들을 관리합니다. (정렬순)"
      action={
        <Suspense fallback={<SearchInputSkeleton />}>
          <SearchInput placeholder="이름 또는 직분으로 검색..." />
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
          title="섬기는 사람이 없습니다"
          description="위의 '섬기는 사람 추가' 버튼을 눌러 첫 번째 섬기는 사람을 등록해보세요."
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
