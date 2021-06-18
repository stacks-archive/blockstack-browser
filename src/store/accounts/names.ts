import { Atom, atom } from 'jotai';
import { accountsWithAddressState } from './index';
import { currentNetworkState } from '@store/networks';
import { fetchNamesByAddress } from '@common/api/names';
import { atomFamilyWithQuery } from '@store/query';
import { waitForAll } from 'jotai/utils';

function makeKey(networkUrl: string): string {
  return `${networkUrl}__BNS_NAMES`;
}

function getLocalNames(networkUrl: string) {
  const key = makeKey(networkUrl);
  const value = localStorage.getItem(key);
  if (!value) return null;
  const [data, date] = JSON.parse(value);
  const now = Date.now();
  if (now - date > STALE_TIME) return null;
  return data as Record<string, string[]>;
}

function setLocalNames(networkUrl: string, data: Record<string, string[]>): void {
  const key = makeKey(networkUrl);
  return localStorage.setItem(key, JSON.stringify([data, Date.now()]));
}

interface AccountName {
  address: string;
  index: number;
  names: string[];
}

type AccountNameState = AccountName[] | null;

const STALE_TIME = 30 * 60 * 1000; // 30 min

const namesResponseState = atomFamilyWithQuery<[string, string], string[]>(
  'ACCOUNT_NAMES',
  (_get, [address, networkUrl]) => {
    return fetchNamesByAddress(networkUrl, address);
  }
);

export const accountNameState = atom<AccountNameState>(get => {
  const accounts = get(accountsWithAddressState);
  const network = get(currentNetworkState);
  if (!network || !accounts) return null;
  let names = getLocalNames(network.url);
  if (!names) {
    let obj: Record<string, Atom<any>> = {};
    accounts.forEach(account => {
      obj[account.address] = namesResponseState([account.address, network.url]);
    });
    names = get(waitForAll(obj));
    setLocalNames(network.url, names);
  }
  return accounts.map(({ address, index }) => ({ address, index, names: names?.[address] || [] }));
});

accountNameState.debugLabel = 'accountNameState';
