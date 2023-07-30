import {
  type Ticket,
  TicketScheme,
  StorageService,
  ChromeStorageRepository,
} from './StorageService';
import type { CreateMessageOptions } from './model';
import { raise } from './raise';

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
    return TicketScheme.parse(json);
  } catch {
    throw new Error('This page does not contain JSON for a ticket!');
  }
}

async function updateTicketInStore(): Promise<void> {
  const ticket = getTicketJson();

  const storageService = new StorageService(ChromeStorageRepository);
  const existingTicket = await storageService.getTicket(
    ticket.repository,
    ticket.number
  );

  if (existingTicket === undefined) {
    await storageService.setTicket(ticket);
    sendMessageToBackground({
      title: 'Ticket created!',
      message: `Ticket "${ticket.number}" is created for "${ticket.repository}"`,
    });
  }
}

updateTicketInStore();
