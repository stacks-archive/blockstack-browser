import React, { forwardRef } from 'react';
import { AssetRow } from '@components/asset-row';
import type { StackProps } from '@stacks/ui';
import { AssetWithMeta } from '@store/tokens';

interface AssetResultProps extends StackProps {
  asset: AssetWithMeta;
  highlighted: boolean;
  index: number;
}

export const AssetResult = forwardRef<HTMLDivElement, AssetResultProps>((props, ref) => {
  const { asset, highlighted, ...rest } = props;

  return (
    <AssetRow
      ref={ref}
      key={`${asset.contractAddress}.${asset.type}`}
      asset={asset}
      backgroundColor={highlighted ? 'ink.150' : 'white'}
      p="base-tight"
      {...rest}
    />
  );
});
