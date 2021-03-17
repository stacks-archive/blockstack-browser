import { useFetchBalances } from '@common/hooks/use-account-info';
import { AssetAvatar } from '@components/stx-avatar';
import { Box, ChevronIcon, Text, color, Stack, StackProps } from '@stacks/ui';
import { stacksValue } from '@common/stacks-utils';
import { selectedAssetStore, searchInputStore } from '@store/recoil/asset-search';
import BigNumber from 'bignumber.js';
import React, { useMemo } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Caption } from '@components/typography';
import { getTicker } from '@common/utils';

export const SelectedAsset: React.FC<{ hideArrow?: boolean } & StackProps> = ({
  hideArrow,
  ...rest
}) => {
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
  const { name, contractAddress } = selectedAsset;

  const isStx = name === 'Stacks Token';
  const ticker = isStx ? 'STX' : getTicker(name).toUpperCase();
  return (
    <Stack spacing="tight" flexDirection="column" {...rest}>
      <Text display="block" fontSize={1} fontWeight="500" mb="tight">
        Token
      </Text>
      <Box
        width="100%"
        px="base"
        py="base-tight"
        borderRadius="8px"
        border="1px solid"
        borderColor={color('border')}
        userSelect="none"
        onClick={() => {
          if (!hideArrow) {
            setSearchInput('');
            setSelectedAsset(undefined);
          }
        }}
      >
        <Stack spacing="base" alignItems="center" isInline>
          <AssetAvatar
            useStx={isStx}
            gradientString={contractAddress}
            mr="tight"
            size="36px"
            color="white"
          >
            {name[0]}
          </AssetAvatar>

          <Stack flexGrow={1}>
            <Text display="block" fontWeight="400" fontSize={2} color="ink.1000">
              {name}
            </Text>
            <Caption>{ticker}</Caption>
          </Stack>

          {!hideArrow ? (
            <Box ml="base" textAlign="right" height="24px">
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
          ) : null}
        </Stack>
      </Box>
      {balance && (
        <Caption variant="c2">
          Balance: {balance} {!isStx && ticker}
        </Caption>
      )}
    </Stack>
  );
};
