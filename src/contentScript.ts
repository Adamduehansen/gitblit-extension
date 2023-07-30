import {
  StorageService,
  ChromeStorageRepository,
} from './services/StorageService';
import {
  type CreateMessageOptions,
  type Ticket,
  TicketSchema,
} from './utils/model';
import { getChangeDifferences } from './utils/getChangeDifferences';
import { raise } from './utils/raise';

async function sendMessageToBackground(
  createMessageOptions: CreateMessageOptions
) {
  await chrome.runtime.sendMessage(createMessageOptions);
}

function getTicketJson(): Ticket {
  try {
    const textContent =
      document.body.textContent ?? raise('textContent is null');
    const json = JSON.parse(textContent);
    return TicketSchema.parse(json);
  } catch {
    throw new Error('This page does not contain JSON for a ticket!');
  }
}

async function updateTicketInStore(): Promise<void> {
  const ticket = getTicketJson();

  const existingTicket = await storageService.getTicket(
    ticket.repository,
    ticket.number
  );

  await storageService.setTicket(ticket);

  if (existingTicket === undefined) {
    sendMessageToBackground({
      title: 'Ticket created!',
      message: `Ticket "${ticket.number}" is created for "${ticket.repository}"`,
    });
    return;
  }

  const result = getChangeDifferences(existingTicket, ticket);
  if (result.hasNewComments) {
    sendMessageToBackground({
      title: 'New Comment!',
      message: `Ticket "${ticket.number}" on "${ticket.repository}" was added a comment`,
    });
  }
}

const storageService = new StorageService(ChromeStorageRepository);

updateTicketInStore();
