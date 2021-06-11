import { atom } from 'jotai';
import { feesApiClientState } from '@store/common/api-clients';

export const feeRateState = atom(async get => {
  return get(feesApiClientState).getFeeTransfer() as unknown as Promise<number>;
});
