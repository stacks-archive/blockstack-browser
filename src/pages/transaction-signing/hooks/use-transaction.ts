import { useAtomValue } from 'jotai/utils';
import { signedTransactionState } from '@store/transactions';
import {
  transactionContractInterfaceState,
  transactionContractSourceState,
  transactionFunctionsState,
} from '@store/transactions/contract-call';
import { postConditionsState } from '@store/transactions/post-conditions';

export function useTransactionContractInterface() {
  return useAtomValue(transactionContractInterfaceState);
}

export function useTransactionContractSource() {
  return useAtomValue(transactionContractSourceState);
}

export function useTransactionFunction() {
  return useAtomValue(transactionFunctionsState);
}

export function useTransactionPostConditions() {
  return useAtomValue(postConditionsState);
}

export function useSignedTransaction() {
  return useAtomValue(signedTransactionState);
}
