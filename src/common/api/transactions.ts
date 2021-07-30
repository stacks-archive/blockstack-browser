import type {
  MempoolTransactionListResponse,
  MempoolTransaction,
  Transaction,
} from '@stacks/stacks-blockchain-api-types';
import { fetcher } from '@common/api/wrapped-fetch';

export type Tx = MempoolTransaction | Transaction;

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

export type Statuses = 'success_microblock' | 'success_anchor_block' | 'pending' | 'failed';

export const statusFromTx = (tx: Tx): Statuses => {
  let { tx_status } = tx;
  if (tx_status === 'pending') return 'pending';
  if (tx_status === 'success')
    return 'is_unanchored' in tx && tx.is_unanchored
      ? 'success_microblock'
      : 'success_anchor_block';
  return 'failed';
};
