import { selector } from 'recoil';
import { getStxAddress } from '@stacks/wallet-sdk';

import { fetcher } from '@common/wrapped-fetch';

import { accountsStore } from '@store/wallet';
import { currentNetworkStore, currentTransactionVersion } from '@store/networks';

async function fetchNamesByAddress(networkUrl: string, address: string): Promise<string[]> {
  const res = await fetcher(networkUrl + `/v1/addresses/stacks/${address}`);
  const data = await res.json();
  return data?.names || [];
}

function makeKey(networkUrl: string, address: string): string {
  return `${networkUrl}__${address}`;
}

function getLocalNames(networkUrl: string, address: string): string[] | null {
  const key = makeKey(networkUrl, address);
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}

function setLocalNames(networkUrl: string, address: string, names: string[]): void {
  const key = makeKey(networkUrl, address);
  return localStorage.setItem(key, JSON.stringify(names));
}

interface AccountName {
  address: string;
  index: number;
  names: string[];
}

type AccountNameState = AccountName[] | null;

export const accountNameState = selector<AccountNameState>({
  key: 'names',
  get: async ({ get }) => {
    const accounts = get(accountsStore);
    const network = get(currentNetworkStore);
    const transactionVersion = get(currentTransactionVersion);

    if (!network || !accounts) return null;

    const promises = accounts.map(async account => {
      const address = getStxAddress({
        account: account,
        transactionVersion,
      });

      // let's try to find any saved names first
      const localNames = getLocalNames(network.url, address);

      if (localNames?.length) {
        return {
          address,
          index: account.index,
          names: localNames,
        };
      }

      try {
        const names = await fetchNamesByAddress(network.url, address);
        if (names?.length) {
          // persist them for next time
          setLocalNames(network.url, address, names);
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
