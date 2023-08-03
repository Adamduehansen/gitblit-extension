import {
  ChromeStorageRepository,
  StorageService,
} from '../services/StorageService';

export function initializeStorage() {
  console.log('Installing Extension!');
  const storageService = new StorageService(ChromeStorageRepository);
  storageService.initializeStorage();
}
