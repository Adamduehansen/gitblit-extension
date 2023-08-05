import { raise } from './utils/raise';
import { NewTicketMessage, Ticket, ticketScheme } from './utils/model';

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

  const { tickets } = (await chrome.storage.local.get('tickets')) as {
    tickets: Ticket[];
  };

  const existingTicket = tickets.find(
    (existingTicket) =>
      existingTicket.number === ticket.number &&
      existingTicket.repository === ticket.repository
  );

  if (existingTicket === undefined) {
    const newTicketMessage: NewTicketMessage = {
      type: 'NEW_TICKET',
      ticket: ticket,
    };
    chrome.runtime.sendMessage(newTicketMessage);
  }

  // Further checks
}

updateTicketInStore();
