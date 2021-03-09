import React from 'react';
import { Flex, Text, Box, BoxProps } from '@stacks/ui';
import type { AddressBalanceResponse } from '@blockstack/stacks-blockchain-api-types';
import { getTicker, stacksValue } from '@common/stacks-utils';
import { useWallet } from '@common/hooks/use-wallet';
import { AssetRow } from '../asset-row';
import { STACKS_MARKETS_URL } from '@common/constants';
import { getAssetStringParts } from '@stacks/ui-utils';

const NoTokens: React.FC<BoxProps> = props => {
  const { currentNetworkKey } = useWallet();
  return (
    <Box width="100%" py="extra-loose" my="extra-loose" textAlign="center" {...props}>
      <Text color="ink.600" fontSize={2} display="block" mb="extra-tight" fontWeight="500">
        You don't own any tokens.
      </Text>
      {currentNetworkKey === 'mainnet' ? (
        <Text
          as="a"
          href={STACKS_MARKETS_URL}
          target="_blank"
          rel="noreferrer noopener"
          fontSize={2}
          color="blue"
          textDecoration="none"
          fontWeight="500"
        >
          Buy Stacks Token
        </Text>
      ) : null}
    </Box>
  );
};

interface TokenAssetProps extends BoxProps {
  balances: AddressBalanceResponse;
}
export const TokenAssets: React.FC<TokenAssetProps> = ({ balances, ...props }) => {
  const noTokens =
    balances.stx.balance === '0' && Object.keys(balances.fungible_tokens).length === 0;
  if (noTokens) {
    return <NoTokens {...props} />;
  }

  const fungibleTokens = Object.keys(balances.fungible_tokens).map(key => {
    const token = balances.fungible_tokens[key];
    const { assetName } = getAssetStringParts(key);
    return (
      <AssetRow
        name={key}
        friendlyName={assetName}
        key={key}
        value={token.balance}
        subtitle={getTicker(assetName)}
      />
    );
  });
  return (
    <Box width="100%" py="base" {...props}>
      <Flex flexWrap="wrap" flexDirection="column">
        <AssetRow
          name="STX"
          friendlyName="Stacks Token"
          value={stacksValue({ value: balances.stx.balance, withTicker: false })}
          subtitle="STX"
        />
        {fungibleTokens}
      </Flex>
    </Box>
  );
};
