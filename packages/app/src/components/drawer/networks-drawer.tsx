import React, { memo, useCallback } from 'react';
import { useSetRecoilState } from 'recoil';
import { Box, Flex, Button, Stack, color, FlexProps, BoxProps } from '@stacks/ui';
import { ControlledDrawer } from './controlled';
import { useWallet } from '@common/hooks/use-wallet';
import { CheckmarkIcon } from '@components/icons/checkmark-icon';
import { useAnalytics } from '@common/hooks/use-analytics';
import { ScreenPaths } from '@store/onboarding/types';
import { currentNetworkKeyStore } from '@store/recoil/networks';
import { showNetworksStore } from '@store/recoil/drawers';
import { useDrawers } from '@common/hooks/use-drawers';
import { Caption, Title } from '@components/typography';

const NetworkListItem: React.FC<{ item: string } & BoxProps> = memo(({ item, ...props }) => {
  const { setShowNetworks } = useDrawers();
  const { networks, currentNetworkKey } = useWallet();
  const setCurrentNetworkKey = useSetRecoilState(currentNetworkKeyStore);

  const network = networks[item];

  const handleItemClick = useCallback(() => {
    setCurrentNetworkKey(item);
    setTimeout(() => {
      setShowNetworks(false);
    }, 350); // timeout to show the check mark move :)
  }, [setCurrentNetworkKey, item, setShowNetworks]);

  return (
    <Box
      width="100%"
      key={item}
      _hover={{
        backgroundColor: color('bg-4'),
      }}
      cursor="pointer"
      px="loose"
      py="base"
      onClick={handleItemClick}
      {...props}
    >
      <Flex width="100%" justifyContent="space-between" alignItems="center">
        <Stack>
          <Title fontWeight={400} lineHeight="1rem" fontSize={2} display="block">
            {network.name}
          </Title>
          <Caption>{network.url.split('//')[1]}</Caption>
        </Stack>
        {item === currentNetworkKey ? <CheckmarkIcon /> : null}
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
        <NetworkListItem item={item} key={item} />
      ))}
    </Flex>
  );
});

export const NetworksDrawer: React.FC = memo(() => {
  const { setShowNetworks } = useDrawers();
  const { doChangeScreen } = useAnalytics();

  const handleAddNetworkClick = useCallback(() => {
    setShowNetworks(false);
    doChangeScreen(ScreenPaths.ADD_NETWORK);
  }, [setShowNetworks, doChangeScreen]);

  return (
    <ControlledDrawer title="Select Network" state={showNetworksStore}>
      <NetworkList />
      <Box width="100%" px="loose" mt="base">
        <Button onClick={handleAddNetworkClick}>Add a network</Button>
      </Box>
    </ControlledDrawer>
  );
});
