import { atom } from 'jotai';
import { waitForAll } from 'jotai/utils';
import { requestTokenPayloadState } from '@store/transactions/requests';
import { currentAccountStxAddressState } from '@store/accounts';
import { getPostCondition, handlePostConditions } from '@common/transactions/postcondition-utils';

export const postConditionsState = atom(get => {
  const { payload, address } = get(
    waitForAll({
      payload: requestTokenPayloadState,
      address: currentAccountStxAddressState,
    })
  );

  if (!payload || !address) return;

  if (payload.postConditions) {
    if (payload.stxAddress)
      return handlePostConditions(payload.postConditions, payload.stxAddress, address);

    return payload.postConditions.map(getPostCondition);
  }
  return [];
});
