import React, { memo, useMemo } from 'react';
import { Box, color, Flex, FlexProps, Text } from '@stacks/ui';
import { useRecoilValue } from 'recoil';
import { currentNetworkState } from '@store/networks';
import { ChainID } from '@stacks/transactions';
import { IconFlask } from '@tabler/icons';
import { useDrawers } from '@common/hooks/use-drawers';

export const NetworkModeBadge: React.FC<FlexProps> = memo(props => {
  const { chainId } = useRecoilValue(currentNetworkState);
  const isTestnet = useMemo(() => chainId === ChainID.Testnet, [chainId]);
  const { setShowNetworks } = useDrawers();

  return isTestnet ? (
    <Flex
      borderWidth="1px"
      borderColor={color('border')}
      borderRadius="12px"
      height="24px"
      alignItems="center"
      px="12px"
      position="relative"
      zIndex={999}
      _hover={{
        cursor: 'pointer',
        bg: color('bg-4'),
      }}
      onClick={() => setShowNetworks(true)}
      {...props}
    >
      <Box as={IconFlask} mr="extra-tight" color={color('brand')} size="16px" />
      <Text fontSize="11px" fontWeight="500">
        Testnet mode
      </Text>
    </Flex>
  ) : null;
});
