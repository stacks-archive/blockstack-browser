import React, { useState, useCallback, memo } from 'react';
import { Button, Stack, StackProps } from '@stacks/ui';
import { useWallet } from '@common/hooks/use-wallet';
import { useAnalytics } from '@common/hooks/use-analytics';
import { ScreenPaths } from '@store/onboarding/types';
import { Link } from '@components/link';
import { PopupContainer } from '@components/popup/container';
import { useOnboardingState } from '@common/hooks/use-onboarding-state';
import { Title, Text } from '@components/typography';

const Actions: React.FC<StackProps> = props => {
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
    <Stack textAlign="center" {...props}>
      <Button onClick={register} isLoading={isCreatingWallet} data-test="sign-up" width="100%">
        I'm new to Stacks Wallet
      </Button>
      <Link onClick={() => doChangeScreen(ScreenPaths.SIGN_IN_INSTALLED)}>
        Continue with Secret Key
      </Link>
    </Stack>
  );
};

export const Installed: React.FC = memo(() => (
  <PopupContainer hideActions>
    <Stack spacing="extra-loose" flexGrow={1} justifyContent="center">
      <Stack width="100%" spacing="base" textAlign="center" alignItems="center" mt="extra-loose">
        <Title>Stacks Wallet is installed</Title>
        <Text maxWidth="24ch">Are you new or do you already have a Secret Key?</Text>
      </Stack>
      <Actions />
    </Stack>
  </PopupContainer>
));
