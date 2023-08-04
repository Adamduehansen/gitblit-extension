import { z } from 'zod';
import {
  StorageService,
  ChromeStorageRepository,
} from './services/StorageService';
import { raise } from './utils/raise';

function getTicketJson(): unknown {
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

  const gitblitTicketScheme = z.object({
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

  const gitblitTicket = gitblitTicketScheme.parse(json);

  const storageService = new StorageService(ChromeStorageRepository);

  await storageService.setTicket({
    repository: gitblitTicket.repository,
    number: gitblitTicket.number,
    title: gitblitTicket.title,
    url: window.location.href.replace('export/', ''),
  });
}

updateTicketInStore();
