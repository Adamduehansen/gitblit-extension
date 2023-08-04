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

    console.log({ oldTickets });
    console.log({ newTickets });
  }
};
