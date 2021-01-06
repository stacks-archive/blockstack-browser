import React, { useState, useCallback } from 'react';
import { Screen, ScreenBody, ScreenActions, Title, ScreenHeader } from '@screen';
import { Button, Text, Input, Box } from '@stacks/ui';
import { buildEnterKeyEvent } from '@components/link';
import { useWallet } from '@common/hooks/use-wallet';

interface OnboardingPasswordProps {
  next: () => void;
}

export const OnboardingPassword: React.FC<OnboardingPasswordProps> = ({ next }) => {
  const title = 'Set a password';
  const { doSetPassword } = useWallet();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = useCallback(async () => {
    setLoading(true);
    await doSetPassword(password);
    setLoading(false);
    next();
  }, [doSetPassword, password, next]);

  return (
    <Screen pb={0} isLoading={loading}>
      <ScreenHeader />
      <ScreenBody
        mt={6}
        body={[
          <Title>{title}</Title>,
          <Box my="loose">
            <Text fontSize={2}>
              <Text color="green" fontWeight="500">
                This password is for this device only.
              </Text>{' '}
              To access your account on a new device you’ll use just your Secret Key.
            </Text>
          </Box>,
          <Box my="base" width="100%">
            <Input
              placeholder="Set a password"
              width="100%"
              autoFocus
              type="password"
              value={password}
              onChange={(e: React.FormEvent<HTMLInputElement>) =>
                setPassword(e.currentTarget.value)
              }
              onKeyUp={buildEnterKeyEvent(submit)}
              data-test="onboarding-password"
            />
          </Box>,
        ]}
      />
      <ScreenActions flexDirection="column">
        <Button width="100%" size="lg" mt={6} onClick={submit} data-test="button-has-set-password">
          Continue
        </Button>
      </ScreenActions>
    </Screen>
  );
};
