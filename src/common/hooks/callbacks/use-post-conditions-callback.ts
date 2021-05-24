import { CallbackInterface, useRecoilCallback } from 'recoil';
import {
  postConditionsHasSetStore,
  postConditionsStore,
  transactionPayloadStore,
} from '@store/transaction';
import { getPostCondition, handlePostConditions } from '@common/post-condition-utils';
import { currentAccountStxAddressStore } from '@store/accounts';

export function usePostConditionsCallback() {
  return useRecoilCallback(postConditionsCallback, []);
}

function postConditionsCallback({ snapshot, set }: CallbackInterface) {
  return async (useCurrentAddress?: boolean) => {
    const [payload, existingPostConditions, hasSet, currentAddress] = await Promise.all([
      snapshot.getPromise(transactionPayloadStore),
      snapshot.getPromise(postConditionsStore),
      snapshot.getPromise(postConditionsHasSetStore),
      snapshot.getPromise(currentAccountStxAddressStore),
    ]);
    if (!payload) return;

    const { stxAddress, postConditions } = payload;

    if (hasSet || !currentAddress) return;

    if (!hasSet && postConditions && postConditions.length) {
      if (stxAddress && useCurrentAddress) {
        // we have yet to set the post conditions to the store
        // let's ensure the principal(s) are set correctly
        const newConditions = handlePostConditions(postConditions, stxAddress, currentAddress);
        set(postConditionsStore, newConditions);
        set(postConditionsHasSetStore, true);
        return;
      }
      // there is no `stxAddress` set, but it might be
      // the case that a post condition is of string type
      // so let's map over them and deserialize them
      const newConditions = postConditions.map(getPostCondition);
      set(postConditionsStore, newConditions);
      set(postConditionsHasSetStore, true);
      return;
    } else if (!hasSet && existingPostConditions.length) {
      if (stxAddress && useCurrentAddress) {
        // we have existing post conditions, lets ensure
        // the principal(s) are set correctly
        const newConditions = handlePostConditions(
          existingPostConditions,
          stxAddress,
          currentAddress
        );
        set(postConditionsStore, newConditions);
        set(postConditionsHasSetStore, true);
        return;
      }
    }
  };
}
