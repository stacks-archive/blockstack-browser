import {
  InternalMethods,
  VaultMessageFromApp,
  SetPassword,
  StoreSeed,
  UnlockWallet,
  SwitchAccount,
} from '@extension/message-types';
import type { InMemoryVault } from '@extension/background/vault-manager';
import { RecoilState, useRecoilCallback } from 'recoil';
import {
  hasSetPasswordStore,
  walletStore,
  secretKeyStore,
  currentAccountIndexStore,
  encryptedSecretKeyStore,
  hasRehydratedVaultStore,
} from '@store/wallet';

type Set = <T>(store: RecoilState<T>, value: T) => void;

const innerMessageWrapper = async (message: VaultMessageFromApp, set: Set) => {
  return new Promise<InMemoryVault>((resolve, reject) => {
    chrome.runtime.sendMessage(message, (vaultOrError: InMemoryVault | Error) => {
      if ('hasSetPassword' in vaultOrError) {
        const vault = vaultOrError;
        set(hasRehydratedVaultStore, true);
        set(hasSetPasswordStore, vault.hasSetPassword);
        set(walletStore, vault.wallet);
        set(secretKeyStore, vault.secretKey);
        set(currentAccountIndexStore, vault.currentAccountIndex);
        set(encryptedSecretKeyStore, vault.encryptedSecretKey);
        resolve(vault);
      } else {
        reject(vaultOrError);
      }
    });
  });
};

const messageWrapper = (message: VaultMessageFromApp) => {
  return useRecoilCallback(
    ({ set }) =>
      () =>
        innerMessageWrapper(message, set),
    [message]
  );
};

export const useVaultMessenger = () => {
  const doSetPassword = useRecoilCallback(({ set }) => (password: string) => {
    const message: SetPassword = {
      method: InternalMethods.setPassword,
      payload: password,
    };
    return innerMessageWrapper(message, set);
  });

  const doStoreSeed = useRecoilCallback(({ set }) => (secretKey: string, password?: string) => {
    const message: StoreSeed = {
      method: InternalMethods.storeSeed,
      payload: {
        secretKey,
        password,
      },
    };
    return innerMessageWrapper(message, set);
  });

  const doUnlockWallet = useRecoilCallback(({ set }) => (password: string) => {
    const message: UnlockWallet = {
      method: InternalMethods.unlockWallet,
      payload: password,
    };
    return innerMessageWrapper(message, set);
  });

  const doSwitchAccount = useRecoilCallback(({ set }) => (index: number) => {
    const message: SwitchAccount = {
      method: InternalMethods.switchAccount,
      payload: index,
    };
    return innerMessageWrapper(message, set);
  });

  const getWallet = messageWrapper({ method: InternalMethods.walletRequest, payload: undefined });
  const doMakeWallet = messageWrapper({ method: InternalMethods.makeWallet, payload: undefined });
  const doCreateNewAccount = messageWrapper({
    method: InternalMethods.createNewAccount,
    payload: undefined,
  });
  const handleSignOut = messageWrapper({ method: InternalMethods.signOut, payload: undefined });
  const doSignOut = async () => {
    await handleSignOut();
    localStorage.clear();
  };
  const doLockWallet = messageWrapper({ method: InternalMethods.lockWallet, payload: undefined });

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
