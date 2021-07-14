import { atom } from 'jotai';
import { selectedAssetStore } from '@store/assets/asset-search';
import {
  accountBalancesState,
  currentAccountState,
  currentAccountStxAddressState,
} from '@store/accounts';
import { currentStacksNetworkState } from '@store/networks';
import { correctNonceState } from '@store/accounts/nonce';

export const makeFungibleTokenTransferState = atom(get => {
  const asset = get(selectedAssetStore);
  const currentAccount = get(currentAccountState);
  const network = get(currentStacksNetworkState);
  const balances = get(accountBalancesState);
  const stxAddress = get(currentAccountStxAddressState);
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
  }
  return;
});

makeFungibleTokenTransferState.debugLabel = 'makeFungibleTokenTransferState';
