import React from 'react';
import {
  Box,
  Flex,
  Text,
  ArrowIcon,
  BoxProps,
  FlexProps,
  StxNexus,
  IconButton,
  color,
} from '@stacks/ui';
import styled from '@emotion/styled';
import { SettingsPopover } from './settings-popover';
import { useDrawers } from '@common/hooks/use-drawers';
import { useAnalytics } from '@common/hooks/use-analytics';
import { ScreenPaths } from '@store/onboarding/types';
import { IconMenu2, IconFlask } from '@tabler/icons';
import { useRecoilValue } from 'recoil';
import { currentNetworkStore } from '@store/recoil/networks';
import { ChainID } from '@stacks/transactions';

const CloseIconContainer = styled(Box)`
  svg {
    height: 14px;
    opacity: 50%;
    // margin-top: 10px;
  }
`;

const Header: React.FC<FlexProps> = props => {
  const { doChangeScreen } = useAnalytics();

  return (
    <Flex
      cursor="pointer"
      flexDirection="row"
      onClick={() => doChangeScreen(ScreenPaths.HOME)}
      {...props}
    >
      <Box>
        <StxNexus
          height="23px"
          position="relative"
          top="7px"
          color="black"
          display="inline-block"
        />
      </Box>
      <Box>
        <Text
          fontFamily="heading"
          color="ink.1000"
          fontWeight="600"
          ml="base-tight"
          // fontSize={[2, 4]}
          fontSize={4}
        >
          Stacks Wallet
        </Text>
      </Box>
    </Flex>
  );
};

const ModeBadge: React.FC<FlexProps> = props => {
  const { chainId } = useRecoilValue(currentNetworkStore);
  const mode = chainId === ChainID.Mainnet ? 'Mainnet' : 'Testnet';
  return (
    <Flex
      borderWidth="1px"
      borderColor="ink.300"
      borderRadius="12px"
      height="24px"
      alignItems="center"
      px="12px"
      {...props}
    >
      <Box as={IconFlask} mr="extra-tight" color={color('brand')} size="16px" />
      <Text fontSize="11px" fontWeight="500">
        {mode} mode
      </Text>
    </Flex>
  );
};

const Warning: React.FC = () => {
  return (
    <Flex
      width="100vw"
      backgroundColor="rgba(249, 161, 77, 0.2)"
      textAlign="center"
      py="base"
      borderBottomWidth="2px"
      borderBottomColor={color('feedback-alert')}
    >
      <Text display="block" width="100%" fontSize={['12px', 1]} fontWeight="500">
        Stacks Wallet for Web is in alpha and has not been audited yet
      </Text>
    </Flex>
  );
};

interface PopupHomeProps {
  title?: string;
  onClose?: () => void;
  hideActions?: boolean;
}
export const PopupContainer: React.FC<PopupHomeProps> = ({
  children,
  title,
  onClose,
  hideActions,
}) => {
  const { setShowSettings } = useDrawers();

  const Settings: React.FC<BoxProps> = props => {
    if (hideActions) return null;
    return (
      <IconButton
        size="42px"
        iconSize="24px"
        onClick={() => setShowSettings(true)}
        color="black"
        icon={IconMenu2}
        {...props}
      />
    );
  };

  return (
    <>
      <Warning />
      <Flex
        minHeight={'500px'}
        minWidth={'440px'}
        maxWidth="100vw"
        background="white"
        p="24px"
        flexWrap="wrap"
        flexDirection="column"
      >
        <SettingsPopover />
        <Flex width="100%" dir="row" display={['none', 'flex']}>
          <Header position="relative" top="-5px" />
          <Box flexGrow={1} />
          <ModeBadge mr="base" />
          <Settings position="relative" top="-9px" />
        </Flex>
        <Flex width="100%" justifyContent="center" flexGrow={1}>
          <Flex dir="column" maxWidth="512px" minWidth="min(100%, 512px)">
            <Flex width="100%" dir="row">
              <Box flexGrow={1}>
                {onClose && (
                  <Box width="100%" mb="tight">
                    <CloseIconContainer>
                      <ArrowIcon
                        height="18px"
                        cursor="pointer"
                        onClick={onClose}
                        direction={'left' as any}
                      />
                    </CloseIconContainer>
                  </Box>
                )}
                {title ? (
                  <Text
                    fontWeight="600"
                    textStyle="display.large"
                    fontSize={[2, 2, 4]}
                    fontFamily="heading"
                    color="ink.1000"
                  >
                    {title}
                  </Text>
                ) : (
                  <Header display={['flex', 'none']} position="relative" top="-1px" />
                )}
              </Box>
              <Flex display={['flex', 'none']} flexGrow={1}>
                <Box flexGrow={1} />
                <ModeBadge position="relative" top="5px" />
              </Flex>
              <Flex display={['flex', 'none']}>
                <Settings position="relative" top="-4px" />
              </Flex>
            </Flex>
            {children}
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};
