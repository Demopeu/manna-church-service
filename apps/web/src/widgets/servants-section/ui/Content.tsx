import { ROLES, getAllServants } from '@/entities/servant';
import { AssociatePastorList } from './AssociatePastor';
import { DistrictLeaderList } from './DistrictLeader';
import { LeadPastorSection } from './LeadPastor';
import { LeaderPastor } from './data';

export async function ServantsContent() {
  const allServants = await getAllServants();

  const leadPastor =
    allServants.find((s) => s.role === ROLES.SENIOR) || LeaderPastor;
  const associatePastors = allServants.filter(
    (s) => s.role === ROLES.ASSOCIATE,
  );
  const districtLeaders = allServants.filter((s) => s.role === ROLES.DISTRICT);

  return (
    <div className="space-y-12">
      <LeadPastorSection data={leadPastor} />
      <AssociatePastorList pastors={associatePastors} />
      <DistrictLeaderList leaders={districtLeaders} />
    </div>
  );
}
