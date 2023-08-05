export function createGitblitTab(notificationId: string) {
  const [_, url] = notificationId.split(',');
  chrome.tabs.create({
    active: true,
    url: url,
  });
}
