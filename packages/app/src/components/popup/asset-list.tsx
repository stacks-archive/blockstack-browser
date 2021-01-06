import React, { useState } from 'react';
import { Box, Flex, Text, BoxProps } from '@stacks/ui';
import { TokenAssets } from '@components/popup/token-assets';
import { CollectibleAssets } from '@components/popup/collectible-assets';
import type { AddressBalanceResponse } from '@blockstack/stacks-blockchain-api-types';

type Tab = 'tokens' | 'collectibles';

interface AssetListProps {
  balances: AddressBalanceResponse;
}
export const AssetList: React.FC<AssetListProps> = ({ balances }) => {
  const [currentTab, setCurrentTab] = useState<Tab>('tokens');

  const getTabStyles = (tab: Tab): BoxProps => {
    if (tab === currentTab) {
      return {
        borderColor: 'blue',
        borderWidth: '0 0 2px 0',
        color: 'blue',
        fontWeight: '500',
      };
    }
    return {
      color: 'ink.600',
    };
  };

  const TabHeader: React.FC<{ tab: Tab }> = ({ tab }) => {
    const tabName = new String(tab);
    return (
      <Box
        width="50%"
        textAlign="center"
        p="base-tight"
        cursor="pointer"
        fontSize="14px"
        {...getTabStyles(tab)}
        onClick={() => setCurrentTab(tab)}
      >
        <Text fontSize={2}>{tabName.charAt(0).toUpperCase() + tabName.slice(1)}</Text>
      </Box>
    );
  };

  return (
    <Flex mt="base" flexWrap="wrap" flexDirection="column">
      <Flex width="100%">
        <TabHeader tab="tokens" />
        <TabHeader tab="collectibles" />
      </Flex>
      <TokenAssets display={currentTab === 'tokens' ? 'block' : 'none'} balances={balances} />
      <CollectibleAssets
        display={currentTab === 'collectibles' ? 'block' : 'none'}
        balances={balances}
      />
    </Flex>
  );
};
