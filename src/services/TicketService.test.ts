import { Ticket, TicketRepository, TicketService } from './TicketService';

describe('TicketService', () => {
  describe('getTicket', () => {
    test('should return ticket by repository and number', async () => {
      // Arrange
      const ticketInStorage: Ticket = {
        repository: 'any-repo',
        number: 1,
        title: 'any-title',
        ticketUrl: 'any-ticket-url',
        jsonUrl: 'any-json-url',
        numberOfChanges: 0,
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
        ticketUrl: 'any-ticket-url',
        jsonUrl: 'any-json-url',
        numberOfChanges: 0,
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
        ticketUrl: 'any-ticket-url',
        jsonUrl: 'any-json-url',
        numberOfChanges: 0,
      };

      // Act
      await ticketService.createTicket(ticketToAdd);

      // Assert
      expect(ticketRepository.setTickets).toHaveBeenCalledWith([
        ticketInStorage,
        ticketToAdd,
      ]);
    });
  });

  describe('updateTicket', () => {
    test('should update ticket in storage', async () => {
      // Arrange
      const ticketInStorage: Ticket = {
        repository: 'any-repo',
        number: 1,
        title: 'any-title',
        ticketUrl: 'any-ticket-url',
        jsonUrl: 'any-json-url',
        numberOfChanges: 0,
      };
      const ticketRepository: TicketRepository = {
        getTickets: async () => [ticketInStorage],
        setTickets: jest.fn(),
      };
      const ticketService = new TicketService(ticketRepository);

      const updatedTicket: Ticket = {
        repository: 'any-repo',
        number: 1,
        title: 'any-title',
        ticketUrl: 'any-ticket-url',
        jsonUrl: 'any-json-url',
        numberOfChanges: 1,
      };

      // Act
      await ticketService.updateTicket(updatedTicket);

      // Assert
      expect(ticketRepository.setTickets([updatedTicket]));
    });
  });
});
