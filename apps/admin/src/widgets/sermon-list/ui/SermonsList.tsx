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
} from '@/shared/ui';
import { COLUMNS } from '../config/columns';
import { SermonsItem } from './SermonsItem';

interface Props {
  searchQuery: string;
  currentPage: number;
}

export async function SermonsList({ searchQuery, currentPage }: Props) {
  const { sermons, totalPages } = await getSermons({
    query: searchQuery,
    page: currentPage,
  });
  return (
    <SectionCard
      title="설교 목록"
      description="등록된 설교 영상을 관리합니다. (최신순)"
      action={
        <Suspense fallback={<SearchInputSkeleton />}>
          <SearchInput />
        </Suspense>
      }
    >
      {sermons.length === 0 ? (
        <EmptyState
          icon={Video}
          title="등록된 설교가 없습니다"
          description="위의 '설교 등록' 버튼을 눌러 첫 설교를 등록해보세요."
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
