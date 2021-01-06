import React from 'react';
import { Box, Flex, Text } from '@stacks/ui';
import { InstalledIllustration } from '@components/icons/installed-illustation';
import { PopupContainer } from '@components/popup/container';

export const InstallFinished: React.FC = () => {
  return (
    <PopupContainer>
      <Flex flexDirection="column" mt="extra-loose" width="80%" mx="auto">
        <InstalledIllustration />
      </Flex>
      <Box mt="base" width="100%" textAlign="center" data-test="install-finished">
        <Text fontSize="32px" lineHeight="48px" fontWeight="500">
          You&apos;re all set!
        </Text>
      </Box>
      <Box textAlign="center" mt="base">
        <Text fontSize="base" color="ink.600">
          Access your account and digital assets at any time by clicking the Connect icon in your
          browser.
        </Text>
      </Box>
    </PopupContainer>
  );
};
