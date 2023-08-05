import { Ticket } from '../utils/model';

export interface TicketRepository {
  getTickets: () => Promise<Ticket[]>;
  setTickets: (tickets: Ticket[]) => Promise<void>;
}

export const TicketRepository: TicketRepository = {
  getTickets: async function () {
    const { tickets } = (await chrome.storage.local.get('tickets')) as {
      tickets: Ticket[];
    };
    return tickets;
  },
  setTickets: async function (tickets: Ticket[]) {
    await chrome.storage.local.set({
      tickets: [...tickets],
    });
  },
};

export class TicketService {
  constructor(private _ticketRepository: TicketRepository) {}

  async getTicket(
    repository: string,
    number: number
  ): Promise<Ticket | undefined> {
    const tickets = await this._ticketRepository.getTickets();
    return tickets.find(
      (ticket) => ticket.repository === repository && ticket.number === number
    );
  }

  async getTickets(): Promise<Ticket[]> {
    return this._ticketRepository.getTickets();
  }

  async setTickets(tickets: Ticket[]): Promise<void> {
    return this._ticketRepository.setTickets(tickets);
  }
}
