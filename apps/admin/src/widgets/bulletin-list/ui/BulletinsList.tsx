import { Suspense } from 'react';
import { FileImage } from 'lucide-react';
import { getBulletins } from '@/entities/bulletin';
import {
  DataTable,
  EmptyState,
  Pagination,
  SearchInput,
  SearchInputSkeleton,
  SectionCard,
} from '@/shared/ui';
import { COLUMNS } from '../config/columns';
import { BulletinsItem } from './BulletinsItem';

interface Props {
  searchQuery: string;
  currentPage: number;
}

export async function BulletinsList({ searchQuery, currentPage }: Props) {
  const { bulletins, totalPages } = await getBulletins({
    query: searchQuery,
    page: currentPage,
  });
  return (
    <SectionCard
      title="주보 목록"
      description="등록된 주보를 관리합니다. (최신순)"
      action={
        <Suspense fallback={<SearchInputSkeleton />}>
          <SearchInput placeholder="게시일로 검색..." />
        </Suspense>
      }
    >
      {bulletins.length === 0 ? (
        <EmptyState
          icon={FileImage}
          title="등록된 주보가 없습니다"
          description="위의 '주보 등록' 버튼을 눌러 첫 주보를 업로드해보세요."
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
