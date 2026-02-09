'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  PaginationBar,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui';

interface Props {
  children: React.ReactNode;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  currentYear: string;
  currentMonth: string;
}

export function BulletinContentWrapper({
  children,
  totalCount,
  totalPages,
  currentPage,
  currentYear,
  currentMonth,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === 'all') params.delete(key);
      else params.set(key, value);
    });

    if (!updates.page) {
      params.set('page', '1');
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const nowYear = new Date().getFullYear();
  const startYear = 2025;

  const years = Array.from({ length: nowYear - startYear + 1 }, (_, i) =>
    String(nowYear - i),
  );
  const months = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, '0'),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground text-sm">
          총 <span className="text-foreground font-semibold">{totalCount}</span>
          건
        </p>
        <div className="flex items-center gap-2">
          <Select
            value={currentYear}
            onValueChange={(val) => updateParams({ year: val })}
          >
            <SelectTrigger className="w-28">
              <SelectValue placeholder="년도" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 년도</SelectItem>
              {years.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}년
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={currentMonth}
            disabled={!currentYear || currentYear === 'all'}
            onValueChange={(val) => updateParams({ month: val })}
          >
            <SelectTrigger className="w-24">
              <SelectValue placeholder="월" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 월</SelectItem>
              {months.map((m) => (
                <SelectItem key={m} value={m}>
                  {Number(m)}월
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
