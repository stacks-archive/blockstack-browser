import { selector } from 'recoil';
import { accountsStore } from '@store/wallet';
import { currentNetworkStore, currentTransactionVersion } from '@store/networks';
import { getStxAddress } from '@stacks/wallet-sdk';

async function fetchNamesByAddress(networkUrl: string, address: string) {
  const res = await fetch(networkUrl + `/v1/addresses/stacks/${address}`);
  const data = await res.json();
  return data.names;
}

export const accountNameState = selector({
  key: 'names',
  get: async ({ get }) => {
    const accounts = get(accountsStore);
    const network = get(currentNetworkStore);
    const transactionVersion = get(currentTransactionVersion);
    const promises = accounts?.map(async account => {
      const address = getStxAddress({
        account: account,
        transactionVersion,
      });
      const names = await fetchNamesByAddress(network.url, address);
      return {
        address,
        index: account.index,
        names,
      };
    });
    if (!promises) return;
    return Promise.all(promises);
  },
});
