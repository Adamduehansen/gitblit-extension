export type Notification = {
  id: string;
  type: 'NEW_TICKET' | 'COMMENT_CHANGE';
  title: string;
  message: string;
  pushed: boolean;
  read: boolean;
};

type NotificationRepository = {
  getNotifications: () => Promise<Notification[]>;
  setNotifications: (notifications: Notification[]) => Promise<void>;
};

export const notificationRepository: NotificationRepository = {
  getNotifications: async function (): Promise<Notification[]> {
    const { notifications } = await chrome.storage.local.get('notifications');
    return notifications;
  },
  setNotifications: async function (
    notifications: Notification[]
  ): Promise<void> {
    return chrome.storage.local.set({
      notifications: notifications,
    });
  },
};

export class NotificationService {
  constructor(private _notificationRepository: NotificationRepository) {}

  async createNotification(
    notification: Omit<Notification, 'id'>
  ): Promise<void> {
    const notifications = await this._notificationRepository.getNotifications();
    const updatedNotifications: Notification[] = [
      ...notifications,
      {
        ...notification,
        id: crypto.randomUUID(),
      },
    ];
    return this._notificationRepository.setNotifications(updatedNotifications);
  }

  async setPushed(notificationId: string): Promise<void> {
    const notifications = await this._notificationRepository.getNotifications();
    const indexOfNotification = notifications.findIndex(
      (notification) => notification.id === notificationId
    );
    notifications[indexOfNotification].pushed = true;
    return this._notificationRepository.setNotifications([...notifications]);
  }
}
