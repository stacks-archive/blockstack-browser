import { lastSeenStore, encryptedSecretKeyStore, hasSetPasswordStore } from '@store/recoil/wallet';
import { localStorageKey, ATOM_LOCALSTORAGE_PREFIX } from '@store/recoil';

const lockoutLog = (msg: string) => {
  if (typeof NODE_ENV !== 'undefined' && NODE_ENV !== 'test') {
    console.debug(`[LOCKOUT]: ${msg}`);
  }
};

// export const LOCKOUT_INTERVAL = 1000 * 60 * 60 * 48; // 48 hours
export const LOCKOUT_AFTER_MS = 1000 * 60 * 60; // 1 hour, shorter for testing

export enum LockCheckResult {
  NO_PASSWORD = 0,
  NO_TIMESTAMP = 1,
  STATE_CLEARED = 2,
  NOT_YET = 3,
}

/**
 * After inactivity lock, delete all recoil state except these
 */
const inactivityLockAllowedKeys = [hasSetPasswordStore, encryptedSecretKeyStore].map(store =>
  localStorageKey(store.key)
);

export const inactivityLockCheck = (): LockCheckResult => {
  lockoutLog('Checking to lockout.');

  const hasSetPasswordKey = localStorageKey(hasSetPasswordStore.key);
  if (localStorage.getItem(hasSetPasswordKey) !== 'true') {
    lockoutLog("User hasn't set a password - not locking.");
    return LockCheckResult.NO_PASSWORD;
  }

  const timestampKey = localStorageKey(lastSeenStore.key);
  const timestampString = localStorage.getItem(timestampKey);
  if (!timestampString) return LockCheckResult.NO_TIMESTAMP;

  const now = new Date().getTime();
  const lastSeen = parseInt(timestampString, 10);
  lockoutLog(`User last seen ${Math.floor((now - lastSeen) / 1000)} seconds ago.`);

  if (now - lastSeen > LOCKOUT_AFTER_MS) {
    lockoutLog('Time to lockout!');
    Object.keys(localStorage).forEach(key => {
      const isAllowedKey = inactivityLockAllowedKeys.includes(key);
      if (key.startsWith(ATOM_LOCALSTORAGE_PREFIX) && !isAllowedKey) {
        lockoutLog(`Deleting key: ${key}`);
        localStorage.removeItem(key);
      }
    });
    return LockCheckResult.STATE_CLEARED;
  }

  return LockCheckResult.NOT_YET;
};
