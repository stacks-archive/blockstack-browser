import { useSignedTransaction } from '@common/hooks/use-transaction';
import { AuthType } from '@stacks/transactions';

export function useTransactionFee() {
  const signedTransaction = useSignedTransaction();
  if (!signedTransaction.value) return;
  const isSponsored = signedTransaction.value.auth.authType === AuthType.Sponsored;
  const amount = signedTransaction.value.auth.spendingCondition?.fee?.toNumber();
  return {
    amount,
    isSponsored,
  };
}
