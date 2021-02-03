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
  localStorage.setItem(key, JSON.stringify({ tabId: tab.id }));
}

export function getTab(storageKey: StorageKey, request: string): number {
  const key = getKeyForRequest(storageKey, request);
  const valueJSON = localStorage.getItem(key);
  const existing: RequestInfo = valueJSON ? JSON.parse(valueJSON) : undefined;
  if (!existing?.tabId) {
    throw new Error(`Unable to get tab ID for request: ${request}`);
  }
  return existing.tabId;
}

export function deleteTabForRequest(storageKey: StorageKey, request: string) {
  const key = getKeyForRequest(storageKey, request);
  localStorage.removeItem(key);
}
