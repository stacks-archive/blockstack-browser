import React, { useState } from 'react';

import { Box, Flex, Input, Text, Button } from '@blockstack/ui';
import { Screen, ScreenBody, ScreenActions, Title } from '@blockstack/connect';
import { ScreenHeader } from '@components/connected-screen-header';

import { getRandomWord } from '@common/utils';
import { useAppDetails } from '@common/hooks/useAppDetails';
import { useDispatch, useSelector } from 'react-redux';
import { doSetUsername, doFinishSignIn } from 'store/onboarding/actions';
import { selectCurrentWallet } from '@store/wallet/selectors';
import { AppState } from '@store';
import { DEFAULT_PASSWORD } from '@store/onboarding/types';
import { registerSubdomain, Subdomains } from '@blockstack/keychain';
import { didGenerateWallet } from '@store/wallet';
import { gaiaUrl } from '@common/constants';

const randomUsername = `${getRandomWord()}-${getRandomWord()}-${getRandomWord()}-${getRandomWord()}`;

interface UsernameProps {
  next: () => void;
}

export const Username: React.FC<UsernameProps> = ({ next }) => {
  const dispatch = useDispatch();
  const { name } = useAppDetails();

  const { wallet } = useSelector((state: AppState) => ({
    wallet: selectCurrentWallet(state),
  }));

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(randomUsername);

  const handleInput = (evt: React.FormEvent<HTMLInputElement>) => {
    setError('');
    setUsername(evt.currentTarget.value || '');
  };

  return (
    <Screen isLoading={loading}>
      <ScreenHeader />
      <ScreenBody
        mt={4}
        body={[
          <Box>
            <Title>Choose a username</Title>
            <Text mt={2} display="block">
              This is how people will find you in {name} and other apps you use with Data Vault.
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
                value={username}
                onChange={handleInput}
              />
              {error && (
                <Text textAlign="left" textStyle="caption" color="feedback.error">
                  {error}
                </Text>
              )}
            </Box>
          </Box>,
        ]}
      />
      <ScreenActions>
        <Button
          width="100%"
          size="md"
          mt={6}
          data-test="button-username-continue"
          onClick={async () => {
            if (wallet) {
              setLoading(true);
              const identity = await wallet.createNewIdentity(DEFAULT_PASSWORD);
              await registerSubdomain({
                username,
                subdomain: Subdomains.TEST,
                gaiaHubUrl: gaiaUrl,
                identity,
              });
              dispatch(didGenerateWallet(wallet));
              dispatch(doFinishSignIn({ identityIndex: wallet.identities.length - 1 }));
              return;
            }

            dispatch(doSetUsername(username));
            next();
          }}
        >
          Continue
        </Button>
      </ScreenActions>
    </Screen>
  );
};
