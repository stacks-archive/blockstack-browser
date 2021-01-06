import type {
  AddressBalanceResponse,
  MempoolTransaction,
  TransactionResults,
} from '@blockstack/stacks-blockchain-api-types';

import { fetchPendingTxs } from '@common/api/transactions';
import { fetchFromSidecar } from '@common/api/fetch';

export const fetchBalances = (apiServer: string) => async (
  principal: string
): Promise<AddressBalanceResponse> => {
  const path = `/address/${principal}/balances`;
  const res = await fetchFromSidecar(apiServer)(path);
  return res.json();
};

export const fetchTransactions = (apiServer: string) => async (
  principal: string
): Promise<TransactionResults> => {
  const path = `/address/${principal}/transactions?limit=50`;
  const res = await fetchFromSidecar(apiServer)(path);
  const final = await res.json();

  return final;
};

export interface AllAccountData {
  balances: AddressBalanceResponse;
  transactions: TransactionResults;
  pendingTransactions: MempoolTransaction[];
}

export const fetchAllAccountData = (apiServer: string) => async (
  principal: string
): Promise<AllAccountData> => {
  const [balances, transactions, pendingTransactions] = await Promise.all([
    fetchBalances(apiServer)(principal),
    fetchTransactions(apiServer)(principal),
    fetchPendingTxs(apiServer)({ query: principal, type: 'principal' }),
  ]);

  return {
    balances,
    transactions,
    pendingTransactions: pendingTransactions as MempoolTransaction[],
  };
};
