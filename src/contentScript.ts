import { TicketScheme, type Ticket, getTicket } from './storage';

const messageTypes = ['NEW_COMMENT', 'NEW_REVISION'] as const;
type MessageType = (typeof messageTypes)[number];

async function sendMessage(type: MessageType) {
  await chrome.runtime.sendMessage({
    type: type,
  });
}

function raise(message: string): never {
  throw new Error(message);
}

function getTicketJson(): Ticket {
  try {
    const textContent =
      document.body.textContent ?? raise('textContent is null');
    console.log(textContent);

    const json = JSON.parse(textContent);
    console.log(json);

    return TicketScheme.parse(json);
  } catch {
    throw new Error('This page does not contain JSON for a ticket!');
  }
}

async function updateTicketInStore(): Promise<void> {
  const ticket = getTicketJson();

  const existingTicket = await getTicket(ticket.repository, ticket.number);

  sendMessage('NEW_COMMENT');
}

// sendMessage('NEW_COMMENT');
updateTicketInStore();
