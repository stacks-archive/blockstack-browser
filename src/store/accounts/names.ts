import { atom } from 'jotai';
import { accountsWithAddressState } from './index';
import { currentNetworkState } from '@store/networks';
import { fetchNamesByAddress } from '@common/api/names';
import { atomFamilyWithQuery } from '@store/query';
import { makeLocalDataKey } from '@store/common/utils';

function getLocalNames(networkUrl: string, address: string) {
  const key = makeLocalDataKey([networkUrl, address, 'BNS_NAMES']);
  const value = localStorage.getItem(key);
  if (!value) return null;
  const [data, date] = JSON.parse(value);
  const now = Date.now();
  if (now - date > STALE_TIME) return null;
  return data as string[];
}

function setLocalNames(networkUrl: string, address: string, data: string[]): void {
  const key = makeLocalDataKey([networkUrl, address, 'BNS_NAMES']);
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
  async (_get, [address, networkUrl]) => {
    let data = getLocalNames(networkUrl, address);
    if (data) return data;
    data = await fetchNamesByAddress(networkUrl, address);
    setLocalNames(networkUrl, address, data);
    return data;
  },
  { keepPreviousData: true }
);

export const accountNameState = atom<AccountNameState>(get => {
  const accounts = get(accountsWithAddressState);
  const network = get(currentNetworkState);
  if (!network || !accounts) return null;
  return accounts.map(({ address, index }) => ({
    address,
    index,
    names: get(namesResponseState([address, network.url])) || [],
  }));
});

accountNameState.debugLabel = 'accountNameState';
