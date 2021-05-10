import React, { forwardRef } from 'react';
import { AssetRow } from '@components/asset-row';
import type { StackProps } from '@stacks/ui';
import { Asset } from '@store/asset-search';

interface AssetResultProps extends StackProps {
  asset: Asset;
  highlighted: boolean;
  index: number;
}

export const AssetResult = forwardRef<HTMLDivElement, AssetResultProps>((props, ref) => {
  const { asset, highlighted, ...rest } = props;

  return (
    <AssetRow
      ref={ref}
      key={`${asset.contractAddress}.${asset.type}`}
      name={asset.name}
      contractAddress={asset.contractAddress || asset.name}
      subtitle={asset.subtitle}
      friendlyName={asset.name}
      value={asset.balance}
      backgroundColor={highlighted ? 'ink.150' : 'white'}
      p="base-tight"
      {...rest}
    />
  );
});
