import { atom, selector, atomFamily } from 'recoil';
import { localStorageEffect } from './index';
import { Identity, Wallet } from '@stacks/keychain';
import { currentNetworkKeyStore } from './networks';

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
  key: 'wallet.wallet',
  default: undefined,
  effects_UNSTABLE: [
    localStorageEffect({
      onlyExtension: true,
      transformer: {
        serialize: wallet => {
          if (!wallet) return '';
          return JSON.stringify(wallet);
        },
        deserialize: walletJSON => {
          if (!walletJSON) return undefined;
          return new Wallet(JSON.parse(walletJSON));
        },
      },
    }),
  ],
  dangerouslyAllowMutability: true,
});

export const identitiesStore = atom<Identity[] | undefined>({
  key: 'wallet.identities',
  default: undefined,
  effects_UNSTABLE: [
    localStorageEffect({
      onlyExtension: true,
      transformer: {
        serialize: identities => {
          if (!identities) return '';
          return JSON.stringify(identities);
        },
        deserialize: identitiesJSON => {
          if (!identitiesJSON) return '';
          return JSON.parse(identitiesJSON).map((identity: Identity) => new Identity(identity));
        },
      },
    }),
  ],
  dangerouslyAllowMutability: true,
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
    const network = get(currentNetworkKeyStore);
    const currentIdentity = get(currentIdentityStore);
    const nonce = get(latestNoncesStore([network, currentIdentity?.getStxAddress() || '']));
    return nonce;
  },
});

export const currentIdentityIndexStore = atom<number | undefined>({
  key: 'wallet.current-identity-index',
  default: undefined,
  effects_UNSTABLE: [localStorageEffect()],
});

export const encryptedSecretKeyStore = atom<string | undefined>({
  key: 'wallet.encrypted-key',
  default: undefined,
  effects_UNSTABLE: [localStorageEffect()],
});

export const currentIdentityStore = selector({
  key: 'wallet.current-identity',
  get: ({ get }) => {
    const identityIndex = get(currentIdentityIndexStore);
    const identities = get(identitiesStore);
    if (identityIndex === undefined || !identities) {
      return undefined;
    }
    return identities[identityIndex];
  },
  dangerouslyAllowMutability: true,
});

export const lastSeenStore = atom<number>({
  key: 'wallet.last-seen',
  default: new Date().getTime(),
  effects_UNSTABLE: [localStorageEffect()],
});
