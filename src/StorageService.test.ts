import { StorageRepository, StorageService } from './StorageService';

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
        const ticket = await storageService.get('any-repo', 1);

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
        const ticket = await storageService.get('any-repo', 1);

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
  });
});
