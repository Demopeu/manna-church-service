import { getKoreanDate } from '@/shared/lib';

export function Date() {
  const todayDate = getKoreanDate();
  return <div className="text-muted-foreground">{todayDate}</div>;
}
