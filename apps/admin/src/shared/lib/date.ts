import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  format,
  getMonth,
  getYear,
  parseISO,
} from 'date-fns';
import { ko } from 'date-fns/locale';

export function formatKoreanDate(
  date?: string | Date | null | undefined,
  formatStr: string = 'yyyy년 M월 d일 EEEE',
): string {
  const targetDate = date
    ? typeof date === 'string'
      ? parseISO(date)
      : date
    : new Date();

  return format(targetDate, formatStr, { locale: ko });
}

export function formatRelativeDate(
  dateString: string | null | undefined,
): string {
  if (!dateString) return '';

  const now = new Date();
  const date = parseISO(dateString);

  const diffSeconds = differenceInSeconds(now, date);
  const diffMinutes = differenceInMinutes(now, date);
  const diffHours = differenceInHours(now, date);
  const diffDays = differenceInDays(now, date);

  if (diffSeconds < 60) {
    return '방금 전';
  }

  if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  }

  if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }

  if (diffDays <= 3) {
    return `${diffDays}일 전`;
  }
  return format(date, 'yyyy.MM.dd', { locale: ko });
}

export function getCurrentYearMonth(): { year: number; month: number } {
  const now = new Date();
  return {
    year: getYear(now),
    month: getMonth(now) + 1,
  };
}
