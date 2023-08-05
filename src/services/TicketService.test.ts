import { Ticket } from '../utils/model';
import { TicketRepository, TicketService } from './TicketService';

describe('TicketService', () => {
  describe('getTicket', () => {
    test('should return ticket by repository and number', async () => {
      // Arrange
      const ticketInStorage: Ticket = {
        repository: 'any-repo',
        number: 1,
        title: 'any-title',
        changes: [],
        url: 'any-url',
      };
      const ticketRepository: TicketRepository = {
        getTickets: async () => [ticketInStorage],
        setTickets: async () => {},
      };
      const ticketService = new TicketService(ticketRepository);

      // Act
      const actualTicket = await ticketService.getTicket('any-repo', 1);

      // Assert
      expect(actualTicket).not.toBeUndefined();
      expect(actualTicket).toEqual(ticketInStorage);
    });
  });

  describe('getTickets', () => {
    test('should return all tickets in storage', async () => {
      // Arrange
      const ticketsInStorage: Ticket[] = [
        {
          repository: 'any-repo',
          number: 1,
          title: 'any-title',
          changes: [],
          url: 'any-url',
        },
      ];
      const ticketRepository: TicketRepository = {
        getTickets: async () => ticketsInStorage,
        setTickets: async () => {},
      };
      const ticketService = new TicketService(ticketRepository);

      // Act
      const actualTickets = await ticketService.getTickets();

      // Assert
      expect(actualTickets).toEqual(ticketsInStorage);
    });
  });

  describe('setTickets', () => {
    test('should set tickets in storage', async () => {
      // Arrange
      const tickets: Ticket[] = [
        {
          repository: 'any-repo',
          number: 1,
          title: 'any-title',
          changes: [],
          url: 'any-url',
        },
      ];
      const ticketRepository: TicketRepository = {
        getTickets: async () => [],
        setTickets: jest.fn(),
      };

      const ticketService = new TicketService(ticketRepository);

      // Act
      await ticketService.setTickets(tickets);

      // Assert
      expect(ticketRepository.setTickets).toHaveBeenCalledWith(tickets);
    });
  });
});
