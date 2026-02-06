import { Suspense } from 'react';
import { getMyProfile } from '@/entities/user';
import { ProfileSkeletion, UserProfile } from '@/entities/user';
import { HeaderClient } from './HeaderClient';

async function AsyncUserProfile() {
  const profile = await getMyProfile();
  return <UserProfile name={profile.name?.display_name || '관리자'} />;
}

export function MainHeader() {
  return (
    <HeaderClient
      profileSlot={
        <Suspense fallback={<ProfileSkeletion />}>
          <AsyncUserProfile />
        </Suspense>
      }
    />
  );
}
