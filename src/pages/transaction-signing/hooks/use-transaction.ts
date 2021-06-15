import { useLoadable } from '@common/hooks/use-loadable';
import { postConditionsState, signedTransactionState } from '@store/transactions';
import {
  transactionContractInterfaceState,
  transactionContractSourceState,
  transactionFunctionsState,
} from '@store/transactions/contract-call';

export function useTransactionContractInterface() {
  return useLoadable(transactionContractInterfaceState);
}

export function useTransactionContractSource() {
  return useLoadable(transactionContractSourceState);
}

export function useTransactionFunction() {
  const payload = useLoadable(transactionFunctionsState);
  return payload?.value;
}

export function useTransactionPostConditions() {
  const payload = useLoadable(postConditionsState);
  return payload?.value;
}

export function useSignedTransaction() {
  return useLoadable(signedTransactionState);
}
