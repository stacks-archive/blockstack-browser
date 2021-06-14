import { atom, selector, waitForAll } from 'recoil';
import { getPayloadFromToken } from '@store/transactions/utils';
import { walletState } from '@store/wallet';
import { verifyTxRequest } from '@common/transactions/requests';
import { getRequestOrigin, StorageKey } from '@common/storage';

enum KEYS {
  REQUEST_TOKEN = 'requests/REQUEST_TOKEN',
  REQUEST_TOKEN_ORIGIN = 'requests/REQUEST_TOKEN_ORIGIN',
  REQUEST_TOKEN_VALIDATION = 'requests/REQUEST_TOKEN_VALIDATION',
  REQUEST_TOKEN_PAYLOAD = 'requests/REQUEST_TOKEN_PAYLOAD',
  ADDRESS = 'requests/ADDRESS',
  NETWORK = 'requests/NETWORK',
}

export const requestTokenState = atom<string | null>({
  key: KEYS.REQUEST_TOKEN,
  default: null,
  effects_UNSTABLE: [
    ({ setSelf, trigger }) => {
      if (trigger === 'get') {
        const requestToken = window.location.href?.split('?request=')[1];
        if (requestToken) {
          setSelf(requestToken);
        }
      }

      return () => {
        setSelf(null);
      };
    },
  ],
});

export const requestTokenPayloadState = selector({
  key: KEYS.REQUEST_TOKEN_PAYLOAD,
  get: ({ get }) => {
    const token = get(requestTokenState);
    return token ? getPayloadFromToken(token) : null;
  },
});

export const requestTokenOriginState = selector({
  key: KEYS.REQUEST_TOKEN_ORIGIN,
  get: ({ get }) => {
    const token = get(requestTokenState);
    if (!token) return;
    try {
      return getRequestOrigin(StorageKey.transactionRequests, token);
    } catch (e) {
      console.error(e);
      return false;
    }
  },
});

export const transactionRequestValidationState = selector({
  key: KEYS.REQUEST_TOKEN_VALIDATION,
  get: async ({ get }) => {
    const { requestToken, wallet, origin } = get(
      waitForAll({
        requestToken: requestTokenState,
        wallet: walletState,
        origin: requestTokenOriginState,
      })
    );
    if (!origin || !wallet || !requestToken) return;
    try {
      const valid = await verifyTxRequest({
        requestToken,
        wallet,
        appDomain: origin,
      });
      return !!valid;
    } catch (e) {
      return false;
    }
  },
});

export const transactionRequestStxAddressState = selector({
  key: KEYS.ADDRESS,
  get: ({ get }) => get(requestTokenPayloadState)?.stxAddress,
});

export const transactionRequestNetwork = selector({
  key: KEYS.NETWORK,
  get: ({ get }) => get(requestTokenPayloadState)?.network,
});
