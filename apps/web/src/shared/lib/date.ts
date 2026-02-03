import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

export function formatKoreanDate(
  date?: string | Date | null | undefined,
  formatStr: string = 'yyyy년 M월 d일',
): string {
  const targetDate = date
    ? typeof date === 'string'
      ? parseISO(date)
      : date
    : new Date();

  return format(targetDate, formatStr, { locale: ko });
}
