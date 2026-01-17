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
import { ANNOUNCEMENT_UI } from '../config/labels';
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
      title={ANNOUNCEMENT_UI.TITLE}
      description={ANNOUNCEMENT_UI.DESCRIPTION}
      action={
        <Suspense fallback={<SearchInputSkeleton />}>
          <SearchInput placeholder={ANNOUNCEMENT_UI.SEARCH_PLACEHOLDER} />
        </Suspense>
      }
    >
      {announcements.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title={ANNOUNCEMENT_UI.EMPTY}
          description={ANNOUNCEMENT_UI.EMPTY_DESCRIPTION}
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
