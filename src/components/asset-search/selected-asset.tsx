import { AssetAvatar } from '@components/stx-avatar';
import { Box, ChevronIcon, Text, color, Stack, StackProps } from '@stacks/ui';

import { searchInputStore } from '@store/asset-search';

import React from 'react';
import { useSetRecoilState } from 'recoil';
import { Caption } from '@components/typography';
import { useSelectedAsset } from '@common/hooks/use-selected-asset';

export const SelectedAsset: React.FC<{ hideArrow?: boolean } & StackProps> = ({
  hideArrow,
  ...rest
}) => {
  const { selectedAsset, balance, ticker, name, handleUpdateSelectedAsset } = useSelectedAsset();
  const setSearchInput = useSetRecoilState(searchInputStore);

  if (!selectedAsset) {
    return null;
  }
  const { contractAddress } = selectedAsset;
  const isStx = name === 'Stacks Token';

  const handleClear = () => {
    setSearchInput('');
    handleUpdateSelectedAsset(undefined);
  };

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
            handleClear();
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
            {name?.[0]}
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
                opacity={0.7}
                onClick={() => {
                  handleClear();
                }}
              />
            </Box>
          ) : null}
        </Stack>
      </Box>
      {balance && (
        <Caption variant="c2">
          Balance: {balance} {ticker}
        </Caption>
      )}
    </Stack>
  );
};
