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
    const newTicketMessage: NewTicketMessage = {
      type: 'NEW_TICKET',
      ticket: ticket,
    };
    chrome.runtime.sendMessage(newTicketMessage);
    return;
  }

  const amountOfChanges = ticket.changes.length - existingTicket.changes.length;
  if (amountOfChanges < 0) {
    return;
  }

  const changes = ticket.changes.splice(-amountOfChanges);
  for (const change of changes) {
    if (change.comment !== undefined) {
      const newCommentMessage: NewCommentMessage = {
        type: 'NEW_COMMENT',
        ticketRepository: ticket.repository,
        ticketNumber: ticket.number,
        comment: change.comment.text,
      };
      chrome.runtime.sendMessage(newCommentMessage);
    }
  }
}

updateTicketInStore();
