import { getBucket } from '@extend-chrome/storage';

export interface WalletStore {
  hasSetPassword: boolean;
  encryptedSecretKey?: string;
}

export const walletStore = getBucket<WalletStore>('wallet');

/**
 * Authentication and Transaction Requests
 */

export enum StorageKey {
  'authenticationRequests',
  'transactionRequests',
}

interface RequestInfo {
  tabId: number;
}

interface RequestsBucket {
  [key: string]: RequestInfo;
}

export const requestStore = getBucket<RequestsBucket>('requests');

function getKeyForRequest(storageKey: StorageKey, request: string) {
  return `${storageKey}-${request}`;
}

export async function storePayload({
  payload,
  storageKey,
  port,
}: {
  payload: string;
  storageKey: StorageKey;
  port: chrome.runtime.Port;
}) {
  const tab = port.sender?.tab;
  if (!tab?.id) return;
  const key = getKeyForRequest(storageKey, payload);
  await requestStore.set({ [key]: { tabId: tab.id } });
}

export async function getTab(storageKey: StorageKey, request: string): Promise<number> {
  const key = getKeyForRequest(storageKey, request);
  const existing = (await requestStore.get(key))[key];
  if (!existing?.tabId) {
    throw new Error(`Unable to get tab ID for request: ${request}`);
  }
  return existing.tabId;
}

export async function deleteTabForRequest(storageKey: StorageKey, request: string): Promise<void> {
  const key = getKeyForRequest(storageKey, request);
  await requestStore.remove(key);
}
