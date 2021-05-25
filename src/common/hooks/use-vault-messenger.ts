import {
  VaultActions,
  SetPassword,
  StoreSeed,
  UnlockWallet,
  SwitchAccount,
} from '@background/vault-types';
import { RecoilState, useRecoilCallback } from 'recoil';
import {
  hasSetPasswordState,
  walletState,
  secretKeyState,
  encryptedSecretKeyStore,
  hasRehydratedVaultStore,
} from '@store/wallet';
import { InMemoryVault } from '@background/vault';
import { InternalMethods } from '@content-scripts/message-types';
import { currentAccountIndexStore } from '@store/accounts';
import { textToBytes } from '@store/common/utils';

type Set = <T>(store: RecoilState<T>, value: T) => void;

const innerMessageWrapper = async (message: VaultActions, set: Set) => {
  return new Promise<InMemoryVault>((resolve, reject) => {
    chrome.runtime.sendMessage(message, (vaultOrError: InMemoryVault | Error) => {
      if ('hasSetPassword' in vaultOrError) {
        const vault = vaultOrError;
        set(hasRehydratedVaultStore, true);
        set(hasSetPasswordState, vault.hasSetPassword);
        set(walletState, vault.wallet);
        set(secretKeyState, vault.secretKey ? textToBytes(vault.secretKey) : undefined);
        set(currentAccountIndexStore, vault.currentAccountIndex);
        set(encryptedSecretKeyStore, vault.encryptedSecretKey);
        resolve(vault);
      } else {
        reject(vaultOrError);
      }
    });
  });
};

const messageWrapper = (message: VaultActions) => {
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

  const getWallet = messageWrapper({ method: InternalMethods.getWallet, payload: undefined });
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
