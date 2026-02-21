import { getBanners } from '@/entities/banner';
import { withAsyncBoundary } from '@/shared/ui';
import { BannerManagementClient } from './BannerManagementClient';
import { BannerManagementError } from './BannerManagementError';
import { BannerManagementSkeleton } from './BannerManagementSkeleton';

async function BannerManagementList() {
  const banners = await getBanners();
  return <BannerManagementClient banners={banners} />;
}

export const BannerManagement = withAsyncBoundary(BannerManagementList, {
  loadingFallback: <BannerManagementSkeleton />,
  errorFallback: <BannerManagementError />,
});
