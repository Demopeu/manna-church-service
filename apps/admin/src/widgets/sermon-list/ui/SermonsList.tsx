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
import { SERMON_UI } from '../config/labels';
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
      title={SERMON_UI.TITLE}
      description={SERMON_UI.DESCRIPTION}
      action={
        <Suspense fallback={<SearchInputSkeleton />}>
          <SearchInput placeholder={SERMON_UI.SEARCH_PLACEHOLDER} />
        </Suspense>
      }
    >
      {sermons.length === 0 ? (
        <EmptyState
          icon={Video}
          title={SERMON_UI.EMPTY}
          description={SERMON_UI.EMPTY_DESCRIPTION}
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
