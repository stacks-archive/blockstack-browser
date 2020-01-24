import React, { useState, ChangeEvent } from 'react';
import { Flex, Box, Text, Input } from '@blockstack/ui';
import { AppIcon } from '../../app-icon';
import { Link } from '../../../link';
import { doTrack, CONNECT_SAVED, CONNECT_INCORRECT, CONNECT_BACK } from '../../../../common/track';
import { useSelector } from 'react-redux';
import { AppState } from '../../../../store';
import { selectAppName, selectSecretKey } from '../../../../store/onboarding/selectors';
import { ScreenHeader } from '../../header';
import { ScreenBody, ScreenActions, ScreenFooter, Screen } from '../../screen';

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
      <ScreenHeader appIcon />
      <AppIcon />
      <ScreenBody
        title={`Connect ${appName} to your Data Vault`}
        body={[
          'Enter your Secret Key to continue.',
          <Box>
            {/*Validate, track: CONNECT_INCORRECT */}
            <Input
              autoFocus
              minHeight="80px"
              placeholder="12-word Secret Key"
              data-test="textarea-reinput-seed-phrase"
              as="textarea"
              aria-invalid={error}
              onChange={({ target }: ChangeEvent<HTMLInputElement>) => setSeedInput(target.value)}
            />
            {error && seedInput === '' && <ErrorText>You must enter your Secret Key</ErrorText>}
            {error && seedInput !== '' && <ErrorText>You{"'"}ve entered your 12-word Secret Key incorrectly</ErrorText>}
          </Box>,
        ]}
      />
      <ScreenActions
        action={{
          label: 'Continue',
          testAttr: 'button-confirm-reenter-seed-phrase',
          onClick: () => {
            if (seedInput !== seed) {
              doTrack(CONNECT_INCORRECT);
              setHasAttemptedContinue(true);
              return;
            }
            doTrack(CONNECT_SAVED);
            props.next();
          },
        }}
      />
      <ScreenFooter>
        <Flex>
          <Text>Didn’t save your Secret Key?</Text>{' '}
          <Link
            onClick={() => {
              doTrack(CONNECT_BACK);
              props.back();
            }}
            pl={1}
            color="blue"
          >
            Go Back
          </Link>
        </Flex>
        <Link>Help</Link>
      </ScreenFooter>
    </Screen>
  );
};
