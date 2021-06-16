import {
  VaultActions,
  SetPassword,
  StoreSeed,
  UnlockWallet,
  SwitchAccount,
} from '@background/vault-types';

import {
  hasSetPasswordState,
  walletState,
  secretKeyState,
  encryptedSecretKeyStore,
  hasRehydratedVaultStore,
} from '@store/wallet';
import { InMemoryVault } from '@background/vault';
import { InternalMethods } from '@content-scripts/message-types';
import { textToBytes } from '@store/common/utils';
import { useAtomCallback } from 'jotai/utils';
import { useCallback } from 'react';
import { currentAccountIndexState } from '@store/accounts';

const useInnerMessageWrapper = () => {
  return useAtomCallback<void, VaultActions>(
    useCallback(async (_get, set, message) => {
      return new Promise<InMemoryVault>((resolve, reject) => {
        chrome.runtime.sendMessage(message, (vaultOrError: InMemoryVault | Error) => {
          try {
            if ('hasSetPassword' in vaultOrError) {
              const vault = vaultOrError;
              set(hasRehydratedVaultStore, true);
              set(hasSetPasswordState, vault.hasSetPassword);
              set(walletState, vault.wallet);
              set(secretKeyState, vault.secretKey ? textToBytes(vault.secretKey) : undefined);
              set(currentAccountIndexState, vault.currentAccountIndex);
              set(encryptedSecretKeyStore, vault.encryptedSecretKey);
              resolve(vault);
            } else {
              reject(vaultOrError);
            }
          } catch (e) {
            console.error(e);
          }
        });
      });
    }, [])
  );
};

export const useVaultMessenger = () => {
  const innerMessageWrapper = useInnerMessageWrapper();

  const doSetPassword = useCallback(
    (payload: string) => {
      const message: SetPassword = {
        method: InternalMethods.setPassword,
        payload,
      };
      return innerMessageWrapper(message);
    },
    [innerMessageWrapper]
  );

  const doStoreSeed = useCallback(
    (payload: { secretKey: string; password?: string }) => {
      const message: StoreSeed = {
        method: InternalMethods.storeSeed,
        payload,
      };
      return innerMessageWrapper(message);
    },
    [innerMessageWrapper]
  );

  const doUnlockWallet = useCallback(
    payload => {
      const message: UnlockWallet = {
        method: InternalMethods.unlockWallet,
        payload,
      };
      return innerMessageWrapper(message);
    },
    [innerMessageWrapper]
  );

  const doSwitchAccount = useCallback(
    payload => {
      const message: SwitchAccount = {
        method: InternalMethods.switchAccount,
        payload,
      };
      return innerMessageWrapper(message);
    },
    [innerMessageWrapper]
  );

  const getWallet = () =>
    innerMessageWrapper({ method: InternalMethods.getWallet, payload: undefined });
  const doMakeWallet = () =>
    innerMessageWrapper({ method: InternalMethods.makeWallet, payload: undefined });
  const doCreateNewAccount = () =>
    innerMessageWrapper({
      method: InternalMethods.createNewAccount,
      payload: undefined,
    });
  const handleSignOut = () =>
    innerMessageWrapper({ method: InternalMethods.signOut, payload: undefined });
  const doSignOut = async () => {
    await handleSignOut();
    localStorage.clear();
  };
  const doLockWallet = () =>
    innerMessageWrapper({ method: InternalMethods.lockWallet, payload: undefined });

  return {
    getWallet,
    doMakeWallet,
    doCreateNewAccount,
    doSignOut,
    doLockWallet,
    doSetPassword,
    doStoreSeed,
    doUnlockWallet,
    doSwitchAccount,
  };
};
