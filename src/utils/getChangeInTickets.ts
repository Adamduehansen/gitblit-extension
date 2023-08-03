import { Ticket } from './model';

interface NewTicketResult {
  type: 'NEW_TICKET';
  ticketNumber: number;
  ticketRepository: string;
  ticketUrl: string;
}

interface NewCommentResult {
  type: 'NEW_COMMENT';
  commentText: string;
}

type DifferenceResults = NewTicketResult | NewCommentResult;

export function getChangeInTickets(
  oldTickets: Ticket[],
  newTickets: Ticket[]
): DifferenceResults | null {
  const oldTicketNumbers = oldTickets.map((ticket) => ticket.number);
  const addedTickets = newTickets.filter(
    (newTicket) => !oldTicketNumbers.includes(newTicket.number)
  );

  if (addedTickets.length > 0) {
    return {
      type: 'NEW_TICKET',
      ticketNumber: addedTickets[0].number,
      ticketRepository: addedTickets[0].repository,
      ticketUrl: addedTickets[0].url,
    };
  }

  return null;
}
