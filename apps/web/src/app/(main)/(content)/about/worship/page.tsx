import { WorshipContent, worshipData } from '@/widgets/worship-section';
import { MainWrapper } from '@/shared/ui';

export default function WorshipPage() {
  return (
    <MainWrapper heroBannerData={worshipData}>
      <WorshipContent />
    </MainWrapper>
  );
}
