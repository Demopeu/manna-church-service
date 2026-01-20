import { Suspense } from 'react';
import { Megaphone } from 'lucide-react';
import { getBulletins } from '@/entities/bulletin';
import {
  DataTable,
  EmptyState,
  Pagination,
  SearchInput,
  SearchInputSkeleton,
  SectionCard,
} from '@/shared/ui';
import { BulletinsItem } from './BulletinsItem';
import { COLUMNS } from './columns';
import { BULLETIN_UI } from './labels';

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
      title={BULLETIN_UI.TITLE}
      description={BULLETIN_UI.DESCRIPTION}
      action={
        <Suspense fallback={<SearchInputSkeleton />}>
          <SearchInput placeholder={BULLETIN_UI.SEARCH_PLACEHOLDER} />
        </Suspense>
      }
    >
      {bulletins.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title={BULLETIN_UI.EMPTY}
          description={BULLETIN_UI.EMPTY_DESCRIPTION}
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
