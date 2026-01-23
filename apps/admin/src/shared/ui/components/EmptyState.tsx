import type { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function EmptyState({ icon: Icon, title, description }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-muted mb-4 rounded-full p-4">
        <Icon className="text-muted-foreground h-8 w-8" />
      </div>
      <h3 className="text-foreground mb-1 text-lg font-medium">{title}</h3>
      <p className="text-muted-foreground max-w-sm text-sm text-balance break-keep">
        {description}
      </p>
    </div>
  );
}
