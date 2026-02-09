'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input, PaginationBar } from '@/shared/ui';

interface Props {
  children: React.ReactNode;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  currentQuery: string;
}

export function ContentWrapper({
  children,
  totalCount,
  totalPages,
  currentPage,
  currentQuery,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(currentQuery);

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value) params.delete(key);
      else params.set(key, value);
    });

    if (!updates.page) {
      params.set('page', '1');
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleSearch = () => {
    updateParams({ query: searchValue });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground text-sm">
          전체{' '}
          <span className="text-foreground font-semibold">{totalCount}</span>건
        </p>

        <div className="relative w-full sm:w-64">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="검색..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-muted-foreground/20 rounded-full pl-10"
          />
        </div>
      </div>

      {children}

      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => updateParams({ page: String(page) })}
      />
    </div>
  );
}
