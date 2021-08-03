import { atom } from 'jotai';
import { currentNetworkState } from '@store/networks';
import { fetcher as fetchApi } from '@common/api/wrapped-fetch';

import {
  Configuration,
  AccountsApi,
  SmartContractsApi,
  InfoApi,
  TransactionsApi,
  BlocksApi,
  FaucetsApi,
  BnsApi,
  BurnchainApi,
  FeesApi,
  SearchApi,
  RosettaApi,
  // MicroblocksApi,
} from '@stacks/blockchain-api-client';

import type { Middleware, RequestContext } from '@stacks/blockchain-api-client';
import { MICROBLOCKS_ENABLED } from '@common/constants';

/**
 * Our mega api clients function. This is a combo of all clients that the blockchain-api-client package offers.
 * @param config - the `@stacks/blockchain-api-client` configuration object
 */
export function apiClients(config: Configuration) {
  const smartContractsApi = new SmartContractsApi(config);
  const accountsApi = new AccountsApi(config);
  const infoApi = new InfoApi(config);
  const transactionsApi = new TransactionsApi(config);
  // const microblocksApi = new MicroblocksApi(config);
  const blocksApi = new BlocksApi(config);
  const faucetsApi = new FaucetsApi(config);
  const bnsApi = new BnsApi(config);
  const burnchainApi = new BurnchainApi(config);
  const feesApi = new FeesApi(config);
  const searchApi = new SearchApi(config);
  const rosettaApi = new RosettaApi(config);

  return {
    smartContractsApi,
    accountsApi,
    infoApi,
    transactionsApi,
    // microblocksApi,
    blocksApi,
    faucetsApi,
    bnsApi,
    burnchainApi,
    feesApi,
    searchApi,
    rosettaApi,
  };
}

// this is used to enable automatic passing of `unanchored=true` to all requests
const unanchoredMiddleware: Middleware = {
  pre: (context: RequestContext) => {
    const url = new URL(context.url);
    if (!url.toString().includes('/v2')) url.searchParams.set('unanchored', 'true');
    return Promise.resolve({
      init: context.init,
      url: url.toString(),
    });
  },
};

function createConfig(basePath: string) {
  const middleware: Middleware[] = [];
  if (MICROBLOCKS_ENABLED) middleware.push(unanchoredMiddleware);
  return new Configuration({
    basePath,
    fetchApi,
    middleware,
  });
}

export const apiClientState = atom(get => {
  const network = get(currentNetworkState);
  const config = createConfig(network.url);
  return apiClients(config);
});
