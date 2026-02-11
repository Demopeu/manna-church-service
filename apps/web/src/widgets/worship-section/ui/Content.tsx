import { churchData } from '@/shared/config';
import { WorshipSection } from './Section';
import { WORSHIP_DATA } from './data';

export function WorshipContent() {
  const { contact } = churchData;
  return (
    <div className="space-y-10">
      {WORSHIP_DATA.map((category) => (
        <WorshipSection key={category.id} data={category} />
      ))}
      <div className="border-manna-yellow/30 bg-manna-yellow/20 rounded-xl border p-5">
        <p className="text-foreground/80 text-sm leading-relaxed">
          <strong className="text-foreground">안내:</strong> 예배 시간은 교회
          사정에 따라 변경될 수 있습니다. 자세한 문의는 교회 사무실(
          {contact.phone})로 연락해 주시기 바랍니다.
        </p>
      </div>
    </div>
  );
}
