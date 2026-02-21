'use client';

import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import { DeleteEventButton, EditEventButton } from '@/features/event';
import { Event } from '@/entities/event';
import { Button, ImageDialog, TableCell, TableRow } from '@/shared/ui';

interface Props {
  event: Event;
}

export function EventsItem({ event }: Props) {
  return (
    <TableRow key={event.id}>
      <TableCell>
        {event.photoUrl ? (
          <ImageDialog src={event.photoUrl} alt={event.title}>
            <Button
              variant="ghost"
              className="relative h-16 w-16 rounded-lg p-0 hover:opacity-75 focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <Image
                src={event.photoUrl}
                alt={event.title}
                fill
                className="rounded-lg object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </Button>
          </ImageDialog>
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
