import type { MempoolTransactionListResponse } from '@stacks/stacks-blockchain-api-types';
import { fetcher } from '@common/api/wrapped-fetch';

function makeMempoolTransactionApiUrl(apiServer: string) {
  return `${apiServer}/extended/v1/tx/mempool`;
}

export function fetchPendingTxs(apiServer: string) {
  return async ({ query }: { query: string }) => {
    const path = makeMempoolTransactionApiUrl(apiServer) + `?address=${query}`;
    const res = await fetcher(path);
    const mempool: MempoolTransactionListResponse = await res.json();
    return mempool.results;
  };
}
