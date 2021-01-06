import React from 'react';
import { Box, Flex, Text, ArrowIcon, BoxProps } from '@stacks/ui';
import { ConnectIcon } from '@components/icons/connect-icon';
import styled from '@emotion/styled';
import { EllipsisIcon } from '@components/icons/ellipsis-icon';
import { SettingsPopover } from './settings-popover';
import { useDrawers } from '@common/hooks/use-drawers';

const CloseIconContainer = styled(Box)`
  svg {
    height: 14px;
    opacity: 50%;
    // margin-top: 10px;
  }
`;

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
  const isExtension = EXT_ENV !== 'web';

  const Settings: React.FC<BoxProps> = props => {
    if (hideActions) return null;
    return (
      <Box cursor="pointer" position="relative" {...props}>
        <EllipsisIcon onClick={() => setShowSettings(true)} />
      </Box>
    );
  };

  return (
    <>
      <Flex
        minHeight={`max(${isExtension ? '100vh' : '500px'}, 400px)`}
        minWidth={isExtension ? '440px' : undefined}
        maxWidth="100vw"
        background="white"
        p="24px"
        flexWrap="wrap"
        flexDirection="column"
      >
        <SettingsPopover />
        <Flex width="100%" dir="row" display={['none', 'flex']}>
          <Box flexGrow={1}>
            <ConnectIcon height="16px" />
          </Box>
          <Settings />
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
                    fontSize={4}
                    fontWeight="600"
                    textStyle="display.large"
                    fontFamily="heading"
                    color="ink.1000"
                  >
                    {title}
                  </Text>
                ) : (
                  <ConnectIcon height="16px" display={['flex', 'none']} />
                )}
              </Box>
              <Settings display={['flex', 'none']} />
            </Flex>
            {children}
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};
