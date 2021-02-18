import React, { useState } from 'react';
import { Text, Button, Box, useClipboard } from '@stacks/ui';
import { PopupContainer } from '@components/popup/container';
import { useWallet } from '@common/hooks/use-wallet';
import { Card } from '@components/card';
import { Toast } from '@components/toast';
import { SetPasswordPage } from '@pages/set-password';
import { useAnalytics } from '@common/hooks/use-analytics';
import { ScreenPaths } from '@store/onboarding/types';
import { Unlock } from '@components/unlock';
import { Route } from 'react-router-dom';
import { ErrorBoundary } from './error-boundary';

enum Step {
  VIEW_KEY = 1,
  SET_PASSWORD = 2,
}

export const SignedOut = () => {
  const { doChangeScreen } = useAnalytics();
  return (
    <PopupContainer hideActions={true}>
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
};

interface AccountGateProps {
  element: React.ReactNode;
}
export const AccountGate: React.FC<AccountGateProps> = ({ element }) => {
  const [step, setStep] = useState<Step>(Step.VIEW_KEY);
  const { hasSetPassword, isSignedIn, secretKey, encryptedSecretKey } = useWallet();
  const { onCopy, hasCopied } = useClipboard(secretKey || '');

  if (isSignedIn && hasSetPassword) return <>{element}</>;

  if ((isSignedIn || encryptedSecretKey) && !hasSetPassword) {
    if (step === Step.VIEW_KEY) {
      const wordCount = (secretKey || '').split(' ').length;
      return (
        <PopupContainer hideActions title="Save your Secret Key">
          <Toast show={hasCopied} />
          <Box mt={['base', 'base', 'loose']}>
            <Text fontSize={[1, 1, 2]} mb="base">
              Before adding tokens to your account, save your Secret Key.
            </Text>
            <Text fontSize={[1, 1, 2]}>
              Here’s your Secret Key: {wordCount} words that prove it’s you when you want to use
              your wallet on a new device. Once lost it’s lost forever, so save it somewhere you
              won’t forget.
            </Text>
          </Box>
          <Box my="loose">
            <Card title="Your Secret Key">
              <Text
                display="block"
                data-test="textarea-seed-phrase"
                data-loaded={String(!!secretKey)}
                fontSize={2}
              >
                {secretKey}
              </Text>
            </Card>
          </Box>
          <Box>
            <Button mb="base" width="100%" mode="secondary" onClick={onCopy}>
              Copy to clipboard
            </Button>
            <Button
              width="100%"
              onClick={() => setStep(Step.SET_PASSWORD)}
              data-test="confirm-saved-key"
            >
              I've saved it
            </Button>
          </Box>
        </PopupContainer>
      );
    } else if (step === Step.SET_PASSWORD) {
      return <SetPasswordPage />;
    }
  }

  if (!isSignedIn && encryptedSecretKey) {
    return <Unlock />;
  }

  return <SignedOut />;
};

interface AccountGateRouteProps {
  path: ScreenPaths;
  element: React.ReactNode;
}
export const AccountGateRoute: React.FC<AccountGateRouteProps> = ({ path, element }) => {
  return (
    <Route
      path={path}
      element={<AccountGate element={<ErrorBoundary>{element}</ErrorBoundary>} />}
    />
  );
};
