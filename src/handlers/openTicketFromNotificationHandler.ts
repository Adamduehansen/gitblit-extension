export function openTicketFromNotificationHandler(notificationId: string) {
  const [_, url] = notificationId.split(',');
  chrome.tabs.create({
    active: true,
    url: url,
  });
}
