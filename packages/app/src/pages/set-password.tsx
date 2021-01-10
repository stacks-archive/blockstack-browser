import React, { useState, useCallback } from 'react';
import { Text, Button, Box, Input } from '@stacks/ui';
import { PopupContainer } from '@components/popup/container';
import { useAnalytics } from '@common/hooks/use-analytics';
import { ScreenPaths } from '@store/onboarding/types';
import { useWallet } from '@common/hooks/use-wallet';
import { buildEnterKeyEvent } from '@components/link';
import { useOnboardingState } from '@common/hooks/use-onboarding-state';
import { USERNAMES_ENABLED } from '@common/constants';

interface SetPasswordProps {
  redirect?: boolean;
}
export const SetPasswordPage: React.FC<SetPasswordProps> = ({ redirect }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { doSetPassword, identities, doFinishSignIn } = useWallet();
  const { doChangeScreen } = useAnalytics();
  const { decodedAuthRequest } = useOnboardingState();

  const submit = useCallback(async () => {
    setLoading(true);
    await doSetPassword(password);
    setLoading(false);
    if (decodedAuthRequest) {
      console.log('should choose account?');
      if (identities && (identities.length > 1 || identities[0].defaultUsername)) {
        doChangeScreen(ScreenPaths.CHOOSE_ACCOUNT);
      } else if (!USERNAMES_ENABLED) {
        await doFinishSignIn(0);
      } else {
        doChangeScreen(ScreenPaths.USERNAME);
      }
    } else if (redirect) {
      doChangeScreen(ScreenPaths.INSTALLED);
    }
  }, [
    doSetPassword,
    doChangeScreen,
    password,
    redirect,
    decodedAuthRequest,
    identities,
    doFinishSignIn,
  ]);

  return (
    <PopupContainer hideActions title="Set a password">
      <Box my="loose">
        <Text fontSize={2}>
          <Text color="green" fontWeight="500">
            This password is for this device only.
          </Text>{' '}
          To access your account on a new device you’ll use just your Secret Key.
        </Text>
      </Box>
      <Box flexGrow={[1, 1, 0.5]} />
      <Box width="100%">
        <Input
          placeholder="Set a password"
          width="100%"
          autoFocus
          type="password"
          data-test="set-password"
          value={password}
          onChange={(e: React.FormEvent<HTMLInputElement>) => setPassword(e.currentTarget.value)}
          onKeyUp={buildEnterKeyEvent(submit)}
        />
      </Box>
      <Box mt="base">
        <Button
          width="100%"
          isLoading={loading}
          isDisabled={loading}
          onClick={submit}
          data-test="set-password-done"
        >
          Done
        </Button>
      </Box>
    </PopupContainer>
  );
};
