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
import { FileImage } from 'lucide-react';
import { BulletinsItem } from './BulletinsItem';
import { getBulletins } from '@/entities/bulletin';

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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[120px]">게시일</TableHead>
                <TableHead>표지</TableHead>
                <TableHead>PDF</TableHead>
                <TableHead className="text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bulletins.map((bulletin) => (
                <BulletinsItem key={bulletin.id} bulletin={bulletin} />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <Pagination totalPages={totalPages} currentPage={currentPage} />
    </SectionCard>
  );
}
