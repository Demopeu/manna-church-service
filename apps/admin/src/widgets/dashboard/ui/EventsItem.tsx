interface Props {
  title: string;
  startDate: string;
  endDate: string;
}

export function EventsItem({ title, startDate, endDate }: Props) {
  return (
    <>
      <h3 className="font-medium">{title}</h3>
      <p className="text-muted-foreground text-sm">
        {startDate} ~ {endDate}
      </p>
    </>
  );
}
