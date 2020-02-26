import React, { useState } from 'react';

import { Box, Flex, Input, Text, Button } from '@blockstack/ui';
import { Screen, ScreenBody, ScreenActions, Title, PoweredBy, ScreenFooter } from '@blockstack/connect';
import { ScreenHeader } from '@components/connected-screen-header';

import { useAppDetails } from '@common/hooks/useAppDetails';
import { useDispatch, useSelector } from 'react-redux';
import { doSetUsername, doFinishSignIn, doChangeScreen } from '@store/onboarding/actions';
import { selectCurrentWallet } from '@store/wallet/selectors';
import { AppState } from '@store';
import { DEFAULT_PASSWORD, ScreenName } from '@store/onboarding/types';
import {
  registerSubdomain,
  IdentityNameValidityError,
  validateSubdomain,
  Identity,
  Wallet,
} from '@blockstack/keychain';
import { didGenerateWallet } from '@store/wallet';
import { ErrorLabel } from '@components/error-label';
import { gaiaUrl, Subdomain } from '@common/constants';
import { selectCurrentScreen } from '@store/onboarding/selectors';
import { selectSecretKey, selectAppName } from '@store/onboarding/selectors';
import {
  doTrack,
  USERNAME_REGISTER_FAILED,
  USERNAME_SUBMITTED,
  USERNAME_VALIDATION_ERROR,
  USERNAME_SUBMIT_SUCCESS,
} from '@common/track';
import { PasswordManagerHiddenInput, usernameInputId } from '@components/pw-manager-input';

const identityNameLengthError = 'Your username should be at least 8 characters, with a maximum of 37 characters.';
const identityNameIllegalCharError = 'You can only use lowercase letters (a–z), numbers (0–9), and underscores (_).';
const identityNameUnavailableError = 'This username is not available';
const errorTextMap = {
  [IdentityNameValidityError.MINIMUM_LENGTH]: identityNameLengthError,
  [IdentityNameValidityError.MAXIMUM_LENGTH]: identityNameLengthError,
  [IdentityNameValidityError.ILLEGAL_CHARACTER]: identityNameIllegalCharError,
  [IdentityNameValidityError.UNAVAILABLE]: identityNameUnavailableError,
};

interface UsernameProps {
  next: () => void;
}

export const Username: React.FC<UsernameProps> = ({ next }) => {
  const dispatch = useDispatch();
  const { name } = useAppDetails();

  const { wallet, screen, secretKey, appName } = useSelector((state: AppState) => ({
    wallet: selectCurrentWallet(state) as Wallet,
    screen: selectCurrentScreen(state),
    secretKey: selectSecretKey(state),
    appName: selectAppName(state),
  }));

  const titleForPasswordManagers = `${appName} with Blockstack`;
  document.title = titleForPasswordManagers;
  const [error, setError] = useState<IdentityNameValidityError | null>(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const handleInput = (evt: React.FormEvent<HTMLInputElement>) => {
    setError(null);
    setUsername(evt.currentTarget.value || '');
  };

  const onSubmit = async () => {
    setHasAttemptedSubmit(true);
    setLoading(true);

    doTrack(USERNAME_SUBMITTED);

    const validationErrors = await validateSubdomain(username, Subdomain);

    if (validationErrors !== null) {
      doTrack(USERNAME_VALIDATION_ERROR);
      setError(validationErrors);
      setLoading(false);
      return;
    }

    let identity: Identity;
    let identityIndex: number;

    if (screen === ScreenName.USERNAME) {
      identity = wallet.identities[0];
      identityIndex = 0;
    } else {
      // we're in ScreenName.ADD_ACCOUNT
      identity = await wallet.createNewIdentity(DEFAULT_PASSWORD);
      identityIndex = wallet.identities.length - 1;
    }

    if (!wallet) {
      dispatch(doSetUsername(username));
      next();
      return;
    }

    try {
      await registerSubdomain({
        username,
        subdomain: Subdomain,
        gaiaHubUrl: gaiaUrl,
        identity,
      });
      doTrack(USERNAME_SUBMIT_SUCCESS);
      dispatch(didGenerateWallet(wallet));
      dispatch(doFinishSignIn({ identityIndex }));
    } catch (error) {
      doTrack(USERNAME_REGISTER_FAILED, { status: error.status });
      dispatch(doChangeScreen(ScreenName.REGISTRY_ERROR));
    }
  };

  return (
    <Screen onSubmit={onSubmit}>
      <PasswordManagerHiddenInput secretKey={secretKey} />
      <ScreenHeader />
      <ScreenBody
        mt={6}
        body={[
          <Box>
            <Title>Choose a username</Title>
            <Text mt={2} display="block">
              This is how people will find you in {name} and other apps you use with your Secret Key.
            </Text>
            <Box textAlign="left" position="relative" mt={4}>
              <Flex
                color="ink.400"
                pr={4}
                align="center"
                height="100%"
                zIndex={99}
                position="absolute"
                right={0}
                top={0}
              >
                <Text pt={'2px'}>.blockstack.id</Text>
              </Flex>
              <Input
                id={usernameInputId}
                name={usernameInputId}
                autoComplete="username"
                data-test="input-username"
                autoCapitalize="false"
                paddingRight="100px"
                autoFocus
                fontSize="16px"
                spellCheck={false}
                value={username}
                aria-invalid={error !== null}
                onChange={handleInput}
              />
            </Box>
            {error && hasAttemptedSubmit && (
              <ErrorLabel>
                <Text textAlign="left" display="block" textStyle="caption" color="feedback.error">
                  {errorTextMap[error]}
                </Text>
              </ErrorLabel>
            )}
          </Box>,
        ]}
      />
      <ScreenActions>
        <Button width="100%" size="lg" mt={6} data-test="button-username-continue" type="submit" isLoading={loading}>
          Continue
        </Button>
      </ScreenActions>
      <ScreenFooter>
        <PoweredBy />
      </ScreenFooter>
    </Screen>
  );
};
