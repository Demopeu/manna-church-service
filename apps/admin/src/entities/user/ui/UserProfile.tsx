import { Avatar, AvatarFallback, Skeleton } from '@/shared/ui';

interface Props {
  name: string;
}

export function ProfileSkeletion() {
  return (
    <>
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="hidden h-4 w-16 md:block" />
    </>
  );
}

export function UserProfile({ name }: Props) {
  return (
    <>
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
          {name.slice(0, 3)}
        </AvatarFallback>
      </Avatar>
      <span className="hidden text-sm font-medium md:inline">{name}</span>
    </>
  );
}
