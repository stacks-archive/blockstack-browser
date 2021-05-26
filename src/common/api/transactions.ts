import {
  MempoolTransaction,
  MempoolTransactionListResponse,
} from '@blockstack/stacks-blockchain-api-types';
import { fetcher } from '@common/api/wrapped-fetch';

interface GetKeyOptions {
  index: number;
  type: 'tx' | 'block';
  limit: number;
  pending?: boolean;
  types?: string[];
  apiServer?: string;
}

export const constructLimitAndOffsetQueryParams = (limit: number, offset?: number): string =>
  `limit=${limit}${offset ? `&offset=${offset}` : ''}`;

const generateTypesQueryString = (types?: string[]) => {
  if (types?.length) {
    return `&${types
      .map(type => `${encodeURIComponent('type[]')}=${encodeURIComponent(type)}`)
      .join('&')}`;
  }
  return '';
};

export const makeKey = (options: GetKeyOptions) => {
  const { index, type, limit, pending, types, apiServer } = options;
  return `${apiServer as string}/extended/v1/${type}${
    pending ? '/mempool' : ''
  }?${constructLimitAndOffsetQueryParams(limit, index + 1 === 1 ? 0 : limit * index + 1)}${
    types ? generateTypesQueryString(types) : ''
  }`;
};

export const fetchPendingTxs =
  (apiServer: string) =>
  async ({ query, type }: { query: string; type: 'principal' | 'tx_id' }) => {
    const path = makeKey({
      type: 'tx',
      limit: 30,
      pending: true,
      index: 0,
      apiServer,
    });

    const res = await fetcher(path);
    const mempool: MempoolTransactionListResponse = await res.json();

    if (type === 'principal') {
      const pendingTransactions =
        mempool?.results?.filter(
          (tx: MempoolTransaction) =>
            ((tx.tx_type === 'smart_contract' ||
              tx.tx_type === 'contract_call' ||
              tx.tx_type === 'token_transfer') &&
              tx.sender_address === query) ||
            (tx.tx_type === 'token_transfer' && tx.token_transfer.recipient_address === query)
        ) || [];

      return pendingTransactions;
    } else {
      return mempool?.results?.find(
        (tx: MempoolTransaction) => tx.tx_id === query
      ) as MempoolTransaction;
    }
  };
