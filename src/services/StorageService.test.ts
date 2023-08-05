import { StorageRepository, StorageService } from './StorageService';
import { Change, Ticket } from '../utils/model';

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
          getChanges: async () => [],
          setChanges: async () => {},
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
          getChanges: async () => [],
          setChanges: async () => {},
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
          getChanges: async () => [],
          setChanges: async () => {},
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
          getChanges: async () => [],
          setChanges: async () => {},
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
          getChanges: async () => [],
          setChanges: async () => {},
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

    describe('addChange', () => {
      test('should add change to storage', async () => {
        // Arrange
        const change: Change = {
          repository: 'any-repository',
          number: 1,
          comment: {
            id: 'any-comment-id',
            text: 'any-text',
          },
        };

        const repository: StorageRepository = {
          getTickets: async () => [],
          setTickets: async () => {},
          getChanges: jest.fn(async () => []),
          setChanges: jest.fn(),
        };

        // Act
        const storageService = new StorageService(repository);
        await storageService.addChange(change);

        // Assert
        expect(repository.getChanges).toHaveBeenCalled();
        expect(repository.setChanges).toHaveBeenCalledWith([change]);
      });
    });
  });
});
