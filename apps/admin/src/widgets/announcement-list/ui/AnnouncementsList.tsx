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
import { Megaphone } from 'lucide-react';
import { AnnouncementsItem } from './AnnouncementsItem';
import { getAnnouncements } from '@/entities/announcement';

interface Props {
  searchQuery: string;
  currentPage: number;
}

export async function AnnouncementsList({ searchQuery, currentPage }: Props) {
  const { announcements, totalPages } = await getAnnouncements({
    query: searchQuery,
    page: currentPage,
  });
  return (
    <SectionCard
      title="공지 목록"
      description="등록된 공지사항을 관리합니다. (최신순)"
      action={
        <Suspense fallback={<SearchInputSkeleton />}>
          <SearchInput />
        </Suspense>
      }
    >
      {announcements.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="등록된 공지가 없습니다"
          description="위의 '공지 작성' 버튼을 눌러 첫 공지를 등록해보세요."
        />
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">제목</TableHead>
                <TableHead className="min-w-[300px]">내용</TableHead>
                <TableHead>작성일</TableHead>
                <TableHead className="text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {announcements.map((announcement) => (
                <AnnouncementsItem
                  key={announcement.id}
                  announcement={announcement}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <Pagination totalPages={totalPages} currentPage={currentPage} />
    </SectionCard>
  );
}
