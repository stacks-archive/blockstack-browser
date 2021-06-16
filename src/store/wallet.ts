import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import {
  Wallet,
  WalletConfig,
  fetchWalletConfig,
  createWalletGaiaConfig,
} from '@stacks/wallet-sdk';
import { gaiaUrl } from '@common/constants';

export const secretKeyState = atom<Uint8Array | undefined>(undefined);
export const hasSetPasswordState = atom<boolean>(false);
export const walletState = atom<Wallet | undefined>(undefined);
export const encryptedSecretKeyStore = atom<string | undefined>(undefined);
export const lastSeenStore = atomWithStorage<number>('wallet.last-seen', new Date().getTime());
export const walletConfigStore = atom<WalletConfig | null>(async get => {
  const wallet = get(walletState);
  if (!wallet) return null;

  const gaiaHubConfig = await createWalletGaiaConfig({ wallet, gaiaHubUrl: gaiaUrl });
  return fetchWalletConfig({ wallet, gaiaHubConfig });
});
export const hasRehydratedVaultStore = atom(false);

secretKeyState.debugLabel = 'secretKeyState';
hasSetPasswordState.debugLabel = 'hasSetPasswordState';
walletState.debugLabel = 'walletState';
encryptedSecretKeyStore.debugLabel = 'encryptedSecretKeyStore';
lastSeenStore.debugLabel = 'lastSeenStore';
walletConfigStore.debugLabel = 'walletConfigStore';
hasRehydratedVaultStore.debugLabel = 'hasRehydratedVaultStore';
