import React, { memo } from 'react';
import { Box, Button } from '@stacks/ui';

import { PopupContainer } from '@components/popup/container';
import { Text } from '@components/typography';

import { ScreenPaths } from '@store/common/types';
import { useDoChangeScreen } from '@common/hooks/use-do-change-screen';
import { Header } from '@components/header';

export const SignedOut = memo(() => {
  const doChangeScreen = useDoChangeScreen();
  return (
    <PopupContainer header={<Header hideActions />}>
      <Box width="100%" mt="extra-loose" textAlign="center">
        <Text textStyle="display.large" display="block">
          You're logged out!
        </Text>
        <Button
          my="extra-loose"
          onClick={() => {
            doChangeScreen(ScreenPaths.INSTALLED);
          }}
        >
          Get started
        </Button>
      </Box>
    </PopupContainer>
  );
});
