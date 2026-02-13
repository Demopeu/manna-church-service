import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/ui';

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function PaginationBar({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationBarProps) {
  const getVisiblePages = () => {
    const pages: number[] = [];
    let start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);

    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-center gap-1 pt-4 ${className}`}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="h-9 w-9"
        aria-label="이전 페이지"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </Button>

      {getVisiblePages().map((p) => (
        <Button
          key={p}
          variant={currentPage === p ? 'default' : 'ghost'}
          size="icon"
          onClick={() => onPageChange(p)}
          className={`h-9 w-9 ${
            currentPage === p
              ? 'bg-manna-dark-blue hover:bg-manna-dark-blue/90 text-white'
              : 'hover:bg-manna-mint/20'
          }`}
        >
          {p}
        </Button>
      ))}

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="h-9 w-9"
        aria-label="다음 페이지"
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  );
}
