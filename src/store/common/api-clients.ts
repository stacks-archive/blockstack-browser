import { selector } from 'recoil';
import { currentNetworkState } from '@store/networks';
import {
  Configuration,
  AccountsApi,
  SmartContractsApi,
  InfoApi,
  BlocksApi,
} from '@stacks/blockchain-api-client';
import { fetcher } from '@common/wrapped-fetch';

export const apiClientConfiguration = selector({
  key: 'clients.config',
  get: ({ get }) => {
    const network = get(currentNetworkState);
    return new Configuration({ basePath: network.url, fetchApi: fetcher });
  },
});

export const smartContractClientState = selector({
  key: 'clients.smart-contract',
  get: ({ get }) => {
    const config = get(apiClientConfiguration);
    return new SmartContractsApi(config);
  },
});

export const accountsApiClientState = selector({
  key: 'clients.accounts',
  get: ({ get }) => {
    const config = get(apiClientConfiguration);
    return new AccountsApi(config);
  },
});

export const infoApiClientState = selector({
  key: 'clients.info',
  get: ({ get }) => {
    const config = get(apiClientConfiguration);
    return new InfoApi(config);
  },
});

export const blocksApiClientState = selector({
  key: 'clients.blocks',
  get: ({ get }) => {
    const config = get(apiClientConfiguration);
    return new BlocksApi(config);
  },
});
