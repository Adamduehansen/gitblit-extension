import { createGitblitTab } from './handlers/createGitblitTab';
import { initializeStorage } from './handlers/initializeStorage';
import { reloadGitblitTabs } from './handlers/reloadTabsHandler';

chrome.alarms.create('refresh-tabs', {
  periodInMinutes: 1 / 2,
  delayInMinutes: 1 / 10,
});
chrome.alarms.onAlarm.addListener(reloadGitblitTabs);

chrome.notifications.onClicked.addListener(createGitblitTab);

chrome.runtime.onInstalled.addListener(initializeStorage);

chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Key "${key}" in "${namespace}" changed.`,
      { oldValue },
      { newValue }
    );
  }
});
