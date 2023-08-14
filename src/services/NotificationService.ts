export type Notification = {
  id: string;
  title: string;
  message: string;
  pushed: boolean;
  read: boolean;
  ticketRepository: string;
  ticketNumber: number;
};

export type CreateNotification = Pick<
  Notification,
  'title' | 'message' | 'ticketRepository' | 'ticketNumber'
>;

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

  async createNotification(newNotification: CreateNotification): Promise<void> {
    const notifications = await this._notificationRepository.getNotifications();
    const updatedNotifications: Notification[] = [
      ...notifications,
      {
        ...newNotification,
        id: crypto.randomUUID(),
        read: false,
        pushed: false,
      },
    ];
    return this._notificationRepository.setNotifications(updatedNotifications);
  }

  async createNotifications(
    newNotifications: CreateNotification[]
  ): Promise<void> {
    const notifications = await this._notificationRepository.getNotifications();
    const updatedNotifications: Notification[] = [
      ...notifications,
      ...newNotifications.map((notification) => {
        return {
          ...notification,
          id: crypto.randomUUID(),
          read: false,
          pushed: false,
        };
      }),
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

  async setRead(notificationId: string): Promise<void> {
    const notifications = await this._notificationRepository.getNotifications();
    const indexOfNotification = notifications.findIndex(
      (notification) => notification.id === notificationId
    );
    notifications[indexOfNotification].read = true;
    return this._notificationRepository.setNotifications([...notifications]);
  }

  async getNotifications(
    ticketRepository?: string,
    ticketNumber?: number
  ): Promise<Notification[]> {
    const notifications = await this._notificationRepository.getNotifications();
    if (ticketRepository === undefined || ticketNumber === undefined) {
      return notifications;
    }

    return notifications.filter(
      (notification) =>
        notification.ticketRepository === ticketRepository &&
        notification.ticketNumber === ticketNumber
    );
  }
}
