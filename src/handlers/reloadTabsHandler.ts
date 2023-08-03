export async function reloadGitblitTabs(alarm: chrome.alarms.Alarm) {
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
