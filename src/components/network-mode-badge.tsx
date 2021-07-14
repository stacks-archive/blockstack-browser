import React, { memo, useMemo } from 'react';
import { color, Flex, FlexProps, Text } from '@stacks/ui';
import { ChainID } from '@stacks/transactions';
import { useDrawers } from '@common/hooks/use-drawers';
import { useCurrentNetwork } from '@common/hooks/use-current-network';

export const NetworkModeBadge: React.FC<FlexProps> = memo(props => {
  const { chainId } = useCurrentNetwork();
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
      <Text fontSize="11px" fontWeight="500">
        Testnet mode
      </Text>
    </Flex>
  ) : null;
});
