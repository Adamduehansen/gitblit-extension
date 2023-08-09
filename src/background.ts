import { createGitblitTab } from './handlers/createGitblitTab';
import { initializeStorage } from './handlers/initializeStorage';
import { reloadGitblitTabs } from './handlers/reloadTabsHandler';
import {
  Notification,
  NotificationService,
  notificationRepository,
} from './services/NotificationService';

chrome.alarms.create('refresh-tabs', {
  periodInMinutes: 1 / 2,
  delayInMinutes: 1 / 10,
});

chrome.alarms.onAlarm.addListener(reloadGitblitTabs);

// chrome.notifications.onClicked.addListener(createGitblitTab);

chrome.runtime.onInstalled.addListener(initializeStorage);

function handleNotificationChanges(key: string, notifications: Notification[]) {
  if (key !== 'notifications') {
    return;
  }

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
}

chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Key "${key}" in "${namespace}" changed.`,
      { oldValue },
      { newValue }
    );

    handleNotificationChanges(key, newValue);
  }
});
