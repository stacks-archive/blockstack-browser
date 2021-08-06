import { useCallback, useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';
import { selectedAssetIdState, selectedAssetStore } from '@store/assets/asset-search';
import { AssetWithMeta } from '@common/asset-types';
import { getTicker } from '@common/utils';
import { ftDecimals, stacksValue } from '@common/stacks-utils';
import { useCurrentAccountAvailableStxBalance } from '@common/hooks/use-available-stx-balance';

export function getFullyQualifiedAssetName(asset?: AssetWithMeta) {
  return asset ? `${asset.contractAddress}.${asset.contractName}::${asset.name}` : undefined;
}

export function useSelectedAsset() {
  const selectedAsset = useAtomValue(selectedAssetStore);
  const setSelectedAsset = useUpdateAtom(selectedAssetIdState);
  const availableStxBalance = useCurrentAccountAvailableStxBalance();
  const handleUpdateSelectedAsset = useCallback(
    (asset: AssetWithMeta | undefined) => {
      setSelectedAsset(getFullyQualifiedAssetName(asset) || undefined);
    },
    [setSelectedAsset]
  );
  const name = selectedAsset?.meta?.name || selectedAsset?.name;
  const isStx = selectedAsset?.name === 'Stacks Token';
  const ticker = selectedAsset
    ? isStx
      ? 'STX'
      : selectedAsset?.meta?.symbol || getTicker(selectedAsset.name)
    : null;

  const balance = useMemo<string | undefined>(() => {
    if (!selectedAsset) return;
    if (selectedAsset.type === 'stx')
      return stacksValue({ value: availableStxBalance || 0, withTicker: false });
    if (selectedAsset?.meta?.decimals)
      return ftDecimals(selectedAsset.balance, selectedAsset.meta?.decimals);
    return new BigNumber(selectedAsset.balance).toFormat();
  }, [selectedAsset, availableStxBalance]);
  const hasDecimals = isStx || (selectedAsset?.meta?.decimals && selectedAsset?.meta?.decimals > 0);
  const placeholder = selectedAsset
    ? `0${
        hasDecimals ? `.${'0'.repeat(isStx ? 6 : selectedAsset.meta?.decimals || 0)}` : ''
      } ${ticker}`
    : '';

  return {
    selectedAsset,
    handleUpdateSelectedAsset,
    ticker,
    balance,
    name,
    placeholder,
  };
}
