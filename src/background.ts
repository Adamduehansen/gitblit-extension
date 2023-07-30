import {
  ChromeStorageRepository,
  StorageService,
} from './services/StorageService';
import type { CreateMessageOptions } from './utils/model';

function handleMessage(request: CreateMessageOptions) {
  chrome.notifications.create({
    iconUrl: '/images/gitblit-icon.png',
    title: request.title,
    message: request.message,
    type: 'basic',
  });
}

function initializeStorage() {
  console.log('Installing Extension!');
  const storageService = new StorageService(ChromeStorageRepository);
  storageService.initializeStorage();
}

chrome.runtime.onMessage.addListener(handleMessage);

chrome.runtime.onInstalled.addListener(initializeStorage);
