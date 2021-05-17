import { selector } from 'recoil';
import { selectedAssetStore } from '@store/asset-search';
import { currentAccountStore, currentAccountStxAddressStore } from '@store/wallet';
import { stacksNetworkStore } from '@store/networks';
import { accountBalancesStore, correctNonceState } from '@store/api';

export const makeFungibleTokenTransferState = selector({
  key: 'transaction.internal-transaction-asset',
  get: ({ get }) => {
    const asset = get(selectedAssetStore);
    const currentAccount = get(currentAccountStore);
    const network = get(stacksNetworkStore);
    const balances = get(accountBalancesStore);
    const stxAddress = get(currentAccountStxAddressStore);
    const nonce = get(correctNonceState);
    if (asset && currentAccount && stxAddress) {
      const { contractName, contractAddress, name: assetName } = asset;
      return {
        asset,
        stxAddress,
        nonce,
        balances,
        network,
        senderKey: currentAccount.stxPrivateKey,
        assetName,
        contractAddress,
        contractName,
      };
    } else {
      console.error('[makeFungibleTokenTransferState]: malformed state');
    }

    return;
  },
});
