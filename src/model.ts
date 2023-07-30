export type CreateMessageOptions = Required<
  Pick<chrome.notifications.NotificationOptions, 'message' | 'title'>
>;
