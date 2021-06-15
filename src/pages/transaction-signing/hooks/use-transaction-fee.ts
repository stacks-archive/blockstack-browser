import { useSignedTransaction } from './use-transaction';

export function useTransactionFee() {
  const signedTransaction = useSignedTransaction();

  return {
    amount: signedTransaction?.value?.fee,
    isSponsored: signedTransaction?.value?.isSponsored,
    isLoading: signedTransaction.isLoading,
  };
}
