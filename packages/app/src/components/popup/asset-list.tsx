import React, { useState } from 'react';
import { Box, Flex, Text, BoxProps } from '@stacks/ui';
import { TokenAssets } from '@components/popup/token-assets';
import { CollectibleAssets } from '@components/popup/collectible-assets';
import type { AddressBalanceResponse } from '@blockstack/stacks-blockchain-api-types';

type Tab = 'tokens' | 'collectibles';

const getTabStyles = (isActive: boolean): BoxProps => {
  if (isActive) {
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

interface TabHeaderProps extends BoxProps {
  tab: Tab;
  setTab: (tab: Tab) => void;
}
const TabHeader: React.FC<TabHeaderProps> = ({ tab, setTab, ...rest }) => {
  const tabName = new String(tab);
  return (
    <Box
      width="50%"
      textAlign="center"
      p="base-tight"
      cursor="pointer"
      fontSize="14px"
      onClick={() => setTab(tab)}
      {...rest}
    >
      <Text fontSize={2}>{tabName.charAt(0).toUpperCase() + tabName.slice(1)}</Text>
    </Box>
  );
};

interface AssetListProps {
  balances: AddressBalanceResponse;
}
export const AssetList: React.FC<AssetListProps> = ({ balances }) => {
  const [currentTab, setCurrentTab] = useState<Tab>('tokens');

  return (
    <Flex mt="base" flexWrap="wrap" flexDirection="column">
      <Flex width="100%">
        <TabHeader {...getTabStyles('tokens' === currentTab)} setTab={setCurrentTab} tab="tokens" />
        <TabHeader
          {...getTabStyles('collectibles' === currentTab)}
          setTab={setCurrentTab}
          tab="collectibles"
        />
      </Flex>
      <TokenAssets display={currentTab === 'tokens' ? 'block' : 'none'} balances={balances} />
      <CollectibleAssets
        display={currentTab === 'collectibles' ? 'block' : 'none'}
        balances={balances}
      />
    </Flex>
  );
};
