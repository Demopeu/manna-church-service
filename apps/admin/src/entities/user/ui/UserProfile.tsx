import { Avatar, AvatarFallback } from '@/shared/ui';

interface Props {
  name: string;
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
