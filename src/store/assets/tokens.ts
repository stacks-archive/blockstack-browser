import { atom } from 'jotai';
import deepEqual from 'fast-deep-equal';
import { atomFamily, waitForAll } from 'jotai/utils';
import {
  currentAccountAvailableStxBalanceState,
  accountUnanchoredBalancesState,
  currentAccountDataState,
} from '@store/accounts';
import { transformAssets } from '@store/assets/utils';
import { Asset, AssetWithMeta, ContractPrincipal, NftMeta } from '@common/asset-types';
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

export const assetsState = atom(get =>
  get(waitForAll(transformAssets(get(currentAccountDataState)?.balances).map(assetItemState)))
);

export const assetsUnanchoredState = atom(get =>
  get(
    waitForAll(
      transformAssets(get(currentAccountDataState)?.unanchoredBalances).map(assetItemState)
    )
  )
);

export const transferableAssetsState = atom(get =>
  get(assetsState)?.filter(asset => asset.canTransfer)
);

export const mergeAssetBalances = (
  assets: AssetWithMeta[],
  unanchoredAssets: AssetWithMeta[],
  assetType: string
) => {
  const assetMap = new Map();
  // Merge both balances (unanchored and anchored)
  assets.forEach(
    asset =>
      asset.type === assetType && assetMap.set(asset.subtitle, { ...asset, ...{ subBalance: '0' } })
  );
  unanchoredAssets.forEach(asset => {
    if (asset.type !== assetType) return;
    if (!assetMap.has(asset.subtitle)) {
      assetMap.set(asset.subtitle, { ...asset, ...{ subBalance: asset.balance, balance: '0' } });
    } else {
      assetMap.get(asset.subtitle).subBalance = asset.balance;
    }
  });
  return [...assetMap.values()];
};

const calculateBalanceByType = atomFamily((assetType: string) =>
  atom(get => {
    const assets: AssetWithMeta[] = get(assetsState);
    const unanchoredAssets: AssetWithMeta[] = get(assetsUnanchoredState);
    return mergeAssetBalances(assets, unanchoredAssets, assetType);
  })
);

export const fungibleTokensState = calculateBalanceByType('ft');

export type NftMetaRecord = Record<string, NftMeta>;

export const mergeNftBalances = (anchoredNfts: NftMetaRecord, unanchoredNfts: NftMetaRecord) => {
  const assets = Object.keys(anchoredNfts);
  const assetMap = new Map();
  // Merge both balances (unanchored and anchored)
  assets.forEach(asset =>
    assetMap.set(asset, { ...anchoredNfts[asset], ...{ subCount: '0', key: asset } })
  );

  Object.keys(unanchoredNfts).forEach(key => {
    const asset = unanchoredNfts[key];
    if (!assetMap.has(key)) {
      assetMap.set(key, { ...asset, ...{ subCount: asset.count, count: '0', key } });
    } else {
      assetMap.get(key).subCount = asset.count;
    }
  });

  return [...assetMap.values()];
};

export const nonFungibleTokensState = atom(get => {
  const balances = get(currentAccountDataState)?.balances;
  const unanchoredBalances = get(currentAccountDataState)?.unanchoredBalances;
  const anchoredNfts = balances?.non_fungible_tokens || {};
  const unanchoredNfts = unanchoredBalances?.non_fungible_tokens || {};
  const noCollectibles =
    Object.keys(anchoredNfts).length === 0 && Object.keys(unanchoredNfts).length === 0;

  if (noCollectibles) return [];
  return mergeNftBalances(anchoredNfts, unanchoredNfts);
});

export const stxTokenState = atom(get => {
  const balances = get(currentAccountAvailableStxBalanceState);
  const unanchoredBalances = get(accountUnanchoredBalancesState);

  if (
    !balances ||
    balances.stx.balance.isEqualTo(0) ||
    !unanchoredBalances ||
    unanchoredBalances.stx.balance.isEqualTo(0)
  )
    return;
  return {
    type: 'stx',
    contractAddress: '',
    balance: new BigNumber(balances.stx.balance),
    subBalance: new BigNumber(unanchoredBalances.stx.balance),
    subtitle: 'STX',
    name: 'Stacks Token',
  } as AssetWithMeta;
});

assetsState.debugLabel = 'assetsState';
transferableAssetsState.debugLabel = 'transferableAssetsState';
fungibleTokensState.debugLabel = 'fungibleTokensState';
nonFungibleTokensState.debugLabel = 'nonFungibleTokensState';
stxTokenState.debugLabel = 'stxTokenState';
