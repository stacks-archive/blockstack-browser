import { atom, selector } from 'recoil';
import { getPayloadFromToken } from '@store/transactions/utils';

export const requestTokenState = atom<string | null>({
  key: 'transactions.request-token',
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
  key: 'transactions.request-token-payload',
  get: ({ get }) => {
    const token = get(requestTokenState);
    return token ? getPayloadFromToken(token) : null;
  },
});

export const transactionRequestStxAddressState = selector({
  key: 'transactions.request.address',
  get: ({ get }) => get(requestTokenPayloadState)?.stxAddress,
});

export const transactionRequestNetwork = selector({
  key: 'transactions.request.network',
  get: ({ get }) => get(requestTokenPayloadState)?.network,
});
