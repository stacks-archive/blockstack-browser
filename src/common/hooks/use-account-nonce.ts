import { useLoadable } from '@common/hooks/use-loadable';
import { accountInfoStore } from '@store/accounts';

export function useAccountNonce() {
  const data = useLoadable(accountInfoStore);
  return data.value?.nonce;
}
