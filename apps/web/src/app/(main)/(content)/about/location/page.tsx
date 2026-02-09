import { LocationContent, locationData } from '@/widgets/location-section';
import { MainWrapper } from '@/shared/ui';

export default function LocationPage() {
  return (
    <MainWrapper heroBannerData={locationData}>
      <LocationContent />
    </MainWrapper>
  );
}
