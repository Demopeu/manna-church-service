import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  EmptyState,
  SearchInput,
  SearchInputSkeleton,
  SectionCard,
  Pagination,
} from '@/shared/ui';
import { Suspense } from 'react';
import { Users } from 'lucide-react';
import { ServantsItem } from './ServantsItem';
import { ServantsFilters } from './ServantsFilters';
import { getServants } from '@/entities/servant';

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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16 text-center">순서</TableHead>
                <TableHead>사진</TableHead>
                <TableHead>이름</TableHead>
                <TableHead>직분</TableHead>
                <TableHead>연락처</TableHead>
                <TableHead>담당/소개</TableHead>
                <TableHead className="text-center">노출</TableHead>
                <TableHead className="text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {servants.map((servant) => (
                <ServantsItem key={servant.id} servant={servant} />
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Pagination totalPages={totalPages} currentPage={currentPage} />
    </SectionCard>
  );
}
