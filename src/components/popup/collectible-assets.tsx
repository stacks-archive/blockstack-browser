import React, { memo } from 'react';
import type { StackProps } from '@stacks/ui';

import { getAssetStringParts } from '@stacks/ui-utils';
import { useFetchAccountData } from '@common/hooks/account/use-account-info';
import { AssetItem } from '@components/asset-item';
import { Stack } from '@stacks/ui';

export const CollectibleAssets = memo((props: StackProps) => {
  const accountData = useFetchAccountData();
  if (!accountData.value) return null;

  const balances = accountData.value.balances;
  const noCollectibles = Object.keys(balances.non_fungible_tokens).length === 0;

  if (noCollectibles) return null;
  const keys = Object.keys(balances.non_fungible_tokens);

  return (
    <Stack {...props}>
      {keys.map(key => {
        const collectible = balances.non_fungible_tokens[key];
        const { assetName, contractName } = getAssetStringParts(key);
        return (
          <AssetItem
            amount={collectible.count}
            avatar={key}
            title={assetName}
            caption={contractName}
            key={key}
          />
        );
      })}
    </Stack>
  );
});
