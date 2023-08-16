import {
  CreateNotification,
  NotificationRepository,
  NotificationService,
} from './NotificationService';

describe('NotificationService', () => {
  describe('createNotification', () => {
    test('should add notification to storage', async () => {
      // Arrange
      const testRepository: NotificationRepository = {
        getNotifications: async () => [],
        setNotifications: jest.fn(),
      };

      const notificationService = new NotificationService(testRepository);

      const notificationToCreate: CreateNotification = {
        title: 'any-title',
        message: 'any-message',
        ticketRepository: 'any-ticket-repository',
        ticketNumber: 1,
      };

      // Act
      await notificationService.createNotification(notificationToCreate);

      // Assert
      expect(testRepository.setNotifications).toHaveBeenCalled();
    });
  });
});
