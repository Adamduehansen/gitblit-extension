// type Tab = chrome.tabs.Tab;

// async function getGitblitTicketTabs(): Promise<Tab[]> {
//   const queryInformation: chrome.tabs.QueryInfo = {
//     url: '*://*/tickets/export/*',
//   };
//   return await chrome.tabs.query(queryInformation);
// }

// function refreshTab(tab: Tab) {
//   if (tab.id === undefined) {
//     return;
//   }

//   chrome.tabs.reload(tab.id);
// }

// async function refreshTabs(tabs: Tab[]): Promise<Tab[]> {
//   tabs.forEach(refreshTab);
//   return tabs;
// }

// async function refreshAndGetTabContent(tabs: Tab[]) {
//   await refreshTabs(tabs);

//   console.log(tabs);

//   const response = await chrome.tabs.sendMessage(tabs[0].id!, {
//     greetings: 'Hello!',
//   });

//   console.log(response);
// }

// getGitblitTicketTabs().then(refreshAndGetTabContent);

// (async () => {
//   const [tab] = await chrome.tabs.query({
//     url: '*://*/tickets/export/*',
//   });
//   const response = await chrome.tabs.sendMessage(tab.id!, {
//     greeting: 'hello',
//   });
//   // do something with response here, not outside the function
//   console.log(response);
// })();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // console.log(
  //   sender.tab
  //     ? 'from a content script:' + sender.tab.url
  //     : 'from the extension'
  // );

  // console.log(request);

  chrome.notifications.create({
    iconUrl: '/images/gitblit-icon.png',
    message: 'New comment',
    title: 'Gitblit Extension',
    type: 'basic',
  });
});
