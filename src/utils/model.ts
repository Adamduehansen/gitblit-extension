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

export const ticketsScheme = ticketScheme.array();
export type Tickets = z.infer<typeof ticketsScheme>;

export type NewTicketMessage = {
  type: 'NEW_TICKET';
  ticket: Ticket;
};

export type NewCommentMessage = {
  type: 'NEW_COMMENT';
  ticketRepository: string;
  ticketNumber: number;
  comment: string;
};

export type Message = NewTicketMessage | NewCommentMessage;
