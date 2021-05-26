import { selector, waitForAll } from 'recoil';
import { selectedAssetStore } from '@store/assets/asset-search';
import {
  accountBalancesState,
  currentAccountState,
  currentAccountStxAddressState,
} from '@store/accounts';
import { currentStacksNetworkState } from '@store/networks';
import { correctNonceState } from '@store/accounts/nonce';

enum KEYS {
  ASSET_STATE = 'transaction/ASSET_STATE',
}

export const makeFungibleTokenTransferState = selector({
  key: KEYS.ASSET_STATE,
  get: ({ get }) => {
    const { asset, currentAccount, network, balances, stxAddress, nonce } = get(
      waitForAll({
        asset: selectedAssetStore,
        currentAccount: currentAccountState,
        network: currentStacksNetworkState,
        balances: accountBalancesState,
        stxAddress: currentAccountStxAddressState,
        nonce: correctNonceState,
      })
    );

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
    }
    return;
  },
});
