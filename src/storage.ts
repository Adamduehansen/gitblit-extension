import { z } from 'zod';

export const TicketScheme = z.object({
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

export type Ticket = z.infer<typeof TicketScheme>;

interface LocalStorage {
  tickets: Ticket[];
}

type LocalStorageKeys = keyof LocalStorage;

export async function getTicket(
  repository: string,
  number: number
): Promise<Ticket | null> {
  const keys: LocalStorageKeys[] = ['tickets'];
  const { tickets } = await chrome.storage.local.get(keys);
  console.log(tickets);
  return null;
}
