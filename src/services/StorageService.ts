import { Ticket } from '../utils/model';

interface LocalStorage {
  tickets: Ticket[];
}

export interface StorageRepository {
  getTickets: () => Promise<Ticket[]>;
  setTickets: (tickets: Ticket[]) => Promise<void>;
}

type LocalStorageKeys = keyof LocalStorage;

export const ChromeStorageRepository: StorageRepository = {
  getTickets: async function (): Promise<Ticket[]> {
    const keys: LocalStorageKeys[] = ['tickets'];
    const { tickets } = await chrome.storage.local.get(keys);
    return tickets;
  },
  setTickets: async function (tickets: Ticket[]): Promise<void> {
    const storage: LocalStorage = {
      tickets: tickets,
    };
    await chrome.storage.local.set(storage);
  },
};

export class StorageService {
  constructor(private _storageRepository: StorageRepository) {}

  public async getTicket(
    repository: string,
    number: number
  ): Promise<Ticket | undefined> {
    const allTickets = await this._storageRepository.getTickets();

    return allTickets.find(
      (ticket) => ticket.repository === repository && ticket.number === number
    );
  }

  public async setTicket(ticket: Ticket): Promise<void> {
    const allTickets = await this._storageRepository.getTickets();
    let existingTicketIndex = allTickets.findIndex(
      this.findExistingTicket(ticket.repository, ticket.number)
    );

    if (existingTicketIndex < 0) {
      const updatedAllTickets = [...allTickets, ticket];
      await this._storageRepository.setTickets(updatedAllTickets);
      return;
    }

    allTickets[existingTicketIndex] = ticket;
    await this._storageRepository.setTickets(allTickets);
  }

  public async initializeStorage() {
    await this._storageRepository.setTickets([]);
  }

  private findExistingTicket(
    repository: string,
    number: number
  ): (ticket: Ticket) => boolean {
    return function (ticket: Ticket): boolean {
      return ticket.repository === repository && ticket.number === number;
    };
  }
}
