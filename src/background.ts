import { makeNotificationStorageChangeHandler } from './handlers/handleNotificationStorageChanges';
import { initializeStorage } from './handlers/initializeStorage';
import { reloadGitblitTabs } from './handlers/reloadTabsHandler';
import { makeStorageUpdatedLogger } from './handlers/storageUpdatedLogger';

chrome.alarms.create('refresh-tabs', {
  periodInMinutes: 1 / 2,
  delayInMinutes: 1 / 10,
});

chrome.alarms.onAlarm.addListener(reloadGitblitTabs);

// chrome.notifications.onClicked.addListener(createGitblitTab);

chrome.runtime.onInstalled.addListener(initializeStorage);

chrome.storage.onChanged.addListener(makeStorageUpdatedLogger());
chrome.storage.onChanged.addListener(makeNotificationStorageChangeHandler());
