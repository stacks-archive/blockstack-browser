import { selector } from 'recoil';
import { currentNetworkState } from '@store/networks';
import {
  Configuration,
  AccountsApi,
  SmartContractsApi,
  InfoApi,
  BlocksApi,
} from '@stacks/blockchain-api-client';
import { fetcher } from '@common/api/wrapped-fetch';

enum API_CLIENT_KEYS {
  CONFIG = 'clients/CONFIG',
  SMART_CONTRACTS = 'clients/SMART_CONTRACTS',
  ACCOUNTS = 'clients/ACCOUNTS',
  INFO = 'clients/INFO',
  BLOCKS = 'clients/BLOCKS',
}

export const apiClientConfiguration = selector({
  key: API_CLIENT_KEYS.CONFIG,
  get: ({ get }) => {
    const network = get(currentNetworkState);
    return new Configuration({ basePath: network.url, fetchApi: fetcher });
  },
});

export const smartContractClientState = selector({
  key: API_CLIENT_KEYS.SMART_CONTRACTS,
  get: ({ get }) => {
    const config = get(apiClientConfiguration);
    return new SmartContractsApi(config);
  },
});

export const accountsApiClientState = selector({
  key: API_CLIENT_KEYS.ACCOUNTS,
  get: ({ get }) => {
    const config = get(apiClientConfiguration);
    return new AccountsApi(config);
  },
});

export const infoApiClientState = selector({
  key: API_CLIENT_KEYS.INFO,
  get: ({ get }) => {
    const config = get(apiClientConfiguration);
    return new InfoApi(config);
  },
});

export const blocksApiClientState = selector({
  key: API_CLIENT_KEYS.BLOCKS,
  get: ({ get }) => {
    const config = get(apiClientConfiguration);
    return new BlocksApi(config);
  },
});
