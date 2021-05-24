import { atom, selector } from 'recoil';
import { localStorageEffect } from './common/utils';
import {
  Wallet,
  WalletConfig,
  fetchWalletConfig,
  createWalletGaiaConfig,
} from '@stacks/wallet-sdk';
import { gaiaUrl } from '@common/constants';

export const secretKeyState = atom<string | undefined>({
  key: 'wallet.secret-key',
  default: undefined,
});

export const hasSetPasswordState = atom<boolean>({
  key: 'wallet.has-set-password',
  default: false,
});

export const walletState = atom<Wallet | undefined>({
  key: 'wallet',
  default: undefined,
  dangerouslyAllowMutability: true,
});

export const encryptedSecretKeyStore = atom<string | undefined>({
  key: 'wallet.encrypted-key',
  default: undefined,
});

export const lastSeenStore = atom<number>({
  key: 'wallet.last-seen',
  default: new Date().getTime(),
  effects_UNSTABLE: [localStorageEffect()],
});

export const walletConfigStore = selector<WalletConfig | null>({
  key: 'wallet.wallet-config',
  get: async ({ get }) => {
    const wallet = get(walletState);
    if (!wallet) {
      return null;
    }
    const gaiaHubConfig = await createWalletGaiaConfig({ wallet, gaiaHubUrl: gaiaUrl });
    return fetchWalletConfig({ wallet, gaiaHubConfig });
  },
});

export const hasRehydratedVaultStore = atom({
  key: 'wallet.has-rehydrated',
  default: false,
});
