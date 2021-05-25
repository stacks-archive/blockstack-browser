import { useTransactionRequest } from '@common/hooks/use-transaction';
import { useMemo } from 'react';
import { TransactionTypes } from '@stacks/connect';

export function useTransactionPageTitle() {
  const transactionRequest = useTransactionRequest();
  const txType = transactionRequest?.txType;
  return useMemo(() => {
    if (!transactionRequest) return;
    if (txType === TransactionTypes.STXTransfer) return 'Confirm transfer';
    if (txType === TransactionTypes.ContractDeploy) return 'Deploy contract';
    if (txType === TransactionTypes.ContractCall && 'functionName' in transactionRequest)
      return transactionRequest.functionName || 'Sign transaction';
    return 'Sign transaction';
  }, [transactionRequest, txType]);
}
