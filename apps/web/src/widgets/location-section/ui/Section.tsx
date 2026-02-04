import { AddressSection } from './Address';
import { Directions } from './Directions';
import { LocationSection } from './Location';

export function LocationContent() {
  return (
    <div className="space-y-8">
      <LocationSection />
      <AddressSection />
      <Directions />
    </div>
  );
}
