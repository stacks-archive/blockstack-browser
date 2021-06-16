import { useAtomValue } from 'jotai/utils';
import { transactionFeeState, transactionSponsoredState } from '@store/transactions';

export function useTransactionFee() {
  const amount = useAtomValue(transactionFeeState);
  const isSponsored = useAtomValue(transactionSponsoredState);

  return {
    amount,
    isSponsored,
  };
}
