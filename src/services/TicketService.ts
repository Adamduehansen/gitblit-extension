interface Ticket {
  repository: string;
  number: number;
  title: string;
  url: string;
}

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

  async addTicket(ticket: Ticket): Promise<void> {
    const allTickets = await this._ticketRepository.getTickets();
    await this._ticketRepository.setTickets([...allTickets, ticket]);
  }
}
