import {
  Notification,
  NotificationService,
  notificationRepository,
} from '../services/NotificationService';
import { StorageOnChangeHandler } from '../utils/model';

export function makeNotificationStorageChangeHandler(): StorageOnChangeHandler {
  return function (changes) {
    for (let [key, { newValue }] of Object.entries(changes)) {
      if (key !== 'notifications') {
        continue;
      }

      const notifications = newValue as Notification[];

      const notificationService = new NotificationService(
        notificationRepository
      );

      for (const notification of notifications) {
        if (notification.pushed) {
          continue;
        }

        chrome.notifications.create({
          iconUrl: './images/gitblit-icon.png',
          title: notification.title,
          message: notification.message.toString(),
          type: 'basic',
        });

        notificationService.setPushed(notification.id);
      }

      const numberOfNotifications = notifications.filter(
        (notification) => !notification.read
      ).length;

      chrome.action.setBadgeText({
        text: numberOfNotifications > 0 ? numberOfNotifications.toString() : '',
      });
    }
  };
}
