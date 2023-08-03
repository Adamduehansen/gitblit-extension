import {
  StorageService,
  ChromeStorageRepository,
} from './services/StorageService';
import { type Ticket, ticketSchema } from './utils/model';
import { raise } from './utils/raise';

function getTicketJson(): Ticket {
  try {
    const textContent =
      document.body.textContent ?? raise('textContent is null');
    const json = JSON.parse(textContent);
    json.url = window.location.href.replace('export/', '');
    return ticketSchema.parse(json);
  } catch {
    throw new Error('This page does not contain JSON for a ticket!');
  }
}

async function updateTicketInStore(): Promise<void> {
  const ticket = getTicketJson();
  const storageService = new StorageService(ChromeStorageRepository);
  await storageService.setTicket(ticket);
}

updateTicketInStore();
