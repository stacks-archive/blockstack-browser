import React, { useState } from 'react';
import { Box, Text, Input } from '@blockstack/ui';
import { AppIcon } from '../../app-icon';
import { ScreenTemplate } from '../../screen';
import { doTrack, SIGN_IN_CORRECT, SIGN_IN_CREATE, SIGN_IN_INCORRECT } from '../../../../common/track';
import { doChangeScreen, doSetMagicRecoveryCode } from '../../../../store/onboarding/actions';
import { useDispatch, useSelector } from 'react-redux';
import { Screen, DEFAULT_PASSWORD } from '../../../../store/onboarding/types';
import { IAppState } from '../../../../store';
import { selectAppName } from '../../../../store/onboarding/selectors';
import { doStoreSeed } from '../../../../store/wallet';

interface SignInProps {
  next: () => void;
  back: () => void;
}
const SignIn: React.FC<SignInProps> = props => {
  const [isLoading, setLoading] = useState(false);
  const [seed, setSeed] = useState('');
  const [seedError, setSeedError] = useState<null | string>(null);
  const dispatch = useDispatch();
  const appName = useSelector((state: IAppState) => selectAppName(state));

  return (
    <ScreenTemplate
      textAlign="center"
      before={<AppIcon />}
      headerTitle="Continue with Data Vault"
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
      action={[
        {
          label: 'Create a Data Vault',
          variant: 'text',
          onClick: () => {
            doTrack(SIGN_IN_CREATE);
            dispatch(doChangeScreen(Screen.CREATE));
          },
        },
        {
          label: 'Continue',
          onClick: async () => {
            setLoading(true);
            try {
              if (seed.trim().split(' ').length <= 1) {
                dispatch(doSetMagicRecoveryCode(seed.trim()));
                dispatch(doChangeScreen(Screen.RECOVERY_CODE));
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
      isLoading={isLoading}
    />
  );
};

export { SignIn };
