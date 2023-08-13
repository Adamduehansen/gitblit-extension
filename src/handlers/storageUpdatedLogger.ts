import { StorageOnChangeHandler } from '../utils/model';

export function makeStorageUpdatedLogger(): StorageOnChangeHandler {
  return function (changes, namespace) {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      console.log(
        `Key "${key}" in "${namespace}" changed.`,
        { oldValue },
        { newValue }
      );
    }
  };
}
