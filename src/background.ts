import { handleTicketChangeInStorage } from './handlers/handleTicketChangeInStorage';
import { openTicketFromNotificationHandler } from './handlers/openTicketFromNotificationHandler';
import { reloadGitblitTabs } from './handlers/reloadTabsHandler';
import { initializeStorage } from './utils/initializeStorage';

chrome.alarms.create('refresh-tabs', {
  periodInMinutes: 1 / 2,
  delayInMinutes: 1 / 10,
});
chrome.alarms.onAlarm.addListener(reloadGitblitTabs);

chrome.notifications.onClicked.addListener(openTicketFromNotificationHandler);

chrome.runtime.onInstalled.addListener(initializeStorage);

chrome.storage.onChanged.addListener(handleTicketChangeInStorage);
