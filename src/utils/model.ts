import { z } from 'zod';

export const changeSchema = z.object({
  comment: z
    .object({
      id: z.string(),
      text: z.string(),
    })
    .optional(),
});

export const changesSchema = z.array(changeSchema);
export type Change = z.infer<typeof changeSchema>;

export const ticketSchema = z.object({
  repository: z.string(),
  title: z.string(),
  number: z.number(),
  url: z.string(),
});

export const ticketsSchema = z.array(ticketSchema);
export type Ticket = z.infer<typeof ticketSchema>;
