'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { getCurrentYearMonth } from '@/shared/lib';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui';

interface Props {
  year: number;
  month: number;
}

export function YearMonthSelect({ year, month }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { year: currentYear } = getCurrentYearMonth();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleYearChange = (newYear: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('year', newYear);
    params.set('month', String(month));
    params.set('page', '1');
    router.push(`/bulletins?${params.toString()}`);
  };

  const handleMonthChange = (newMonth: string) => {
    if (year === 0 && newMonth !== '0') {
      toast.error('연도를 먼저 선택해주세요', {
        description: '월을 선택하려면 연도를 먼저 선택해야 합니다.',
      });
      const params = new URLSearchParams(searchParams.toString());
      params.set('year', String(year));
      params.set('month', '0');
      params.set('page', '1');
      router.push(`/bulletins?${params.toString()}`);
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set('year', String(year));
    params.set('month', newMonth);
    params.set('page', '1');
    router.push(`/bulletins?${params.toString()}`);
  };

  return (
    <div className="flex gap-2">
      <Select value={String(year)} onValueChange={handleYearChange}>
        <SelectTrigger className="w-[120px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0">전체 연</SelectItem>
          {years.map((y) => (
            <SelectItem key={y} value={String(y)}>
              {y}년
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={String(month)} onValueChange={handleMonthChange}>
        <SelectTrigger className="w-[100px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0">전체 월</SelectItem>
          {months.map((m) => (
            <SelectItem key={m} value={String(m)}>
              {m}월
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
