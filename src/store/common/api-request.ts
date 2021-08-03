import { atom } from 'jotai';
import { apiClientState } from '@store/common/api-clients';

export const feeRateState = atom(async get => {
  const { feesApi } = get(apiClientState);
  return feesApi.getFeeTransfer() as unknown as Promise<number>;
});
