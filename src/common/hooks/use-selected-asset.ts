import { useSetRecoilState } from 'recoil';
import { useLoadable } from '@common/hooks/use-loadable';
import { selectedAssetIdState, selectedAssetStore } from '@store/asset-search';
import { AssetWithMeta } from '@store/tokens';
import { getTicker } from '@common/utils';
import { useMemo } from 'react';
import { ftDecimals, stacksValue } from '@common/stacks-utils';
import BigNumber from 'bignumber.js';

export function useSelectedAsset() {
  const { value: selectedAsset } = useLoadable(selectedAssetStore);
  const setSelectedAsset = useSetRecoilState(selectedAssetIdState);
  const handleUpdateSelectedAsset = (asset: AssetWithMeta | undefined) => {
    setSelectedAsset(asset?.name || undefined);
  };
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
      return stacksValue({ value: selectedAsset.balance, withTicker: false });
    if (selectedAsset?.meta?.decimals)
      return ftDecimals(selectedAsset.balance, selectedAsset.meta?.decimals);
    return new BigNumber(selectedAsset.balance).toFormat();
  }, [selectedAsset]);
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
