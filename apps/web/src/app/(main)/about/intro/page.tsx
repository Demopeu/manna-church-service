import { PastorGreetingIntro, introData } from '@/widgets/intro-section';
import { HeroBanner } from '@/shared/ui';

export default function IntroPage() {
  return (
    <main className="mb-10 min-w-0 flex-1 space-y-10">
      <HeroBanner {...introData} />
      <PastorGreetingIntro />
    </main>
  );
}
