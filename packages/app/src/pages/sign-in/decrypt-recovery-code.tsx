import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '@store';
import { selectMagicRecoveryCode } from '@store/onboarding/selectors';
import { SIGN_IN_CORRECT } from '@common/track';
import { doStoreSeed } from '@store/wallet/actions';
import { DEFAULT_PASSWORD } from '@store/onboarding/types';

import { Box, Input, Text, Button } from '@blockstack/ui';
import {
  Screen,
  ScreenBody,
  ScreenActions,
  Title,
  PoweredBy,
  ScreenFooter,
} from '@blockstack/connect';
import { ScreenHeader } from '@components/connected-screen-header';
import { decrypt } from '@blockstack/keychain';
import { ErrorLabel } from '@components/error-label';
import { useAnalytics } from '@common/hooks/use-analytics';

interface RecoveryProps {
  next: () => void;
}

export const DecryptRecoveryCode: React.FC<RecoveryProps> = ({ next }) => {
  const title = 'Enter your password';
  const [passwordError, setPasswordError] = useState('');
  const [password, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { doTrack } = useAnalytics();

  const recoveryCode = useSelector((state: AppState) => selectMagicRecoveryCode(state) as string);

  const onSubmit = async () => {
    setLoading(true);
    try {
      const codeBuffer = Buffer.from(recoveryCode, 'base64');
      const seed = await decrypt(codeBuffer, password);
      await doStoreSeed(seed, DEFAULT_PASSWORD)(dispatch, () => ({}), {});
      doTrack(SIGN_IN_CORRECT);
      next();
    } catch (error) {
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
          onClick={async event => {
            event.preventDefault();
            return onSubmit();
          }}
          type="submit"
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
