export enum StorageKey {
  'authenticationRequests',
  'transactionRequests',
}

interface RequestInfo {
  tabId: number;
}

type RequestResult = RequestInfo | undefined;

function getKeyForRequest(storageKey: StorageKey, request: string) {
  return `${storageKey}-${request}`;
}

export function storePayload({
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
  chrome.storage.local.set({
    [key]: {
      tabId: tab.id,
    },
  });
}

export async function getTab(storageKey: StorageKey, request: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const key = getKeyForRequest(storageKey, request);
    chrome.storage.local.get([key], storage => {
      const store: RequestResult = storage[key];
      if (!store?.tabId) {
        return reject(`Unable to get tab ID for request: ${request}`);
      }
      resolve(store.tabId);
    });
  });
}

export async function deleteTabForRequest(storageKey: StorageKey, request: string): Promise<void> {
  return new Promise(resolve => {
    const key = getKeyForRequest(storageKey, request);
    chrome.storage.local.remove(key, () => {
      return resolve();
    });
  });
}
