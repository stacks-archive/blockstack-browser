import React from 'react';
import { StackProps } from '@stacks/ui';
import { ftDecimals, stacksValue } from '@common/stacks-utils';
import type { AssetWithMeta } from '@common/asset-types';
import { getAssetName } from '@stacks/ui-utils';
import { AssetItem } from '@components/asset-item';
import { getTicker } from '@common/utils';
import { useCurrentAccountAvailableStxBalance } from '@common/hooks/use-available-stx-balance';

interface AssetRowProps extends StackProps {
  asset: AssetWithMeta;
}
export const AssetRow = React.forwardRef<HTMLDivElement, AssetRowProps>((props, ref) => {
  const { asset, ...rest } = props;
  const { name, contractAddress, contractName, type, meta, subtitle, balance } = asset;
  const availableStxBalance = useCurrentAccountAvailableStxBalance();

  const friendlyName =
    type === 'ft' ? meta?.name || (name.includes('::') ? getAssetName(name) : name) : name;
  const symbol = type === 'ft' ? meta?.symbol || getTicker(friendlyName) : subtitle;
  const value =
    type === 'ft'
      ? ftDecimals(balance, meta?.decimals || 0)
      : type === 'stx'
      ? stacksValue({ value: availableStxBalance?.toString() || 0, withTicker: false })
      : balance.toString();

  return (
    <AssetItem
      ref={ref}
      avatar={
        name === 'stx'
          ? 'stx'
          : type === 'ft'
          ? `${contractAddress}.${contractName}::${name}`
          : name
      }
      title={friendlyName}
      caption={symbol}
      amount={value}
      {...rest}
    />
  );
});
