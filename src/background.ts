import { handleTicketChangeInStorage } from './handlers/handleTicketChangeInStorage';
import {
  ChromeStorageRepository,
  StorageService,
} from './services/StorageService';

function initializeStorage() {
  console.log('Installing Extension!');
  const storageService = new StorageService(ChromeStorageRepository);
  storageService.initializeStorage();
}

async function reloadGitblitTabs(alarm: chrome.alarms.Alarm) {
  if (alarm.name !== 'refresh-tabs') {
    return;
  }

  const gitblitTicketTabs = await chrome.tabs.query({
    url: '*://*/tickets/export/*',
  });

  gitblitTicketTabs.forEach((tab) => {
    if (tab.id === undefined) {
      console.log('Somehow a tab did not have an id?');

      return;
    }

    chrome.tabs.reload(tab.id);
  });
}

chrome.runtime.onInstalled.addListener(initializeStorage);

chrome.alarms.create('refresh-tabs', {
  periodInMinutes: 1 / 2,
  delayInMinutes: 1 / 10,
});

chrome.alarms.onAlarm.addListener(reloadGitblitTabs);

chrome.notifications.onClicked.addListener((notificationId) => {
  const [_, url] = notificationId.split(',');
  chrome.tabs.create({
    active: true,
    url: url,
  });
});

chrome.storage.onChanged.addListener(handleTicketChangeInStorage);
