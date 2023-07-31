import { z } from 'zod';

export type CreateMessageOptions = Required<
  Pick<chrome.notifications.NotificationOptions, 'message' | 'title'>
> & {
  onClickUrl: string;
};

export const TicketSchema = z.object({
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

export type Ticket = z.infer<typeof TicketSchema>;
