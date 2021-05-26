import React, { useState } from 'react';
import { Box, Text, Button, Input } from '@stacks/ui';
import { PopupContainer } from '@components/popup/container';
import { useWallet } from '@common/hooks/use-wallet';
import { buildEnterKeyEvent } from '@components/link';
// import { ErrorLabel } from '@components/error-label';
import { useOnboardingState } from '@common/hooks/auth/use-onboarding-state';
import { Header } from '@components/header';

export const Username: React.FC = () => {
  const { wallet, currentAccount, setWallet, doFinishSignIn } = useWallet();
  const { decodedAuthRequest } = useOnboardingState();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  if (!wallet || !currentAccount) {
    return null;
  }
  const onSubmit = async () => {
    setLoading(true);

    try {
      // TODO: implement new BNS registrar
      // await registerSubdomain({
      //   username,
      //   subdomain: Subdomain,
      //   gaiaHubUrl: gaiaUrl,
      //   identity: currentAccount,
      // });
      setWallet(wallet);
      if (decodedAuthRequest) {
        await doFinishSignIn(0);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <PopupContainer header={<Header title="Choose a username" />}>
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
          {/* {error && (
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
          )} */}
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
