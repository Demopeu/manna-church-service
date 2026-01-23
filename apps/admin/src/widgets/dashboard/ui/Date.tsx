import { formatKoreanDate } from '@/shared/lib';

export function Date() {
  const todayDate = formatKoreanDate();
  return <div className="text-muted-foreground">{todayDate}</div>;
}
