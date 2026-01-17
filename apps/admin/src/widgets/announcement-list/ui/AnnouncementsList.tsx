import { Suspense } from 'react';
import { Megaphone } from 'lucide-react';
import { getAnnouncements } from '@/entities/announcement';
import {
  DataTable,
  EmptyState,
  Pagination,
  SearchInput,
  SearchInputSkeleton,
  SectionCard,
} from '@/shared/ui';
import { COLUMNS } from '../config/columns';
import { AnnouncementsItem } from './AnnouncementsItem';

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
        <DataTable columns={COLUMNS}>
          {announcements.map((announcement) => (
            <AnnouncementsItem
              key={announcement.id}
              announcement={announcement}
            />
          ))}
        </DataTable>
      )}
      <Pagination totalPages={totalPages} currentPage={currentPage} />
    </SectionCard>
  );
}
