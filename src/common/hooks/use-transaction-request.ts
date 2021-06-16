import { requestTokenPayloadState } from '@store/transactions/requests';
import { useAtomValue } from 'jotai/utils';

export function useTransactionRequest() {
  return useAtomValue(requestTokenPayloadState);
}
