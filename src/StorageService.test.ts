import { StorageRepository, StorageService, Ticket } from './StorageService';

describe('storage', () => {
  describe('StorageService', () => {
    describe('getTicket', () => {
      test('should return ticket if in repository', async () => {
        // Arrange
        const repository: StorageRepository = {
          getTickets: async () => [
            {
              repository: 'any-repo',
              number: 1,
              changes: [],
              title: 'any-title',
            },
          ],
          setTickets: async () => {},
        };
        const storageService = new StorageService(repository);

        // Act
        const ticket = await storageService.getTicket('any-repo', 1);

        // Assert
        expect(ticket).not.toBeUndefined();
      });

      test('should return undefined if in not repository', async () => {
        // Arrange
        const repository: StorageRepository = {
          getTickets: async () => [],
          setTickets: async () => {},
        };
        const storageService = new StorageService(repository);

        // Act
        const ticket = await storageService.getTicket('any-repo', 1);

        // Assert
        expect(ticket).toBeUndefined();
      });
    });

    describe('initializeStorage', () => {
      test('should call setTickets from repository', async () => {
        // Arrange
        const repository: StorageRepository = {
          getTickets: async () => [],
          setTickets: jest.fn(),
        };
        const storageService = new StorageService(repository);

        // Act
        await storageService.initializeStorage();

        // Assert
        expect(repository.setTickets).toHaveBeenCalled();
      });
    });

    describe('setTicket', () => {
      test('should add ticket with repository', async () => {
        // Arrange
        const ticketInStorage: Ticket = {
          repository: 'any-repo',
          number: 1,
          changes: [],
          title: 'any-title',
        };
        const repository: StorageRepository = {
          getTickets: async () => [ticketInStorage],
          setTickets: jest.fn(),
        };
        const storageService = new StorageService(repository);
        const ticket: Ticket = {
          repository: 'any-repo',
          number: 2,
          changes: [],
          title: 'any-title',
        };

        // Act
        await storageService.setTicket(ticket);

        // Assert
        expect(repository.setTickets).toHaveBeenCalledWith([
          ticketInStorage,
          ticket,
        ]);
      });
    });
  });
});
