'use client';

import { TableRow, TableCell } from '@/shared/ui';
import { EditEventButton, DeleteEventButton } from '@/features/event';
import { Event } from '@/entities/event';
import { ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface Props {
  event: Event;
}

export function EventsItem({ event }: Props) {
  return (
    <TableRow key={event.id}>
      <TableCell>
        {event.photoUrl ? (
          <Image
            src={event.photoUrl}
            alt={event.title}
            className="h-16 w-16 rounded-lg object-cover"
            width={64}
            height={64}
          />
        ) : (
          <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-lg">
            <ImageIcon className="text-muted-foreground h-6 w-6" />
          </div>
        )}
      </TableCell>
      <TableCell className="font-medium">{event.title}</TableCell>
      <TableCell className="text-muted-foreground">
        <span className="line-clamp-2">{event.description}</span>
      </TableCell>
      <TableCell>{event.startDate}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <EditEventButton event={event} />
          <DeleteEventButton eventId={event.id} eventTitle={event.title} />
        </div>
      </TableCell>
    </TableRow>
  );
}
