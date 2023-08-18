import {
  CreateNotification,
  Notification,
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

  describe('createNotifications', () => {
    test('should create multiple notifications at onw time', async () => {
      // Arrange
      const testRepository: NotificationRepository = {
        getNotifications: async () => [],
        setNotifications: jest.fn(),
      };

      const notificationService = new NotificationService(testRepository);

      // Act
      await notificationService.createNotifications([]);

      // Assert
      expect(testRepository.setNotifications).toHaveBeenCalled();
    });
  });

  describe('setPushed', () => {
    test('should set a notification as pushed', async () => {
      // Arrange
      const notificationInStorage: Notification = {
        id: 'any-id',
        title: 'any-title',
        message: 'any-message',
        pushed: false,
        read: false,
        ticketRepository: 'any-repository',
        ticketNumber: 1,
      };
      let notificationsInStorage: Notification[] = [notificationInStorage];
      const testRepository: NotificationRepository = {
        getNotifications: async () => notificationsInStorage,
        setNotifications: async (newNotifications) => {
          notificationsInStorage = newNotifications;
        },
      };

      const notificationService = new NotificationService(testRepository);

      // Act
      await notificationService.setPushed('any-id');

      // Assert
      expect(notificationInStorage.pushed).toEqual(true);
    });
  });

  describe('setRead', () => {
    test('should set a notifaction as read', async () => {
      // Arrange
      const notificationInStorage: Notification = {
        id: 'any-id',
        title: 'any-title',
        message: 'any-message',
        pushed: false,
        read: false,
        ticketRepository: 'any-repository',
        ticketNumber: 1,
      };
      let notificationsInStorage: Notification[] = [notificationInStorage];
      const testRepository: NotificationRepository = {
        getNotifications: async () => notificationsInStorage,
        setNotifications: async (newNotifications) => {
          notificationsInStorage = newNotifications;
        },
      };

      const notificationService = new NotificationService(testRepository);

      // Act
      await notificationService.setRead('any-id');

      // Assert
      expect(notificationInStorage.read).toEqual(true);
    });
  });

  describe('getNotifications', () => {
    test('should return all notifications in storage', async () => {
      // Arrange;
      let notificationsInStorage: Notification[] = [
        {
          id: 'any-id-1',
          title: 'any-title-1',
          message: 'any-message-1',
          pushed: false,
          read: false,
          ticketRepository: 'any-repository-1',
          ticketNumber: 1,
        },
        {
          id: 'any-id-2',
          title: 'any-title-2',
          message: 'any-message-2',
          pushed: false,
          read: false,
          ticketRepository: 'any-repository-2',
          ticketNumber: 1,
        },
      ];
      const testRepository: NotificationRepository = {
        getNotifications: async () => notificationsInStorage,
        setNotifications: async (newNotifications) => {
          notificationsInStorage = newNotifications;
        },
      };

      const notificationService = new NotificationService(testRepository);

      // Act
      const notifications = await notificationService.getNotifications();

      // Assert
      expect(notifications).toEqual(notificationsInStorage);
    });
  });
});
