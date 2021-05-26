import { atom, selector } from 'recoil';
import { getPayloadFromToken } from '@store/transactions/utils';

enum KEYS {
  REQUEST_TOKEN = 'requests/REQUEST_TOKEN',
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

export const transactionRequestStxAddressState = selector({
  key: KEYS.ADDRESS,
  get: ({ get }) => get(requestTokenPayloadState)?.stxAddress,
});

export const transactionRequestNetwork = selector({
  key: KEYS.NETWORK,
  get: ({ get }) => get(requestTokenPayloadState)?.network,
});
