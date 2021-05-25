import { useLoadable } from '@common/hooks/use-loadable';
import { postConditionsState } from '@store/transactions';

export function usePostconditions() {
  return useLoadable(postConditionsState);
}
