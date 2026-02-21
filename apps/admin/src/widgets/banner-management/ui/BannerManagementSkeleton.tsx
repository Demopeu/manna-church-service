import { ImageIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@/shared/ui';
import { BANNER_MANAGEMENT_UI } from './labels';

export function BannerManagementSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          {BANNER_MANAGEMENT_UI.TITLE}
        </CardTitle>
        <CardDescription>
          {BANNER_MANAGEMENT_UI.DESCRIPTION_LINE1}
          <br />
          {BANNER_MANAGEMENT_UI.DESCRIPTION_LINE2_FN(
            0,
            BANNER_MANAGEMENT_UI.MAX_BANNERS,
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex gap-4 rounded-lg border p-4">
            <Skeleton className="mt-7 h-5 w-5" />
            <Skeleton className="h-20 w-32 shrink-0 rounded-md" />
            <div className="flex-1 space-y-2 pt-1">
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
            <Skeleton className="mt-1 h-8 w-8 rounded-md" />
          </div>
        ))}
        <Skeleton className="h-32 w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}
