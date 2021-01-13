import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '@store';
import { selectMagicRecoveryCode } from '@store/onboarding/selectors';
import { SIGN_IN_CORRECT } from '@common/track';
import { useWallet } from '@common/hooks/use-wallet';

import { Box, Input, Text, Button } from '@stacks/ui';
import {
  Screen,
  ScreenBody,
  ScreenActions,
  Title,
  PoweredBy,
  ScreenFooter,
  ScreenHeader,
} from '@screen';
import { decrypt } from '@stacks/wallet-sdk';
import { ErrorLabel } from '@components/error-label';
import { useAnalytics } from '@common/hooks/use-analytics';
import { ScreenPaths } from '@store/onboarding/types';
import { useOnboardingState } from '@common/hooks/use-onboarding-state';
import { USERNAMES_ENABLED } from '@common/constants';

export const DecryptRecoveryCode: React.FC = () => {
  const title = 'Enter your password';
  const [passwordError, setPasswordError] = useState('');
  const { doStoreSeed, doFinishSignIn } = useWallet();
  const [password, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { doTrack, doChangeScreen } = useAnalytics();
  const { decodedAuthRequest } = useOnboardingState();

  const recoveryCode = useSelector((state: AppState) => selectMagicRecoveryCode(state) as string);

  const onSubmit = async () => {
    setLoading(true);
    try {
      const codeBuffer = Buffer.from(recoveryCode, 'base64');
      const seed = await decrypt(codeBuffer, password);
      await doStoreSeed(seed, password);
      doTrack(SIGN_IN_CORRECT);
      if (decodedAuthRequest) {
        if (!USERNAMES_ENABLED) {
          setTimeout(() => {
            void doFinishSignIn(0);
          }, 1000);
        } else {
          doChangeScreen(ScreenPaths.USERNAME);
        }
      } else {
        doChangeScreen(ScreenPaths.HOME);
      }
    } catch (error) {
      console.error(error);
      setPasswordError('Incorrect password');
      setLoading(false);
    }
  };
  return (
    <Screen onSubmit={onSubmit} isLoading={loading}>
      <ScreenHeader />
      <ScreenBody
        mt={6}
        body={[
          <Title>{title}</Title>,
          <Box mt={2}>
            You entered a Magic Recovery Code. Enter the password you set when you first created
            your Blockstack ID.
            <Box textAlign="left">
              {/*Validate: track SIGN_IN_INCORRECT*/}
              <Input
                mt={5}
                autoFocus
                placeholder="Password"
                type="password"
                value={password}
                onChange={(evt: React.FormEvent<HTMLInputElement>) => {
                  setPasswordError('');
                  setCode(evt.currentTarget.value);
                }}
              />
              {passwordError && (
                <ErrorLabel>
                  <Text textAlign="left" display="block" textStyle="caption" color="feedback.error">
                    {passwordError}
                  </Text>
                </ErrorLabel>
              )}
            </Box>
          </Box>,
        ]}
      />
      <ScreenActions>
        <Button
          width="100%"
          mt={6}
          size="lg"
          onClick={async (event: MouseEvent) => {
            event.preventDefault();
            return onSubmit();
          }}
          type="submit"
          data-test="decrypt-recovery-button"
        >
          Continue
        </Button>
      </ScreenActions>
      <ScreenFooter>
        <PoweredBy />
      </ScreenFooter>
    </Screen>
  );
};
