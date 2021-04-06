import React, { memo } from 'react';
import { Box, Button } from '@stacks/ui';

import { PopupContainer } from '@components/popup/container';
import { Text } from '@components/typography';

import { ScreenPaths } from '@store/onboarding/types';
import { useDoChangeScreen } from '@common/hooks/use-do-change-screen';

export const SignedOut = memo(() => {
  const doChangeScreen = useDoChangeScreen();
  return (
    <PopupContainer hideActions>
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
