import React, { useState } from 'react';
import { Box, Text, Button, Input } from '@stacks/ui';
import { PopupContainer } from '@components/popup/container';
import { IdentityNameValidityError, registerSubdomain, validateSubdomain } from '@stacks/keychain';
import { useWallet } from '@common/hooks/use-wallet';
import { gaiaUrl, Subdomain } from '@common/constants';
import { buildEnterKeyEvent } from '@components/link';
import { ErrorLabel } from '@components/error-label';
import { useOnboardingState } from '@common/hooks/use-onboarding-state';

const identityNameLengthError =
  'Your username should be at least 8 characters, with a maximum of 37 characters.';
const identityNameIllegalCharError =
  'You can only use lowercase letters (a–z), numbers (0–9), and underscores (_).';
const identityNameUnavailableError = 'This username is not available';
export const errorTextMap = {
  [IdentityNameValidityError.MINIMUM_LENGTH]: identityNameLengthError,
  [IdentityNameValidityError.MAXIMUM_LENGTH]: identityNameLengthError,
  [IdentityNameValidityError.ILLEGAL_CHARACTER]: identityNameIllegalCharError,
  [IdentityNameValidityError.UNAVAILABLE]: identityNameUnavailableError,
};

export const Username: React.FC = () => {
  const { wallet, currentIdentity, setWallet, doFinishSignIn } = useWallet();
  const { decodedAuthRequest } = useOnboardingState();
  const [username, setUsername] = useState('');
  const [error, setError] = useState<IdentityNameValidityError | null>(null);
  const [loading, setLoading] = useState(false);

  if (!wallet || !currentIdentity) {
    return null;
  }
  const onSubmit = async () => {
    setLoading(true);
    const validationError = await validateSubdomain(username, Subdomain);
    setError(validationError);

    if (validationError !== null) {
      // doTrack(USERNAME_VALIDATION_ERROR);
      setLoading(false);
      return;
    }

    try {
      await registerSubdomain({
        username,
        subdomain: Subdomain,
        gaiaHubUrl: gaiaUrl,
        identity: currentIdentity,
      });
      setWallet(wallet);
      if (decodedAuthRequest) {
        await doFinishSignIn(0);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <PopupContainer title="Choose a username">
      <Box my="base">
        <Text fontSize={2}>This is how others will see you in Stacks apps.</Text>
      </Box>
      <Box flexGrow={[1, 1, 0.5]} />
      <Box>
        <Box>
          <Input
            display="block"
            width="100%"
            autoFocus
            isDisabled={loading}
            value={username}
            onChange={(evt: React.FormEvent<HTMLInputElement>) =>
              setUsername(evt.currentTarget.value)
            }
            onKeyPress={buildEnterKeyEvent(onSubmit)}
            name="username"
            data-test="username-input"
          />
        </Box>
        <Box position="relative">
          {error && (
            <ErrorLabel>
              <Text
                textAlign="left"
                display="block"
                textStyle="caption"
                color="feedback.error"
                position="relative"
                top="5px"
              >
                {errorTextMap[error]}
              </Text>
            </ErrorLabel>
          )}
        </Box>
        <Box width="100%" my="base">
          <Button
            width="100%"
            mode="primary"
            onClick={onSubmit}
            isLoading={loading}
            data-test="username-button"
          >
            Add username
          </Button>
        </Box>
      </Box>
    </PopupContainer>
  );
};
