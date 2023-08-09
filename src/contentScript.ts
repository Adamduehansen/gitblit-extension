import { z } from 'zod';
import { raise } from './utils/raise';
import { TicketRepository, TicketService } from './services/TicketService';
import {
  NotificationService,
  notificationRepository,
} from './services/NotificationService';

const ticketScheme = z.object({
  repository: z.string(),
  title: z.string(),
  number: z.number(),
  changes: z
    .object({
      comment: z
        .object({
          id: z.string(),
          text: z.string(),
        })
        .optional(),
    })
    .array(),
});

function getTicketJson(): unknown {
  try {
    const textContent =
      document.body.textContent ?? raise('textContent is null');
    return JSON.parse(textContent);
  } catch {
    throw new Error('This page does not contain JSON for a ticket!');
  }
}

interface CommentChange {
  comment: {
    id: string;
    text: string;
  };
}

function isCommentChange(change: unknown): change is CommentChange {
  return typeof change === 'object' && change !== null && 'comment' in change;
}

async function updateTicketInStore(): Promise<void> {
  const json = getTicketJson();
  const ticket = ticketScheme.parse(json);

  const ticketService = new TicketService(TicketRepository);
  const notificationService = new NotificationService(notificationRepository);

  const existingTicket = await ticketService.getTicket(
    ticket.repository,
    ticket.number
  );

  if (existingTicket === undefined) {
    ticketService.createTicket({
      repository: ticket.repository,
      number: ticket.number,
      title: ticket.title,
      ticketUrl: window.location.href.replace('export/', ''),
      jsonUrl: window.location.href,
      numberOfChanges: ticket.changes.length,
    });
    notificationService.createNotification({
      title: 'New ticket!',
      message: `${ticket.repository}/${ticket.number} has been registered.`,
      ticketRepository: ticket.repository,
      ticketNumber: ticket.number,
    });
    return;
  }

  const amountOfChanges =
    ticket.changes.length - existingTicket.numberOfChanges;

  if (amountOfChanges <= 0) {
    return;
  }

  const newChanges = ticket.changes.slice(-amountOfChanges);

  for (const change of newChanges) {
    if (isCommentChange(change)) {
      notificationService.createNotification({
        title: `${ticket.repository}/${ticket.number}: New comment!`,
        message: change.comment.text,
        ticketRepository: ticket.repository,
        ticketNumber: ticket.number,
      });
    }
  }

  await ticketService.updateTicket({
    repository: ticket.repository,
    number: ticket.number,
    title: ticket.title,
    ticketUrl: window.location.href.replace('export/', ''),
    jsonUrl: window.location.href,
    numberOfChanges: ticket.changes.length,
  });
}

updateTicketInStore();
