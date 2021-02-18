import { useFetchBalances } from '@common/hooks/use-account-info';
import { LoadingRectangle } from '@components/loading-rectangle';
import { AssetAvatar } from '@components/stx-avatar';
import { Flex, Box, ChevronIcon, Text } from '@stacks/ui';
import { stacksValue } from '@common/stacks-utils';
import { selectedAssetStore, searchInputStore } from '@store/recoil/asset-search';
import BigNumber from 'bignumber.js';
import React, { useMemo } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

export const SelectedAsset: React.FC = () => {
  const balancesLoadable = useFetchBalances();
  const selectedAsset = useRecoilValue(selectedAssetStore);
  const setSelectedAsset = useSetRecoilState(selectedAssetStore);
  const setSearchInput = useSetRecoilState(searchInputStore);

  const balance = useMemo<string | undefined>(() => {
    const balances = balancesLoadable.value;
    if (!selectedAsset || !balances) return;
    if (selectedAsset.type === 'stx') {
      return stacksValue({ value: balances.stx.balance });
    } else {
      const token = Object.keys(balances.fungible_tokens).find(contract => {
        return contract.startsWith(selectedAsset.contractAddress);
      });
      if (token) {
        const balanceBN = new BigNumber(balances.fungible_tokens[token].balance);
        return balanceBN.toFormat();
      }
    }
    return;
  }, [selectedAsset, balancesLoadable]);

  if (!selectedAsset) {
    return null;
  }
  const { name } = selectedAsset;
  return (
    <Flex flexDirection="column" mt="loose">
      <Box>
        <Text display="block" fontSize={1} fontWeight="500" mb="tight">
          Token
        </Text>
      </Box>
      <Box
        width="100%"
        px="base"
        py="base-tight"
        borderRadius="8px"
        borderColor="rgb(229, 229, 236)"
        borderWidth="1px"
        onClick={() => {
          setSearchInput('');
          setSelectedAsset(undefined);
        }}
      >
        <Flex flexWrap="wrap" flexDirection="row">
          <Box width="24px" mr="base">
            <AssetAvatar
              useStx={name === 'Stacks Token'}
              gradientString={name}
              mr="tight"
              size="24px"
            >
              {name[0]}
            </AssetAvatar>
          </Box>
          <Box flexGrow={1}>
            <Text display="block" fontWeight="400" fontSize={2} color="ink.1000">
              {name}
            </Text>
          </Box>
          <Box px="base">
            {balance ? (
              <Text fontSize={2} color="ink.600">
                {balance}
              </Text>
            ) : (
              <LoadingRectangle height="16px" width="60px" />
            )}
          </Box>
          <Box textAlign="right" height="24px">
            <ChevronIcon
              size="24px"
              direction="down"
              cursor="pointer"
              opacity="70%"
              onClick={() => {
                setSearchInput('');
                setSelectedAsset(undefined);
              }}
            />
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};
