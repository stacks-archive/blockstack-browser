import React from 'react';
import { StackProps } from '@stacks/ui';
import { ftDecimals, stacksValue } from '@common/stacks-utils';
import type { AssetWithMeta } from '@common/asset-types';
import { getAssetName } from '@stacks/ui-utils';
import { AssetItem } from '@components/asset-item';
import { getTicker } from '@common/utils';
import { useCurrentAccountAvailableStxBalance } from '@common/hooks/use-available-stx-balance';
import { BigNumber } from 'bignumber.js';

interface AssetRowProps extends StackProps {
  asset: AssetWithMeta;
}
export const AssetRow = React.forwardRef<HTMLDivElement, AssetRowProps>((props, ref) => {
  const { asset, ...rest } = props;
  const { name, contractAddress, contractName, type, meta, subtitle, balance, subBalance } = asset;
  const availableStxBalance = useCurrentAccountAvailableStxBalance();

  const friendlyName =
    type === 'ft' ? meta?.name || (name.includes('::') ? getAssetName(name) : name) : name;
  const symbol = type === 'ft' ? meta?.symbol || getTicker(friendlyName) : subtitle;

  const valueFromBalance = (balance: BigNumber) =>
    type === 'ft'
      ? ftDecimals(balance, meta?.decimals || 0)
      : type === 'stx'
      ? stacksValue({ value: balance || 0, withTicker: false })
      : balance.toString();

  const correctBalance = availableStxBalance && type === 'stx' ? availableStxBalance : balance;
  const amount = valueFromBalance(correctBalance);
  const subAmount = subBalance && valueFromBalance(subBalance);

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
      amount={amount}
      subAmount={subAmount}
      {...rest}
    />
  );
});
