import { handleTicketChangeInStorage } from './handlers/ticketChangeInStorageHandler';
import { createGitblitTab } from './handlers/createGitblitTab';
import { reloadGitblitTabs } from './handlers/reloadTabsHandler';
import { initializeStorage } from './utils/initializeStorage';

chrome.alarms.create('refresh-tabs', {
  periodInMinutes: 1 / 2,
  delayInMinutes: 1 / 10,
});
chrome.alarms.onAlarm.addListener(reloadGitblitTabs);

chrome.notifications.onClicked.addListener(createGitblitTab);

chrome.runtime.onInstalled.addListener(initializeStorage);

chrome.storage.onChanged.addListener(handleTicketChangeInStorage);
