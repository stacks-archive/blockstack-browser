import React from 'react';
import { Box, Flex, Text, Button } from '@stacks/ui';
import { ControlledDrawer } from './controlled';
import { useWallet } from '@common/hooks/use-wallet';
import { CheckmarkIcon } from '@components/icons/checkmark-icon';
import { useAnalytics } from '@common/hooks/use-analytics';
import { ScreenPaths } from '@store/onboarding/types';
import { useSetRecoilState } from 'recoil';
import { currentNetworkKeyStore } from '@store/recoil/networks';
import { showNetworksStore } from '@store/recoil/drawers';
import { useDrawers } from '@common/hooks/use-drawers';

export const NetworksDrawer: React.FC = () => {
  const { setShowNetworks } = useDrawers();

  const { networks, currentNetworkKey } = useWallet();
  const setCurrentNetworkKey = useSetRecoilState(currentNetworkKeyStore);
  const { doChangeScreen } = useAnalytics();
  const networkRows = Object.keys(networks).map(networkKey => {
    const network = networks[networkKey];
    return (
      <Box
        width="100%"
        key={networkKey}
        _hover={{
          backgroundColor: 'ink.150',
        }}
        cursor="pointer"
        px={6}
        py="base"
        onClick={() => {
          setCurrentNetworkKey(networkKey);
          setShowNetworks(false);
        }}
      >
        <Flex width="100%">
          <Box flexGrow={1}>
            <Text fontSize={2} display="block">
              {network.name}
            </Text>
            <Text fontSize={1} color="gray">
              {network.url}
            </Text>
          </Box>
          <Box pt="base-loose">{networkKey === currentNetworkKey ? <CheckmarkIcon /> : null}</Box>
        </Flex>
      </Box>
    );
  });
  return (
    <ControlledDrawer state={showNetworksStore}>
      <Box width="100%" px={6} mt="base">
        <Text fontSize={4} fontWeight="600">
          Select Network
        </Text>
      </Box>
      <Flex flexWrap="wrap" flexDirection="column">
        {networkRows}
      </Flex>
      <Box width="100%" px={6} mt="base">
        <Button
          onClick={() => {
            setShowNetworks(false);
            doChangeScreen(ScreenPaths.ADD_NETWORK);
          }}
        >
          Add a network
        </Button>
      </Box>
    </ControlledDrawer>
  );
};
