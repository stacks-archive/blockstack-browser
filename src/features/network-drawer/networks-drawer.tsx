import React, { memo, useCallback } from 'react';

import { Box, Flex, Button, Stack, color, FlexProps, BoxProps } from '@stacks/ui';
import { ControlledDrawer } from '@components/drawer/controlled';
import { useWallet } from '@common/hooks/use-wallet';
import { CheckmarkIcon } from '@components/icons/checkmark-icon';
import { useDoChangeScreen } from '@common/hooks/use-do-change-screen';
import { ScreenPaths } from '@common/types';
import { currentNetworkKeyState, networkOnlineStatusState } from '@store/networks';
import { showNetworksStore } from '@store/ui';
import { useDrawers } from '@common/hooks/use-drawers';
import { Caption, Title } from '@components/typography';
import { getUrlHostname } from '@common/utils';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';
import { FiCloudOff as IconCloudOff } from 'react-icons/fi';
import { SettingsSelectors } from '@tests/integration/settings.selectors';

const NetworkListItem: React.FC<{ item: string } & BoxProps> = memo(({ item, ...props }) => {
  const { setShowNetworks } = useDrawers();
  const { networks, currentNetworkKey } = useWallet();
  const setCurrentNetworkKey = useUpdateAtom(currentNetworkKeyState);
  const network = networks[item];
  const isOnline = useAtomValue(networkOnlineStatusState(network.url));
  const isActive = item === currentNetworkKey;

  const handleItemClick = useCallback(() => {
    setCurrentNetworkKey(item);
    setTimeout(() => {
      setShowNetworks(false);
    }, 25);
  }, [setCurrentNetworkKey, item, setShowNetworks]);

  return (
    <Box
      width="100%"
      key={item}
      _hover={
        !isOnline || isActive
          ? undefined
          : {
              backgroundColor: color('bg-4'),
            }
      }
      px="loose"
      py="base"
      onClick={!isOnline || isActive ? undefined : handleItemClick}
      cursor={!isOnline ? 'not-allowed' : isActive ? 'default' : 'pointer'}
      opacity={!isOnline ? 0.5 : 1}
      {...props}
    >
      <Flex width="100%" justifyContent="space-between" alignItems="center">
        <Stack>
          <Title fontWeight={400} lineHeight="1rem" fontSize={2} display="block">
            {network.name}
          </Title>
          <Caption>{getUrlHostname(network.url)}</Caption>
        </Stack>
        {!isOnline ? <IconCloudOff /> : item === currentNetworkKey ? <CheckmarkIcon /> : null}
      </Flex>
    </Box>
  );
});

const NetworkList: React.FC<FlexProps> = memo(props => {
  const { networks } = useWallet();

  const items = Object.keys(networks);
  return (
    <Flex flexWrap="wrap" flexDirection="column" {...props}>
      {items.map(item => (
        <React.Suspense fallback={<>Loading</>}>
          <NetworkListItem data-testid={SettingsSelectors.NetworkListItem} item={item} key={item} />
        </React.Suspense>
      ))}
    </Flex>
  );
});

export const NetworksDrawer: React.FC = memo(() => {
  const { setShowNetworks } = useDrawers();
  const doChangeScreen = useDoChangeScreen();

  const handleAddNetworkClick = useCallback(() => {
    setShowNetworks(false);
    doChangeScreen(ScreenPaths.ADD_NETWORK);
  }, [setShowNetworks, doChangeScreen]);
  return (
    <ControlledDrawer title="Select Network" state={showNetworksStore}>
      <NetworkList />
      <Box pb="loose" width="100%" px="loose" mt="base">
        <Button onClick={handleAddNetworkClick}>Add a network</Button>
      </Box>
    </ControlledDrawer>
  );
});
