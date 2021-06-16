import { atom } from 'jotai';
import { selectedAssetStore } from '@store/assets/asset-search';
import {
  accountBalancesState,
  currentAccountState,
  currentAccountStxAddressState,
} from '@store/accounts';
import { currentStacksNetworkState } from '@store/networks';
import { correctNonceState } from '@store/accounts/nonce';
import { waitForAll } from 'jotai/utils';

export const makeFungibleTokenTransferState = atom(get => {
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
});

makeFungibleTokenTransferState.debugLabel = 'makeFungibleTokenTransferState';
