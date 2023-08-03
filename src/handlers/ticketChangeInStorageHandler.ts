import { getChangeInTickets } from '../utils/getChangeInTickets';
import { ticketsSchema } from '../utils/model';

type StorageChangeHandler = (
  changes: {
    [key: string]: chrome.storage.StorageChange;
  },
  areaName: 'sync' | 'local' | 'managed' | 'session'
) => void;

export const handleTicketChangeInStorage: StorageChangeHandler = function (
  changes,
  areaName
): void {
  if (areaName !== 'local') {
    return;
  }

  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (key !== 'tickets') {
      return;
    }

    const oldTickets = ticketsSchema.parse(oldValue);
    const newTickets = ticketsSchema.parse(newValue);

    const result = getChangeInTickets(oldTickets, newTickets);
    if (result === null) {
      return;
    }

    const notificationId = `${crypto.randomUUID()},${result.ticketUrl}`;
    switch (result.type) {
      case 'NEW_TICKET':
        chrome.notifications.create(notificationId, {
          iconUrl: '/images/gitblit-icon.png',
          title: 'Ticket created!',
          message: `Ticket "${result.ticketNumber}" is added for "${result.ticketRepository}"`,
          type: 'basic',
        });
        break;
      case 'NEW_COMMENT':
        chrome.notifications.create(notificationId, {
          iconUrl: '/images/gitblit-icon.png',
          title: 'New comment on ticket!',
          message: `${result.ticketRepository}/${result.ticketNumber}: "${result.commentText}"`,
          type: 'basic',
        });
        break;
    }
  }
};
