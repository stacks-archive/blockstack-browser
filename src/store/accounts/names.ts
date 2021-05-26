import { selector } from 'recoil';
import { getStxAddress } from '@stacks/wallet-sdk';

import { accountsState } from './index';
import { currentNetworkState } from '@store/networks';
import { transactionNetworkVersionState } from '@store/transactions';
import { fetchNamesByAddress } from '@common/api/names';

function makeKey(networkUrl: string, address: string): string {
  return `${networkUrl}__${address}`;
}

function getLocalNames(networkUrl: string, address: string): [string[], number] | null {
  const key = makeKey(networkUrl, address);
  const value = localStorage.getItem(key);
  if (!value) return null;
  return JSON.parse(value);
}

function setLocalNames(networkUrl: string, address: string, data: [string[], number]): void {
  const key = makeKey(networkUrl, address);
  return localStorage.setItem(key, JSON.stringify(data));
}

interface AccountName {
  address: string;
  index: number;
  names: string[];
}

type AccountNameState = AccountName[] | null;

const STALE_TIME = 30 * 60 * 1000; // 30 min

enum KEYS {
  NAMES = 'account/NAMES',
}

export const accountNameState = selector<AccountNameState>({
  key: KEYS.NAMES,
  get: async ({ get }) => {
    const accounts = get(accountsState);
    const network = get(currentNetworkState);
    const transactionVersion = get(transactionNetworkVersionState);

    if (!network || !accounts) return null;

    const promises = accounts.map(async account => {
      const address = getStxAddress({
        account: account,
        transactionVersion,
      });

      // let's try to find any saved names first
      const local = getLocalNames(network.url, address);

      if (local) {
        const [names, timestamp] = local;
        const now = Date.now();
        const isStale = now - timestamp > STALE_TIME;
        if (!isStale)
          return {
            address,
            index: account.index,
            names,
          };
      }

      try {
        const names = await fetchNamesByAddress(network.url, address);
        if (names?.length) {
          // persist them for next time
          setLocalNames(network.url, address, [names, Date.now()]);
        }
        return {
          address,
          index: account.index,
          names: names || [],
        };
      } catch (e) {
        console.error(e);
        return {
          address,
          index: account.index,
          names: [],
        };
      }
    });
    if (!promises) return null;
    return Promise.all(promises);
  },
});
