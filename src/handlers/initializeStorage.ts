export function initializeStorage() {
  console.log('Installing Extension!');
  chrome.storage.local.set({
    tickets: [],
    notifications: [],
  });
}
