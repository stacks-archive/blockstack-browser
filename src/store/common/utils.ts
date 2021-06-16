import hash from 'object-hash';

export function textToBytes(content: string) {
  return new TextEncoder().encode(content);
}

export function bytesToText(buffer: Uint8Array) {
  return new TextDecoder().decode(buffer);
}

export function bytesToHex(uint8a: Uint8Array): string {
  // pre-caching chars could speed this up 6x.
  let hex = '';
  for (let i = 0; i < uint8a.length; i++) {
    hex += uint8a[i].toString(16).padStart(2, '0');
  }
  return hex;
}

export function makeLocalDataKey(params: string[]): string {
  return hash(params);
}

export function getLocalData<Data>(params: string[]) {
  const key = makeLocalDataKey(params);
  const value = localStorage.getItem(key);
  if (!value) return null;
  return JSON.parse(value) as Data;
}

export function setLocalData<Data>(params: string[], data: Data): Data {
  const key = makeLocalDataKey(params);
  localStorage.setItem(key, JSON.stringify(data));
  return data;
}
