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

    console.log('Updated tickets:', oldValue, newValue);
  }
};
