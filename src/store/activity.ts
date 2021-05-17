import { selector } from 'recoil';
import { accountDataStore } from '@store/api';

export const accountTransactionsState = selector({
  key: 'activity.transactions',
  get: async ({ get }) => {
    const data = get(accountDataStore);
    const transactions = data?.transactions?.results || [];
    const pending = data?.pendingTransactions || [];
    return [...pending, ...transactions];
  },
});
