import { z } from 'zod';

export const ticketScheme = z.object({
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
  url: z.string(),
});

export type Ticket = z.infer<typeof ticketScheme>;
