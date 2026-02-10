import { PastorGreetingIntroSection, introData } from '@/widgets/intro-section';
import { MainWrapper } from '@/shared/ui';

export default function IntroPage() {
  return (
    <MainWrapper heroBannerData={introData}>
      <PastorGreetingIntroSection />
    </MainWrapper>
  );
}
