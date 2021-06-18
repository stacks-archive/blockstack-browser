import { atom } from 'jotai';
import deepEqual from 'fast-deep-equal';
import { atomFamily, waitForAll } from 'jotai/utils';
import { accountBalancesState } from '@store/accounts';
import { transformAssets } from '@store/assets/utils';
import { Asset, AssetWithMeta, ContractPrincipal } from '@store/assets/types';
import { assetMetaDataState } from '@store/assets/fungible-tokens';
import { contractInterfaceState } from '@store/contracts';
import { isSip10Transfer } from '@common/token-utils';
import { currentNetworkState } from '@store/networks';

const transferDataState = atomFamily<ContractPrincipal, any>(
  ({ contractAddress, contractName }) => {
    const anAtom = atom(get => {
      const contractInterface = get(
        contractInterfaceState({
          contractName,
          contractAddress,
        })
      );
      if (!contractInterface) return;
      return isSip10Transfer(contractInterface);
    });
    anAtom.debugLabel = `transferDataState/${contractAddress}.${contractName}`;
    return anAtom;
  },
  deepEqual
);

const assetItemState = atomFamily<Asset, AssetWithMeta>(asset => {
  const anAtom = atom(get => {
    const network = get(currentNetworkState);
    if (asset.type === 'ft') {
      const transferData = get(
        transferDataState({
          contractName: asset.contractName,
          contractAddress: asset.contractAddress,
        })
      );
      const meta = get(
        assetMetaDataState({
          contractAddress: asset.contractAddress,
          contractName: asset.contractName,
          networkUrl: network.url,
        })
      );
      const canTransfer = !(!transferData || 'error' in transferData);
      const hasMemo = transferData && !('error' in transferData) && transferData.hasMemo;
      return { ...asset, meta, canTransfer, hasMemo } as AssetWithMeta;
    }
    return asset as AssetWithMeta;
  });
  anAtom.debugLabel = `assetItemState/${asset.contractAddress}.${asset.contractName}::${asset.name}`;
  return anAtom;
}, deepEqual);

export const baseAssetsState = atom(get => {
  const balance = get(accountBalancesState);
  return balance ? transformAssets(balance) : undefined;
});

export const assetsState = atom(get => {
  const assets = get(baseAssetsState) || [];
  return get(waitForAll(assets.map(assetItemState)));
});

export const transferableAssetsState = atom(get =>
  get(assetsState)?.filter(asset => asset.canTransfer)
);

export const fungibleTokensState = atom(get => {
  const assets = get(assetsState);
  return assets?.filter(asset => asset.type === 'ft');
});
export const nonFungibleTokensState = atom(get => {
  const assets = get(assetsState);
  return assets?.filter(asset => asset.type !== 'nft');
});
export const stxTokenState = atom(get => {
  const balances = get(accountBalancesState);
  if (!balances || balances.stx.balance === '0') return;
  return {
    type: 'stx',
    contractAddress: '',
    balance: balances.stx.balance,
    subtitle: 'STX',
    name: 'Stacks Token',
  } as AssetWithMeta;
});

baseAssetsState.debugLabel = 'baseAssetsState';
assetsState.debugLabel = 'assetsState';
transferableAssetsState.debugLabel = 'transferableAssetsState';
fungibleTokensState.debugLabel = 'fungibleTokensState';
nonFungibleTokensState.debugLabel = 'nonFungibleTokensState';
stxTokenState.debugLabel = 'stxTokenState';
