import { Suspense } from 'react';
import { Megaphone } from 'lucide-react';
import { getAnnouncements } from '@/entities/announcement';
import {
  DataTable,
  EmptyState,
  ListSkeleton,
  Pagination,
  SearchInput,
  SearchInputSkeleton,
  SectionCard,
  withAsyncBoundary,
} from '@/shared/ui';
import { AnnouncementsItem } from './AnnouncementsItem';
import { COLUMNS } from './columns';
import { ANNOUNCEMENT_UI } from './labels';

interface Props {
  searchQuery: string;
  currentPage: number;
}

export async function List({ searchQuery, currentPage }: Props) {
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

export const AnnouncementsList = withAsyncBoundary(List, {
  loadingFallback: (
    <ListSkeleton
      title={ANNOUNCEMENT_UI.TITLE}
      description={ANNOUNCEMENT_UI.DESCRIPTION}
      columns={COLUMNS}
    />
  ),
});
