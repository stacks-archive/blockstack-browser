import {
  Methods,
  MessageFromApp,
  SetPassword,
  StoreSeed,
  UnlockWallet,
  SwitchAccount,
} from '@extension/message-types';
import type { Vault } from '@extension/background/vault-manager';
import { RecoilState, useRecoilCallback } from 'recoil';
import {
  hasSetPasswordStore,
  walletStore,
  secretKeyStore,
  currentAccountIndexStore,
  encryptedSecretKeyStore,
  hasRehydratedVaultStore,
} from '@store/recoil/wallet';

type Set = <T>(store: RecoilState<T>, value: T) => void;

const innerMessageWrapper = (message: MessageFromApp, set: Set) => {
  return new Promise<Vault>((resolve, reject) => {
    chrome.runtime.sendMessage(message, (vaultOrError: Vault | Error) => {
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

const messageWrapper = (message: MessageFromApp) => {
  return useRecoilCallback(({ set }) => () => {
    return innerMessageWrapper(message, set);
  });
};

export const useVaultMessenger = () => {
  const doSetPassword = useRecoilCallback(({ set }) => (password: string) => {
    const message: SetPassword = {
      method: Methods.setPassword,
      payload: password,
    };
    return innerMessageWrapper(message, set);
  });

  const doStoreSeed = useRecoilCallback(({ set }) => (secretKey: string, password?: string) => {
    const message: StoreSeed = {
      method: Methods.storeSeed,
      payload: {
        secretKey,
        password,
      },
    };
    return innerMessageWrapper(message, set);
  });

  const doUnlockWallet = useRecoilCallback(({ set }) => (password: string) => {
    const message: UnlockWallet = {
      method: Methods.unlockWallet,
      payload: password,
    };
    return innerMessageWrapper(message, set);
  });

  const doSwitchAccount = useRecoilCallback(({ set }) => (index: number) => {
    const message: SwitchAccount = {
      method: Methods.switchAccount,
      payload: index,
    };
    return innerMessageWrapper(message, set);
  });

  return {
    getWallet: messageWrapper({ method: Methods.walletRequest, payload: undefined }),
    doMakeWallet: messageWrapper({ method: Methods.makeWallet, payload: undefined }),
    doCreateNewAccount: messageWrapper({ method: Methods.createNewAccount, payload: undefined }),
    doSignOut: messageWrapper({ method: Methods.signOut, payload: undefined }),
    doLockWallet: messageWrapper({ method: Methods.lockWallet, payload: undefined }),
    doSetPassword,
    doStoreSeed,
    doUnlockWallet,
    doSwitchAccount,
  };
};
