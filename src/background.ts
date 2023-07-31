import {
  ChromeStorageRepository,
  StorageService,
} from './services/StorageService';
import type { CreateMessageOptions } from './utils/model';

function handleMessage(request: CreateMessageOptions) {
  chrome.notifications.create(request.onClickUrl.toString(), {
    iconUrl: '/images/gitblit-icon.png',
    title: request.title,
    message: request.message,
    type: 'basic',
  });
}

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

chrome.runtime.onMessage.addListener(handleMessage);

chrome.runtime.onInstalled.addListener(initializeStorage);

chrome.alarms.create('refresh-tabs', {
  periodInMinutes: 1 / 2,
  delayInMinutes: 1 / 10,
});

chrome.alarms.onAlarm.addListener(reloadGitblitTabs);

chrome.notifications.onClicked.addListener((notificationId) => {
  chrome.tabs.create({
    active: true,
    url: notificationId,
  });
});
