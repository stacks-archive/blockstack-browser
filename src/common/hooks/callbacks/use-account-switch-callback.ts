import { CallbackInterface, useRecoilCallback } from 'recoil';
import { postConditionsHasSetStore, transactionPayloadStore } from '@store/transaction';
import { walletState } from '@store/wallet';
import { currentAccountIndexStore } from '@store/accounts';
import { getStxAddress } from '@stacks/wallet-sdk';

function accountSwitchCallback({ snapshot, set }: CallbackInterface) {
  return async () => {
    const payload = await snapshot.getPromise(transactionPayloadStore);
    if (!payload?.stxAddress || !payload.network) return;
    const wallet = await snapshot.getPromise(walletState);
    if (!wallet) return;
    const transactionVersion = payload.network.version;
    let foundIndex: number | undefined = undefined;
    wallet.accounts.forEach((account, index) => {
      const address = getStxAddress({ account, transactionVersion });
      if (address === payload.stxAddress) {
        foundIndex = index;
      }
    });
    if (foundIndex !== undefined) {
      console.debug('switching to index', foundIndex);
      set(currentAccountIndexStore, foundIndex);
      set(postConditionsHasSetStore, false);
    } else {
      console.warn(
        'No account matches the STX address provided in transaction request:',
        payload.stxAddress
      );
    }
  };
}

/**
 * Apps can specify a `stxAddress` in a transaction request.
 * If the user has a matching account, use that account by default.
 */
export function useAccountSwitchCallback() {
  return useRecoilCallback(accountSwitchCallback, []);
}
