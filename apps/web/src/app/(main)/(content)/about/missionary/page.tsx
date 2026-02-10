import {
  MissionarySection,
  missionaryData,
} from '@/widgets/missionary-section';
import { MainWrapper } from '@/shared/ui';

export default function MissionaryPage() {
  return (
    <MainWrapper heroBannerData={missionaryData}>
      <MissionarySection />
    </MainWrapper>
  );
}
