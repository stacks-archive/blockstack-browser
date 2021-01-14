import React, { useState, useCallback } from 'react';
import { Box, Text, Button } from '@stacks/ui';
import { useWallet } from '@common/hooks/use-wallet';
import { useAnalytics } from '@common/hooks/use-analytics';
import { ScreenPaths } from '@store/onboarding/types';
import { Link } from '@components/link';
import { PopupContainer } from '@components/popup/container';
import { useOnboardingState } from '@common/hooks/use-onboarding-state';

export const Installed: React.FC = () => {
  const { doMakeWallet } = useWallet();
  const { decodedAuthRequest } = useOnboardingState();
  const { doChangeScreen } = useAnalytics();

  const [isCreatingWallet, setIsCreatingWallet] = useState(false);

  const register = useCallback(async () => {
    setIsCreatingWallet(true);
    await doMakeWallet();
    if (decodedAuthRequest) {
      doChangeScreen(ScreenPaths.SET_PASSWORD);
    }
  }, [doMakeWallet, doChangeScreen, decodedAuthRequest]);

  return (
    <PopupContainer hideActions>
      <Box width="100%" textAlign="center">
        <Box mt="extra-loose">
          <Text fontSize="32px" lineHeight="48px" fontWeight="500">
            Stacks Wallet is installed
          </Text>
        </Box>
        <Box my="base">
          <Text fontSize="base" color="ink.600">
            Are you new or do you already have a Secret Key?
          </Text>
        </Box>
      </Box>
      <Box flexGrow={[1, 1, 0.5]} />
      <Box width="100%" textAlign="center" mb="extra-loose">
        <Box width="100%">
          <Button onClick={register} isLoading={isCreatingWallet} data-test="sign-up" width="100%">
            I'm new to Stacks Wallet
          </Button>
        </Box>
        <Box pt="base-loose">
          <Text
            fontSize="14px"
            lineHeight="20px"
            color="blue"
            position="relative"
            data-test="sign-in"
          >
            <Link onClick={() => doChangeScreen(ScreenPaths.SIGN_IN_INSTALLED)}>
              Continue with Secret Key
            </Link>
          </Text>
        </Box>
      </Box>
      <Box my="base" />
    </PopupContainer>
  );
};
