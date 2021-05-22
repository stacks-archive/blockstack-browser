export enum StorageKey {
  'authenticationRequests',
  'transactionRequests',
}

interface RequestInfo {
  tabId: number;
  origin: string;
}

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
  if (!port.sender) return;
  const { tab, url } = port.sender;
  if (!tab?.id || !url) return;
  const origin = new URL(url).origin;
  const key = getKeyForRequest(storageKey, payload);
  const requestInfo: RequestInfo = {
    tabId: tab.id,
    origin,
  };
  localStorage.setItem(key, JSON.stringify(requestInfo));
}

export function getRequestInfo(storageKey: StorageKey, request: string): RequestInfo | undefined {
  const key = getKeyForRequest(storageKey, request);
  const valueJSON = localStorage.getItem(key);
  if (!valueJSON) return undefined;
  const existing: RequestInfo = JSON.parse(valueJSON);
  return existing;
}

export function getTab(storageKey: StorageKey, request: string): number {
  const existing = getRequestInfo(storageKey, request);
  if (!existing?.tabId) {
    throw new Error(`Unable to get tab ID for request: ${request}`);
  }
  return existing.tabId;
}

export function getRequestOrigin(storageKey: StorageKey, request: string): string {
  const existing = getRequestInfo(storageKey, request);
  if (!existing?.origin) {
    throw new Error(`Unable to get origin for request: ${request}`);
  }
  return existing.origin;
}

export function deleteTabForRequest(storageKey: StorageKey, request: string) {
  const key = getKeyForRequest(storageKey, request);
  localStorage.removeItem(key);
}
