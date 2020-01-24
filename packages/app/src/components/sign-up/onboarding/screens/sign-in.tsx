import React, { useState } from 'react';
import { Box, Text, Input } from '@blockstack/ui';
import { AppIcon } from '../../app-icon';
import { doTrack, SIGN_IN_CORRECT, SIGN_IN_CREATE, SIGN_IN_INCORRECT } from '../../../../common/track';
import { doChangeScreen, doSetMagicRecoveryCode } from '../../../../store/onboarding/actions';
import { useDispatch, useSelector } from 'react-redux';
import { ScreenName, DEFAULT_PASSWORD } from '../../../../store/onboarding/types';
import { AppState } from '../../../../store';
import { selectAppName } from '../../../../store/onboarding/selectors';
import { doStoreSeed } from '../../../../store/wallet';
import { ScreenHeader } from '../../header';
import { Screen, ScreenBody, ScreenActions } from '../../screen';

interface SignInProps {
  next: () => void;
  back: () => void;
}

export const SignIn: React.FC<SignInProps> = props => {
  const [isLoading, setLoading] = useState(false);
  const [seed, setSeed] = useState('');
  const [seedError, setSeedError] = useState<null | string>(null);
  const dispatch = useDispatch();
  const appName = useSelector((state: AppState) => selectAppName(state));

  return (
    <Screen isLoading={isLoading} textAlign="center">
      <ScreenHeader appIcon title="Continue with Data Vault" />
      <AppIcon />
      <ScreenBody
        title={`Sign into ${appName}`}
        body={[
          'Enter your Data Vault’s Secret Key to continue',
          <Box textAlign="left">
            {/*Validate: track SIGN_IN_INCORRECT*/}
            <Input
              autoFocus
              minHeight="80px"
              placeholder="12-word Secret Key"
              as="textarea"
              value={seed}
              onChange={(evt: React.FormEvent<HTMLInputElement>) => {
                setSeedError(null);
                setSeed(evt.currentTarget.value);
              }}
            />
            {seedError && (
              <Text textAlign="left" textStyle="caption" color="feedback.error">
                {seedError}
              </Text>
            )}
          </Box>,
        ]}
      />
      <ScreenActions
        action={[
          {
            label: 'Create a Data Vault',
            variant: 'text',
            onClick: () => {
              doTrack(SIGN_IN_CREATE);
              dispatch(doChangeScreen(ScreenName.CREATE));
            },
          },
          {
            label: 'Continue',
            onClick: async () => {
              setLoading(true);
              try {
                if (seed.trim().split(' ').length <= 1) {
                  dispatch(doSetMagicRecoveryCode(seed.trim()));
                  dispatch(doChangeScreen(ScreenName.RECOVERY_CODE));
                  return;
                }
                await doStoreSeed(seed, DEFAULT_PASSWORD)(dispatch, () => ({}), {});
                doTrack(SIGN_IN_CORRECT);
                props.next();
              } catch (error) {
                setSeedError("The seed phrase you've entered is invalid.");
                doTrack(SIGN_IN_INCORRECT);
              }
              setLoading(false);
            },
          },
        ]}
      />
    </Screen>
  );
};
