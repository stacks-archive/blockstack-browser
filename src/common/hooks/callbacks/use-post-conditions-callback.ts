import { CallbackInterface, useRecoilCallback } from 'recoil';
import { postConditionsStore, transactionPayloadStore } from '@store/recoil/transaction';
import { getPostCondition, handlePostConditions } from '@common/post-condition-utils';

export function usePostConditionsCallback() {
  return useRecoilCallback(postConditionsCallback, []);
}

function postConditionsCallback({ snapshot, set }: CallbackInterface) {
  return async (currentAddress?: string) => {
    const [payload, existingPostConditions] = await Promise.all([
      snapshot.getPromise(transactionPayloadStore),
      snapshot.getPromise(postConditionsStore),
    ]);
    if (!payload) return;

    const { stxAddress, postConditions } = payload;

    if (existingPostConditions.length) {
      if (stxAddress && currentAddress) {
        // we have existing post conditions, lets ensure
        // the principal(s) are set correctly
        const newConditions = handlePostConditions(
          existingPostConditions,
          stxAddress,
          currentAddress
        );
        set(postConditionsStore, newConditions);
        return;
      }
    } else if (postConditions && postConditions.length) {
      if (stxAddress && currentAddress) {
        // we have yet to set the post conditions to the store
        // let's ensure the principal(s) are set correctly
        const newConditions = handlePostConditions(postConditions, stxAddress, currentAddress);
        set(postConditionsStore, newConditions);
        return;
      }
      // there is no `stxAddress` set, but it might be
      // the case that a post condition is of string type
      // so let's map over them and deserialize them
      const newConditions = postConditions.map(getPostCondition);
      set(postConditionsStore, newConditions);
      return;
    }
  };
}
