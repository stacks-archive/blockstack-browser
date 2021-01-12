import {
  inactivityLockCheck,
  LockCheckResult,
  LOCKOUT_AFTER_MS,
} from '../../src/common/inactivity-lock';
import {
  hasSetPasswordStore,
  lastSeenStore,
  secretKeyStore,
  walletStore,
  encryptedSecretKeyStore,
} from '../../src/store/recoil/wallet';
import { localStorageKey } from '../../src/store/recoil';
import { RecoilState } from 'recoil';

const setItem = <T>(node: RecoilState<T>, value: T) => {
  const key = localStorageKey(node.key);
  localStorage.setItem(key, JSON.stringify(value));
};

const getItem = <T>(node: RecoilState<T>): T | undefined => {
  const key = localStorageKey(node.key);
  const value = localStorage.getItem(key);
  if (!value) return undefined;
  return JSON.parse(value);
};

describe('Inactivity lock', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('Should not do anything if no password set', () => {
    setItem(lastSeenStore, new Date().getTime());
    const result = inactivityLockCheck();
    expect(result).toEqual(LockCheckResult.NO_PASSWORD);
    expect(getItem(lastSeenStore)).toBeTruthy();
  });

  test('should not do anything if no timestamp', () => {
    setItem(hasSetPasswordStore, true);
    const result = inactivityLockCheck();
    expect(result).toEqual(LockCheckResult.NO_TIMESTAMP);
    expect(getItem(hasSetPasswordStore)).toBeTruthy();
  });

  test('should remove all items if enough time has passed', () => {
    setItem(lastSeenStore, new Date().getTime() - LOCKOUT_AFTER_MS - 1);
    setItem(hasSetPasswordStore, true);
    setItem(secretKeyStore, 'asdf');
    setItem(encryptedSecretKeyStore, 'key');
    localStorage.setItem(localStorageKey(walletStore.key), 'something');
    localStorage.setItem('hello', 'world');

    const result = inactivityLockCheck();

    expect(result).toEqual(LockCheckResult.STATE_CLEARED);
    expect(getItem(walletStore)).toBeUndefined();
    expect(getItem(secretKeyStore)).toBeUndefined();

    // The encrypted key and any other keys are not cleared
    expect(getItem(encryptedSecretKeyStore)).toEqual('key');
    expect(getItem(hasSetPasswordStore)).toEqual(true);
    expect(localStorage.getItem('hello')).toEqual('world');
  });

  test('should not do anything if not enough time has passed', () => {
    setItem(lastSeenStore, new Date().getTime() - 50);
    setItem(hasSetPasswordStore, true);
    setItem(secretKeyStore, 'asdf');
    setItem(encryptedSecretKeyStore, 'key');
    localStorage.setItem(localStorageKey(walletStore.key), 'something');
    localStorage.setItem('hello', 'world');

    const result = inactivityLockCheck();

    expect(result).toEqual(LockCheckResult.NOT_YET);

    expect(getItem(secretKeyStore)).not.toBeUndefined();
    expect(getItem(encryptedSecretKeyStore)).toEqual('key');
    expect(localStorage.getItem('hello')).toEqual('world');
    expect(localStorage.getItem(localStorageKey(walletStore.key))).toEqual('something');
  });
});
