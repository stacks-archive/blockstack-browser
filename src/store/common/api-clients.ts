import { atom } from 'jotai';
import { currentNetworkState } from '@store/networks';
import {
  Configuration,
  AccountsApi,
  SmartContractsApi,
  InfoApi,
  BlocksApi,
  FeesApi,
} from '@stacks/blockchain-api-client';
import { fetcher } from '@common/api/wrapped-fetch';

export const apiClientConfiguration = atom<Configuration>(get => {
  const network = get(currentNetworkState);
  return new Configuration({ basePath: network.url, fetchApi: fetcher });
});

export const smartContractClientState = atom<SmartContractsApi>(get => {
  const config = get(apiClientConfiguration);
  return new SmartContractsApi(config);
});

export const accountsApiClientState = atom<AccountsApi>(get => {
  const config = get(apiClientConfiguration);
  return new AccountsApi(config);
});

export const infoApiClientState = atom<InfoApi>(get => {
  const config = get(apiClientConfiguration);
  return new InfoApi(config);
});

export const blocksApiClientState = atom<BlocksApi>(get => {
  const config = get(apiClientConfiguration);
  return new BlocksApi(config);
});

export const feesApiClientState = atom<FeesApi>(get => {
  const config = get(apiClientConfiguration);
  return new FeesApi(config);
});
