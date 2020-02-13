import React, { useState, ChangeEvent } from 'react';
import { Flex, Box, Button, Text, Input } from '@blockstack/ui';
import { AppIcon } from '@components/app-icon';
import { Link } from '@components/link';
import { doTrack, CONNECT_SAVED, CONNECT_INCORRECT, CONNECT_BACK } from '@common/track';
import { useSelector } from 'react-redux';
import { AppState } from '@store';
import { selectAppName, selectSecretKey } from '@store/onboarding/selectors';

import { ScreenBody, ScreenActions, ScreenFooter, Screen, Title } from '@blockstack/connect';
import { ScreenHeader } from '@components/connected-screen-header';

const ErrorText: React.FC = ({ children }) => (
  <Text textAlign="left" display="block" color="#de0014" mt={2}>
    {children}
  </Text>
);

interface ConnectProps {
  next: () => void;
  back: () => void;
}

export const Connect: React.FC<ConnectProps> = props => {
  const { appName, seed } = useSelector((state: AppState) => ({
    appName: selectAppName(state),
    seed: selectSecretKey(state),
  }));
  const [seedInput, setSeedInput] = useState('');
  const [hasAttemptedContinue, setHasAttemptedContinue] = useState(false);
  const isSeedPhraseCorrect = seedInput === seed;
  const error = hasAttemptedContinue && !isSeedPhraseCorrect;
  return (
    <Screen textAlign="center">
      <ScreenHeader />
      <AppIcon size={72} mt={10} />
      <ScreenBody
        mt={4}
        body={[
          <Title>Connect {appName} to your Secret Key</Title>,
          <Box mt={6}>
            {/*Validate, track: CONNECT_INCORRECT */}
            <Input
              autoFocus
              minHeight="80px"
              placeholder="Enter your Secret Key"
              data-test="textarea-reinput-seed-phrase"
              as="textarea"
              aria-invalid={error}
              onChange={({ target }: ChangeEvent<HTMLInputElement>) => setSeedInput(target.value)}
              style={{ resize: 'none' }}
            />
            {error && seedInput === '' && <ErrorText>You must enter your Secret Key</ErrorText>}
            {error && seedInput !== '' && (
              <ErrorText>You&apos;ve entered your 12-word Secret Key incorrectly</ErrorText>
            )}
          </Box>,
        ]}
      />
      <ScreenActions>
        <Button
          size="md"
          onClick={() => {
            if (seedInput !== seed) {
              doTrack(CONNECT_INCORRECT);
              setHasAttemptedContinue(true);
              return;
            }
            doTrack(CONNECT_SAVED);
            props.next();
          }}
          mt={6}
          width="100%"
          data-test="button-confirm-reenter-seed-phrase"
        >
          Continue
        </Button>
      </ScreenActions>
      <ScreenFooter mt={6} justifySelf="flex-end" justifyContent="center">
        <Flex>
          <Text color="ink.600" textStyle={'body.small.medium'}>
            Didn’t save your Secret Key?
          </Text>{' '}
          <Link
            textStyle={'body.small.medium'}
            onClick={() => {
              doTrack(CONNECT_BACK);
              props.back();
            }}
            pl={1}
            color="blue"
            fontSize="12px"
          >
            Go Back
          </Link>
        </Flex>
      </ScreenFooter>
    </Screen>
  );
};
