import { useAtomValue } from 'jotai/utils';

import { feeRateState } from '@store/common/api-request';

export function useCurrentFee() {
  return useAtomValue(feeRateState);
}
