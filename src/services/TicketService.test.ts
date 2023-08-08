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

  describe('getTickets', () => {
    test('should get all tickets in storage', async () => {
      // Arrange
      const ticketsInStorage: Ticket[] = [
        {
          repository: 'any-repo',
          number: 1,
          title: 'any-title',
          ticketUrl: 'any-ticket-url',
          jsonUrl: 'any-json-url',
          numberOfChanges: 0,
        },
        {
          repository: 'any-repo',
          number: 2,
          title: 'any-title',
          ticketUrl: 'any-ticket-url',
          jsonUrl: 'any-json-url',
          numberOfChanges: 0,
        },
      ];
      const ticketRepository: TicketRepository = {
        getTickets: async () => ticketsInStorage,
        setTickets: jest.fn(),
      };
      const ticketService = new TicketService(ticketRepository);

      // Act
      const tickets = await ticketService.getTickets();

      // Assert
      expect(tickets).toEqual(ticketsInStorage);
    });
  });

  describe('removeTicket', () => {
    test('should remove ticket from storage', async () => {
      // Arrange
      const currentTicketsInStorage: Ticket[] = [
        {
          repository: 'any-repo',
          number: 1,
          title: 'any-title',
          ticketUrl: 'any-ticket-url',
          jsonUrl: 'any-json-url',
          numberOfChanges: 0,
        },
        {
          repository: 'any-repo',
          number: 2,
          title: 'any-title',
          ticketUrl: 'any-ticket-url',
          jsonUrl: 'any-json-url',
          numberOfChanges: 0,
        },
      ];
      const ticketRepository: TicketRepository = {
        getTickets: async () => currentTicketsInStorage,
        setTickets: jest.fn(),
      };
      const ticketService = new TicketService(ticketRepository);

      const expectedTicketsInStorage: Ticket[] = [
        {
          repository: 'any-repo',
          number: 1,
          title: 'any-title',
          ticketUrl: 'any-ticket-url',
          jsonUrl: 'any-json-url',
          numberOfChanges: 0,
        },
      ];

      // Act
      await ticketService.removeTicket('any-repo', 2);

      // Assert
      expect(ticketRepository.setTickets).toHaveBeenCalledWith(
        expectedTicketsInStorage
      );
    });
  });
});
