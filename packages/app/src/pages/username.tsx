import React, { useState } from 'react';

import { Box, Button, Input, Text } from '@blockstack/ui';
import {
  PoweredBy,
  Screen,
  ScreenActions,
  ScreenBody,
  ScreenFooter,
  Title,
} from '@blockstack/connect';
import { ScreenHeader } from '@components/connected-screen-header';

import { useAppDetails } from '@common/hooks/useAppDetails';
import { useDispatch } from '@common/hooks/use-dispatch';
import { doFinishSignIn, doSetUsername } from '@store/onboarding/actions';
import { useWallet } from '@common/hooks/use-wallet';
import { UsernameRegistryError, ErrorReason } from './registery-error';

import { DEFAULT_PASSWORD, ScreenPaths } from '@store/onboarding/types';
import {
  Identity,
  IdentityNameValidityError,
  registerSubdomain,
  validateSubdomain,
} from '@blockstack/keychain';
import { didGenerateWallet } from '@store/wallet';
import { ErrorLabel } from '@components/error-label';
import { gaiaUrl, Subdomain } from '@common/constants';
import {
  USERNAME_REGISTER_FAILED,
  USERNAME_SUBMIT_SUCCESS,
  USERNAME_SUBMITTED,
  USERNAME_VALIDATION_ERROR,
} from '@common/track';
import { useAnalytics } from '@common/hooks/use-analytics';
import { useLocation } from 'react-router-dom';

const identityNameLengthError =
  'Your username should be at least 8 characters, with a maximum of 37 characters.';
const identityNameIllegalCharError =
  'You can only use lowercase letters (a–z), numbers (0–9), and underscores (_).';
const identityNameUnavailableError = 'This username is not available';
const errorTextMap = {
  [IdentityNameValidityError.MINIMUM_LENGTH]: identityNameLengthError,
  [IdentityNameValidityError.MAXIMUM_LENGTH]: identityNameLengthError,
  [IdentityNameValidityError.ILLEGAL_CHARACTER]: identityNameIllegalCharError,
  [IdentityNameValidityError.UNAVAILABLE]: identityNameUnavailableError,
};

export const Username: React.FC<{}> = () => {
  const { pathname } = useLocation();

  const { wallet } = useWallet();
  const dispatch = useDispatch();
  const { name } = useAppDetails();
  const { doTrack } = useAnalytics();

  const [error, setError] = useState<IdentityNameValidityError | null>(null);
  const [status, setStatus] = useState('initial');
  const [submissionError, setSubmissionError] = useState<ErrorReason | undefined>();
  document.title = `${name} with Blockstack`;
  const setLoadingStatus = () => setStatus('loading');
  const setErrorStatus = () => setStatus('error');

  const isLoading = status === 'loading';

  const [username, setUsername] = useState('');
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const handleInput = (evt: React.FormEvent<HTMLInputElement>) => {
    setError(null);
    setUsername(evt.currentTarget.value || '');
  };

  const onSubmit = async () => {
    setHasAttemptedSubmit(true);
    setLoadingStatus();

    doTrack(USERNAME_SUBMITTED);

    const validationErrors = await validateSubdomain(username, Subdomain);

    if (validationErrors !== null) {
      doTrack(USERNAME_VALIDATION_ERROR);
      setError(validationErrors);
      setErrorStatus();
      return;
    }

    if (!wallet) {
      dispatch(doSetUsername(username));
      return;
    }

    let identity: Identity;
    let identityIndex: number;

    if (pathname === ScreenPaths.USERNAME) {
      identity = wallet.identities[0];
      identityIndex = 0;
    } else {
      // we're in ScreenPaths.ADD_ACCOUNT
      identity = await wallet.createNewIdentity(DEFAULT_PASSWORD);
      identityIndex = wallet.identities.length - 1;
    }

    try {
      await registerSubdomain({
        username,
        subdomain: Subdomain,
        gaiaHubUrl: gaiaUrl,
        identity,
      });
      doTrack(USERNAME_SUBMIT_SUCCESS);
      await dispatch(didGenerateWallet(wallet));
      await dispatch(doFinishSignIn({ identityIndex }));
    } catch (error) {
      doTrack(USERNAME_REGISTER_FAILED, { status: error.status });
      if (error.status === 409) {
        setSubmissionError('rateLimited');
      } else {
        setSubmissionError('network');
      }
    }
  };

  if (submissionError) {
    return (
      <UsernameRegistryError
        errorReason={submissionError}
        onTryAgain={() => {
          setSubmissionError(undefined);
          setLoadingStatus();
          onSubmit();
        }}
      />
    );
  }

  return (
    <Screen onSubmit={onSubmit}>
      <ScreenHeader />
      <ScreenBody
        mt={6}
        body={[
          <Box>
            <Title>Choose a username</Title>
            <Text mt={2} display="block">
              This is how people will find you in {name} and other apps you use with your Secret
              Key.
            </Text>
            <Box textAlign="left" position="relative" mt={4}>
              <Input
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
                autoCorrect="off"
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
        <Button
          width="100%"
          size="lg"
          mt={6}
          data-test="button-username-continue"
          type="submit"
          isDisabled={isLoading}
          isLoading={isLoading}
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
