interface Props {
  isUrgent: boolean;
  title: string;
  content: string;
}

export function AnnouncementsItem({ isUrgent, title, content }: Props) {
  return (
    <>
      <div className="flex items-center gap-2">
        {isUrgent && (
          <span className="bg-destructive/10 text-destructive inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium">
            긴급
          </span>
        )}
        <h3 className="truncate font-medium">{title}</h3>
      </div>
      <p className="text-muted-foreground line-clamp-2 text-sm">{content}</p>
    </>
  );
}
