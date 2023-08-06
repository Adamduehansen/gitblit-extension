import { raise } from './utils/raise';
import {
  NewCommentMessage,
  NewTicketMessage,
  ticketScheme,
} from './utils/model';
import { TicketRepository, TicketService } from './services/TicketService';

function getTicketJson(): any {
  try {
    const textContent =
      document.body.textContent ?? raise('textContent is null');
    return JSON.parse(textContent);
  } catch {
    throw new Error('This page does not contain JSON for a ticket!');
  }
}

async function updateTicketInStore(): Promise<void> {
  const json = getTicketJson();
  json.url = window.location.href.replace('export/', '');
  const ticket = ticketScheme.parse(json);

  const ticketService = new TicketService(TicketRepository);
  const existingTicket = await ticketService.getTicket(
    ticket.repository,
    ticket.number
  );

  if (existingTicket === undefined) {
    ticketService.addTicket(ticket);
    // changeService.addChanges(ticket.repository, ticket.number, ticket.changes);
    return;
  }

  // const amountOfChanges = ticket.changes.length - existingTicket.changes.length;
  // if (amountOfChanges < 0) {
  //   return;
  // }

  // const changes = ticket.changes.splice(-amountOfChanges);
  // for (const change of changes) {
  //   if (change.comment !== undefined) {
  //     changeService.addChange(ticket.repository, ticket.number, change);
  //   }
  // }
}

updateTicketInStore();
