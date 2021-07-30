import React, { memo } from 'react';
import type { StackProps } from '@stacks/ui';

import { getAssetStringParts } from '@stacks/ui-utils';
import { AssetItem } from '@components/asset-item';
import { Stack } from '@stacks/ui';
import { useNonFungibleTokenState } from '@common/hooks/use-assets';

export const CollectibleAssets = memo((props: StackProps) => {
  const nonFungibleTokens = useNonFungibleTokenState();

  return (
    <Stack {...props}>
      {nonFungibleTokens.map(nft => {
        const { assetName, contractName } = getAssetStringParts(nft.key);
        return (
          <AssetItem
            amount={nft.count}
            subAmount={nft.subCount}
            avatar={nft.key}
            title={assetName}
            caption={contractName}
            key={nft.key}
          />
        );
      })}
    </Stack>
  );
});
