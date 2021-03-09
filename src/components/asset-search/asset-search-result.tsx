import React from 'react';
import { AssetRow } from '@components/asset-row';
import { BoxProps } from '@stacks/ui';
import { Asset } from '@store/recoil/asset-search';

interface AssetResultProps extends BoxProps {
  asset: Asset;
  highlighted: boolean;
  index: number;
}

export const AssetResult = React.forwardRef<HTMLDivElement, AssetResultProps>((props, ref) => {
  const { asset, highlighted, ...otherProps } = props;

  return (
    <AssetRow
      ref={ref}
      key={`${asset.contractAddress}.${asset.type}`}
      name={asset.name}
      subtitle={asset.subtitle}
      friendlyName={asset.name}
      value={asset.balance}
      backgroundColor={highlighted ? 'ink.150' : 'white'}
      {...otherProps}
      p="base-tight"
      mb="0"
    />
  );
});
