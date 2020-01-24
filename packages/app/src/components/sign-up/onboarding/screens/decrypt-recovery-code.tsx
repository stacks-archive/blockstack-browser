import React, { useState } from 'react';
import { Box, Input, Text } from '@blockstack/ui';
import { decrypt } from '@blockstack/keychain';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '../../../../store';
import { selectMagicRecoveryCode } from '../../../../store/onboarding/selectors';
import { doTrack, SIGN_IN_CORRECT } from '../../../../common/track';
import { doStoreSeed } from '../../../../store/wallet/actions';
import { DEFAULT_PASSWORD } from '../../../../store/onboarding/types';
import { ScreenHeader } from '../../header';
import { Screen, ScreenBody, ScreenActions } from '../../screen';

interface RecoveryProps {
  next: () => void;
}

export const DecryptRecoveryCode: React.FC<RecoveryProps> = ({ next }) => {
  const [passwordError, setPasswordError] = useState('');
  const [password, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const recoveryCode = useSelector((state: AppState) => selectMagicRecoveryCode(state) as string);
  return (
    <Screen isLoading={loading}>
      <ScreenHeader appIcon />
      <ScreenBody
        title="Enter your password"
        body={[
          'You entered a Magic Recovery Code. Enter the password you set when you first created your Blockstack ID.',
          <Box textAlign="left">
            {/*Validate: track SIGN_IN_INCORRECT*/}
            <Input
              autoFocus
              // minHeight="80px"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(evt: React.FormEvent<HTMLInputElement>) => {
                setPasswordError('');
                setCode(evt.currentTarget.value);
              }}
            />
            {passwordError && (
              <Text textAlign="left" textStyle="caption" color="feedback.error">
                {passwordError}
              </Text>
            )}
          </Box>,
        ]}
      />
      <ScreenActions
        action={{
          label: 'Continue',
          onClick: async () => {
            setLoading(true);
            try {
              const codeBuffer = Buffer.from(recoveryCode, 'base64');
              const seed = await decrypt(codeBuffer, password);
              await doStoreSeed(seed, DEFAULT_PASSWORD)(dispatch, () => ({}), {});
              doTrack(SIGN_IN_CORRECT);
              next();
            } catch (error) {
              setPasswordError('Invalid password.');
            }
            setLoading(false);
          },
        }}
      />
    </Screen>
  );
};
