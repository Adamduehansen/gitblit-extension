import { Ticket } from './model';

export interface NewTicketResult {
  type: 'NEW_TICKET';
  ticketNumber: number;
  ticketRepository: string;
  ticketUrl: string;
}

export interface NewCommentResult {
  type: 'NEW_COMMENT';
  ticketNumber: number;
  ticketRepository: string;
  ticketUrl: string;
  commentText: string;
}

type DifferenceResults = NewTicketResult | NewCommentResult;

export function getChangeInTickets(
  oldTickets: Ticket[],
  newTickets: Ticket[]
): DifferenceResults | null {
  if (newTickets.length > oldTickets.length) {
    const addedTicket = newTickets.at(-1)!;
    return {
      type: 'NEW_TICKET',
      ticketNumber: addedTicket.number,
      ticketRepository: addedTicket.repository,
      ticketUrl: addedTicket.url,
    };
  }

  // Check for new comment on ticket
  for (const newTicket of newTickets) {
    const matchingOldTicket = oldTickets.find(
      (oldTicket) =>
        oldTicket.repository === newTicket.repository &&
        oldTicket.number === newTicket.number
    );

    if (matchingOldTicket === undefined) {
      continue;
    }

    const oldComments = matchingOldTicket.changes.filter(
      (change) => change.comment
    );
    const newCommments = newTicket.changes.filter((change) => change.comment);

    if (newCommments.length > oldComments.length) {
      return {
        type: 'NEW_COMMENT',
        ticketNumber: newTicket.number,
        ticketRepository: newTicket.repository,
        ticketUrl: newTicket.url,
        commentText: newCommments.at(-1)!.comment!.text.substring(0, 30),
      };
    }
  }

  return null;
}
