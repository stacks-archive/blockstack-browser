import { useSignedTransaction } from '@common/hooks/transaction/use-transaction';

export function useTransactionFee() {
  const signedTransaction = useSignedTransaction();

  return {
    amount: signedTransaction?.value?.fee,
    isSponsored: signedTransaction?.value?.isSponsored,
    isLoading: signedTransaction.isLoading,
  };
}
