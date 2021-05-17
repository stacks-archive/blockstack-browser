import { useLoadable } from '@common/hooks/use-loadable';
import { accountInfoStore } from '@store/api';

export function useAccountNonce() {
  const data = useLoadable(accountInfoStore);
  return data.value?.nonce;
}
