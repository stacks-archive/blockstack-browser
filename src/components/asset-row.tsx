import React from 'react';
import { StackProps } from '@stacks/ui';

import { ftDecimals, stacksValue } from '@common/stacks-utils';
import { AssetWithMeta } from '@store/tokens';
import { getAssetName } from '@stacks/ui-utils';
import { AssetItem } from '@components/asset-item';
import { getTicker } from '@common/utils';

interface AssetRowProps extends StackProps {
  asset: AssetWithMeta;
}

export const AssetRow = React.forwardRef<HTMLDivElement, AssetRowProps>((props, ref) => {
  const { asset, ...rest } = props;
  const { name, contractAddress, type, meta, subtitle, balance } = asset;

  const friendlyName = type === 'ft' ? meta?.name || getAssetName(name) : name;
  const symbol = type === 'ft' ? meta?.symbol || getTicker(friendlyName) : subtitle;
  const value =
    type === 'ft'
      ? ftDecimals(balance, meta?.decimals || 0)
      : type === 'stx'
      ? stacksValue({ value: balance, withTicker: false })
      : balance;

  return (
    <AssetItem
      ref={ref}
      avatar={name === 'stx' ? 'stx' : type === 'ft' ? `${contractAddress}.${friendlyName}` : name}
      title={friendlyName}
      caption={symbol}
      amount={value}
      {...rest}
    />
  );
});
