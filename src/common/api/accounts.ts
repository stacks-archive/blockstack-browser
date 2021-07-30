import type {
  AddressBalanceResponse,
  MempoolTransaction,
  TransactionResults,
} from '@stacks/stacks-blockchain-api-types';

import { fetchPendingTxs } from '@common/api/transactions';
import { fetchFromSidecar } from '@common/api/fetch';

export const fetchBalances =
  (apiServer: string) =>
  (principal: string): Promise<AddressBalanceResponse> => {
    const path = `/address/${principal}/balances`;
    return fetchFromSidecar(apiServer)(path, {}, false);
  };

export const fetchUnanchoredBalances =
  (apiServer: string) =>
  (principal: string): Promise<AddressBalanceResponse> => {
    const path = `/address/${principal}/balances`;
    return fetchFromSidecar(apiServer)(path, {}, true);
  };

export const fetchTransactions =
  (apiServer: string) =>
  (principal: string): Promise<TransactionResults> => {
    const path = `/address/${principal}/transactions?limit=50`;
    return fetchFromSidecar(apiServer)(path);
  };

export interface AllAccountData {
  balances: AddressBalanceResponse;
  unanchoredBalances: AddressBalanceResponse;
  transactions: TransactionResults;
  pendingTransactions: MempoolTransaction[];
}

export const fetchAllAccountData =
  (apiServer: string) =>
  async (principal: string): Promise<AllAccountData> => {
    const [balances, unanchoredBalances, transactions, pendingTransactions] = await Promise.all([
      fetchBalances(apiServer)(principal),
      fetchUnanchoredBalances(apiServer)(principal),
      fetchTransactions(apiServer)(principal),
      fetchPendingTxs(apiServer)({ query: principal }),
    ]);

    return { balances, unanchoredBalances, transactions, pendingTransactions };
  };
