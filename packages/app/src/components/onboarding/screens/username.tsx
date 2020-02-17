import React, { useState } from 'react';

import { Box, Flex, Input, Text, Button } from '@blockstack/ui';
import { Screen, ScreenBody, ScreenActions, Title, PoweredBy, ScreenFooter } from '@blockstack/connect';
import { ScreenHeader } from '@components/connected-screen-header';
import useDocumentTitle from '@rehooks/document-title';

import { useAppDetails } from '@common/hooks/useAppDetails';
import { useDispatch, useSelector } from 'react-redux';
import { doSetUsername, doFinishSignIn } from '@store/onboarding/actions';
import { selectCurrentWallet } from '@store/wallet/selectors';
import { AppState } from '@store';
import { DEFAULT_PASSWORD } from '@store/onboarding/types';
import { registerSubdomain, IdentityNameValidityError, validateSubdomain } from '@blockstack/keychain';
import { didGenerateWallet } from '@store/wallet';
import { ErrorLabel } from '@components/error-label';
import { gaiaUrl, Subdomain } from '@common/constants';

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
  const title = 'Choose a username';
  useDocumentTitle(title);
  const dispatch = useDispatch();
  const { name } = useAppDetails();

  const { wallet } = useSelector((state: AppState) => ({
    wallet: selectCurrentWallet(state),
  }));

  const [error, setError] = useState<IdentityNameValidityError | null>(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const handleInput = (evt: React.FormEvent<HTMLInputElement>) => {
    setError(null);
    setUsername(evt.currentTarget.value || '');
  };

  const onSubmit = async () => {
    setHasAttemptedSubmit(true);
    setCheckingAvailability(true);

    const validationErrors = await validateSubdomain(username, Subdomain);

    if (validationErrors !== null) {
      setError(validationErrors);
      setCheckingAvailability(false);
      return;
    }

    if (!wallet) {
      dispatch(doSetUsername(username));
      next();
      return;
    }
    setLoading(true);
    const identity = await wallet.createNewIdentity(DEFAULT_PASSWORD);
    await registerSubdomain({
      username,
      subdomain: Subdomain,
      gaiaHubUrl: gaiaUrl,
      identity,
    });
    setCheckingAvailability(false);
    dispatch(didGenerateWallet(wallet));
    dispatch(doFinishSignIn({ identityIndex: wallet.identities.length - 1 }));
  };

  return (
    <Screen onSubmit={onSubmit} isLoading={loading}>
      <ScreenHeader />
      <ScreenBody
        mt={6}
        body={[
          <Box>
            <Title>{title}</Title>
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
                data-test="input-username"
                paddingRight="100px"
                autoFocus
                placeholder="username"
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
        <Button
          width="100%"
          size="md"
          mt={6}
          data-test="button-username-continue"
          type="submit"
          onClick={async event => {
            event.preventDefault();
            return onSubmit();
          }}
          isLoading={checkingAvailability}
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
