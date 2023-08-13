export type StorageOnChangeHandler = (
  changes: {
    [key: string]: chrome.storage.StorageChange;
  },
  namespace: 'sync' | 'local' | 'managed' | 'session'
) => void;
