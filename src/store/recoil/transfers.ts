// A recoil selector used for creating internal transactions
import { selector } from 'recoil';
import { selectedAssetStore } from '@store/recoil/asset-search';
import { currentAccountStore, currentAccountStxAddressStore } from '@store/recoil/wallet';
import { stacksNetworkStore } from '@store/recoil/networks';
import { accountBalancesStore, correctNonceStore } from '@store/recoil/api';
import { getAssetStringParts } from '@stacks/ui-utils';

export const makeFungibleTokenTransferState = selector({
  key: 'transaction.internal-transaction-asset',
  get: ({ get }) => {
    const asset = get(selectedAssetStore);
    const currentAccount = get(currentAccountStore);
    const network = get(stacksNetworkStore);
    const balances = get(accountBalancesStore);
    const stxAddress = get(currentAccountStxAddressStore);
    const nonce = get(correctNonceStore);
    if (asset && currentAccount && stxAddress) {
      const { address: contractAddress, contractName, assetName } = getAssetStringParts(
        asset.contractAddress
      );
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
    }

    return;
  },
});
