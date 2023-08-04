import { StorageRepository, StorageService } from './StorageService';
import { Ticket } from '../utils/model';

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

              title: 'any-title',
              url: 'any-url',
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
      test('should add new ticket with repository', async () => {
        // Arrange
        const ticketInStorage: Ticket = {
          repository: 'any-repo',
          number: 1,

          title: 'any-title',
          url: 'any-url',
        };
        const repository: StorageRepository = {
          getTickets: async () => [ticketInStorage],
          setTickets: jest.fn(),
        };
        const storageService = new StorageService(repository);
        const ticket: Ticket = {
          repository: 'any-repo',
          number: 2,

          title: 'any-title',
          url: 'any-url',
        };

        // Act
        await storageService.setTicket(ticket);

        // Assert
        expect(repository.setTickets).toHaveBeenCalledWith([
          ticketInStorage,
          ticket,
        ]);
      });

      test('should update ticket in storage', async () => {
        // Arrange
        const repository: StorageRepository = {
          getTickets: async () => [
            {
              repository: 'any-repo',
              number: 1,

              title: 'any-title',
              url: 'any-url',
            },
          ],
          setTickets: jest.fn(),
        };

        const storageService = new StorageService(repository);
        const updatedTicket: Ticket = {
          repository: 'any-repo',
          number: 1,
          title: 'any-title',
          url: 'any-url',
        };

        // Act
        await storageService.setTicket(updatedTicket);

        // Assert
        expect(repository.setTickets).toHaveBeenCalledWith([updatedTicket]);
      });
    });
  });
});
