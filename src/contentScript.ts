import { raise } from './utils/raise';
import { Ticket, ticketScheme } from './utils/model';

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
  console.log(json);

  json.url = window.location.href.replace('export/', '');
  const ticket = ticketScheme.parse(json);

  // Add or update existing ticket in storage.
  const { tickets } = (await chrome.storage.local.get('tickets')) as {
    tickets: Ticket[];
  };

  const existingTicket = tickets.findIndex(
    (existingTicket) =>
      existingTicket.number === ticket.number &&
      existingTicket.repository === ticket.repository
  );

  // Ticket does not already exist
  if (existingTicket < 0) {
    // Add ticket to all tickets.
    await chrome.storage.local.set({
      tickets: [...tickets, ticket],
    });
  } else {
    // Update ticket in store.
    tickets[existingTicket] = ticket;
    await chrome.storage.local.set({
      tickets: [...tickets],
    });
  }
}

updateTicketInStore();
