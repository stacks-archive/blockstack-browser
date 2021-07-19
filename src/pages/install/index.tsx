import React, { useState, useCallback, memo } from 'react';
import { Button, Stack, StackProps } from '@stacks/ui';
import { useWallet } from '@common/hooks/use-wallet';
import { useDoChangeScreen } from '@common/hooks/use-do-change-screen';
import { ScreenPaths } from '@common/types';
import { Link } from '@components/link';
import { PopupContainer } from '@components/popup/container';
import { useOnboardingState } from '@common/hooks/auth/use-onboarding-state';
import { Title, Body } from '@components/typography';
import { Header } from '@components/header';
import { InitialPageSelectors } from '@tests/integration/initial-page.selectors';

const Actions: React.FC<StackProps> = props => {
  const { doMakeWallet } = useWallet();
  const { decodedAuthRequest } = useOnboardingState();
  const doChangeScreen = useDoChangeScreen();

  const [isCreatingWallet, setIsCreatingWallet] = useState(false);
  const register = useCallback(async () => {
    setIsCreatingWallet(true);
    await doMakeWallet();
    if (decodedAuthRequest) {
      doChangeScreen(ScreenPaths.SET_PASSWORD);
    }
  }, [doMakeWallet, doChangeScreen, decodedAuthRequest]);

  return (
    <Stack justifyContent="center" spacing="loose" textAlign="center" {...props}>
      <Button
        onClick={register}
        isLoading={isCreatingWallet}
        data-testid={InitialPageSelectors.SignUp}
        borderRadius="10px"
      >
        I'm new to Stacks
      </Button>
      <Link
        onClick={() => doChangeScreen(ScreenPaths.SIGN_IN_INSTALLED)}
        data-testid={InitialPageSelectors.SignIn}
      >
        Sign in with Secret Key
      </Link>
    </Stack>
  );
};

export const Installed: React.FC = memo(() => (
  <PopupContainer header={<Header hideActions />} requestType="auth">
    <Stack spacing="extra-loose" flexGrow={1} justifyContent="center">
      <Stack width="100%" spacing="loose" textAlign="center" alignItems="center">
        <Title as="h1" fontWeight={500}>
          Hiro Wallet is installed
        </Title>
        <Body maxWidth="28ch">Are you new to Stacks or do you already have a Secret Key?</Body>
      </Stack>
      <Actions />
    </Stack>
  </PopupContainer>
));
