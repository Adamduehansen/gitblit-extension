import {
  Notification,
  NotificationService,
  notificationRepository,
} from '../services/NotificationService';

type StorageOnChangeHandler = (changes: {
  [key: string]: chrome.storage.StorageChange;
}) => void;

const handleNotificationStorageChange: StorageOnChangeHandler = function (
  changes
) {
  for (let [key, { newValue }] of Object.entries(changes)) {
    if (key !== 'notifications') {
      continue;
    }

    const notifications = newValue as Notification[];

    const notificationService = new NotificationService(notificationRepository);

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

    chrome.action.setBadgeText({
      text: notifications
        .filter((notification) => !notification.read)
        .length.toString(),
    });
  }
};

export function makeNotificationStorageChangeHandler(): StorageOnChangeHandler {
  return handleNotificationStorageChange;
}
