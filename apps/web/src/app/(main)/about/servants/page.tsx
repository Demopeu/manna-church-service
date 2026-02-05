import { ServantsContent, servantsData } from '@/widgets/servants-section';
import { MainWrapper } from '@/shared/ui';

export default function ServantsPage() {
  return (
    <MainWrapper heroBannerData={servantsData}>
      <ServantsContent />
    </MainWrapper>
  );
}
