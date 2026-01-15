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
import { Video } from 'lucide-react';
import { SermonsItem } from './SermonsItem';
import { Sermon } from '@/entities/sermons';

interface Props {
  sermons: Sermon[];
  totalPages: number;
  currentPage: number;
}

export function SermonsList({ sermons, currentPage, totalPages }: Props) {
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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[150px]">제목</TableHead>
                <TableHead>설교자</TableHead>
                <TableHead>날짜</TableHead>
                <TableHead>링크</TableHead>
                <TableHead className="text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sermons.map((sermon) => (
                <SermonsItem key={sermon.id} sermon={sermon} />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <Pagination totalPages={totalPages} currentPage={currentPage} />
    </SectionCard>
  );
}
