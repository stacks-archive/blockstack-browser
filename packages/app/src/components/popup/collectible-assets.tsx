import React from 'react';
import { Text, Box, BoxProps, Flex } from '@stacks/ui';
import { AddressBalanceResponse } from '@blockstack/stacks-blockchain-api-types';
import { AssetRow } from '../asset-row';
import { getAssetStringParts } from '@stacks/ui-utils';
import { getTicker } from '@common/stacks-utils';

const NoCollectibles: React.FC<BoxProps> = props => (
  <Box width="100%" py="extra-loose" my="extra-loose" textAlign="center" {...props}>
    <Text fontSize={2} display="block" mb="extra-tight" color="ink.600" fontWeight="500">
      You don't own any collectibles.
    </Text>
  </Box>
);

interface CollectibleAssetProps extends BoxProps {
  balances: AddressBalanceResponse;
}
export const CollectibleAssets: React.FC<CollectibleAssetProps> = ({ balances, ...props }) => {
  const noCollectibles = Object.keys(balances.non_fungible_tokens).length === 0;
  if (noCollectibles) {
    return <NoCollectibles {...props} />;
  }

  const collectibles = Object.keys(balances.non_fungible_tokens).map(key => {
    const collectible = balances.non_fungible_tokens[key];
    const { assetName } = getAssetStringParts(key);
    return (
      <AssetRow
        name={key}
        friendlyName={assetName}
        key={key}
        value={collectible.count}
        subtitle={getTicker(assetName)}
      />
    );
  });
  return (
    <Box width="100%" py="base" {...props}>
      <Flex flexWrap="wrap" flexDirection="column">
        {collectibles}
      </Flex>
    </Box>
  );
};
