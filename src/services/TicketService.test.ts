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

  describe('addTicket', () => {
    test('should add ticket to storage', async () => {
      // Arrange
      const ticketInStorage: Ticket = {
        repository: 'any-repo',
        number: 1,
        title: 'any-title',
        changes: [],
        url: 'any-url',
      };
      const ticketRepository: TicketRepository = {
        getTickets: jest.fn(async () => [ticketInStorage]),
        setTickets: jest.fn(),
      };
      const ticketService = new TicketService(ticketRepository);

      const ticketToAdd: Ticket = {
        repository: 'any-repo',
        number: 2,
        title: 'any-title',
        changes: [],
        url: 'any-url',
      };

      // Act
      await ticketService.addTicket(ticketToAdd);

      // Assert
      expect(ticketRepository.setTickets).toHaveBeenCalledWith([
        ticketInStorage,
        ticketToAdd,
      ]);
    });
  });
});
