import { useLoadable } from '@common/hooks/use-loadable';
import { requestTokenPayloadState } from '@store/transactions/requests';

export function useTransactionRequest() {
  const payload = useLoadable(requestTokenPayloadState);
  return payload?.value;
}
