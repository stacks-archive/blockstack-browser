import { atom, selector, atomFamily } from 'recoil';
import { localStorageEffect } from './index';
import {
  Wallet,
  Account,
  WalletConfig,
  fetchWalletConfig,
  createWalletGaiaConfig,
  getStxAddress,
} from '@stacks/wallet-sdk';
import { currentNetworkStore, currentTransactionVersion } from './networks';
import { gaiaUrl } from '@common/constants';

export const secretKeyStore = atom<string | undefined>({
  key: 'wallet.secret-key',
  default: undefined,
  effects_UNSTABLE: [localStorageEffect({ onlyExtension: true })],
});

export const hasSetPasswordStore = atom<boolean>({
  key: 'wallet.has-set-password',
  default: false,
  effects_UNSTABLE: [localStorageEffect()],
});

export const walletStore = atom<Wallet | undefined>({
  key: 'wallet.wallet-v2',
  default: undefined,
  effects_UNSTABLE: [
    localStorageEffect({
      onlyExtension: true,
    }),
  ],
  dangerouslyAllowMutability: true,
});

export const accountsStore = selector<Account[] | undefined>({
  key: 'wallet.accounts',
  get: ({ get }) => {
    const wallet = get(walletStore);
    if (!wallet) return undefined;
    return wallet.accounts;
  },
});

/**
 * Map from {network, stxAddress} to latest nonce sent from this device
 */
export const latestNoncesStore = atomFamily<
  { nonce: number; blockHeight: number },
  [string, string]
>({
  key: 'wallet.latest-nonces',
  default: args => {
    const key = `wallet.latest-nonces__${JSON.stringify(args)}`;
    const current = localStorage.getItem(key);
    if (current) {
      return JSON.parse(current);
    }
    return {
      nonce: 0,
      blockHeight: 0,
    };
  },
  effects_UNSTABLE: [localStorageEffect()],
});

export const latestNonceStore = selector({
  key: 'wallet.latest-nonce',
  get: ({ get }) => {
    const network = get(currentNetworkStore);
    const account = get(currentAccountStore);
    const transactionVersion = get(currentTransactionVersion);
    const address = account ? getStxAddress({ account, transactionVersion }) : '';
    const nonce = get(latestNoncesStore([network.url, address]));
    return nonce;
  },
});

export const currentAccountIndexStore = atom<number | undefined>({
  key: 'wallet.current-account-index',
  default: undefined,
  effects_UNSTABLE: [localStorageEffect()],
});

export const encryptedSecretKeyStore = atom<string | undefined>({
  key: 'wallet.encrypted-key',
  default: undefined,
  effects_UNSTABLE: [localStorageEffect()],
});

export const currentAccountStore = selector({
  key: 'wallet.current-account',
  get: ({ get }) => {
    const accountIndex = get(currentAccountIndexStore);
    const wallet = get(walletStore);
    if (accountIndex === undefined || !wallet) {
      return undefined;
    }
    return wallet.accounts[accountIndex];
  },
  dangerouslyAllowMutability: true,
});

export const currentAccountStxAddressStore = selector({
  key: 'wallet.current-stx-address',
  get: ({ get }) => {
    const account = get(currentAccountStore);
    if (!account) return undefined;
    const transactionVersion = get(currentTransactionVersion);
    const address = getStxAddress({ account, transactionVersion });
    return address;
  },
});

export const lastSeenStore = atom<number>({
  key: 'wallet.last-seen',
  default: new Date().getTime(),
  effects_UNSTABLE: [localStorageEffect()],
});

export const walletConfigStore = selector<WalletConfig | null>({
  key: 'wallet.wallet-config',
  get: async ({ get }) => {
    const wallet = get(walletStore);
    if (!wallet) {
      return null;
    }
    const gaiaHubConfig = await createWalletGaiaConfig({ wallet, gaiaHubUrl: gaiaUrl });
    const walletConfig = await fetchWalletConfig({ wallet, gaiaHubConfig });
    return walletConfig;
  },
});
