'use client';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/shared/ui';
import { POSITION_OPTIONS } from '@/entities/servant';
import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
  roleFilter: string;
  isPublicFilter: string;
}

export function ServantsFilters({ roleFilter, isPublicFilter }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete('page');
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-sm">직분:</span>
        <Select
          value={roleFilter}
          onValueChange={(v) => updateFilter('role', v)}
        >
          <SelectTrigger className="h-9 w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            {POSITION_OPTIONS.map((pos) => (
              <SelectItem key={pos} value={pos}>
                {pos}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-sm">노출:</span>
        <Select
          value={isPublicFilter}
          onValueChange={(v) => updateFilter('isPublic', v)}
        >
          <SelectTrigger className="h-9 w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="true">노출</SelectItem>
            <SelectItem value="false">숨김</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
